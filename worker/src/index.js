// دالة مساعدة لإنشاء ترويسات CORS المسموحة للتطوير والإنتاج
function getCorsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = [
    "https://r3dxnote.github.io"
  ];
  
  let allowOrigin = "https://r3dxnote.github.io"; // الافتراضي للحماية
  
  // التحقق من توافق الأصل مع المسموح به أو النطاق المحلي
  if (
    allowedOrigins.includes(origin) ||
    origin.startsWith("http://localhost:") ||
    origin === "http://localhost" ||
    origin.startsWith("http://127.0.0.1:") ||
    origin === "http://127.0.0.1"
  ) {
    allowOrigin = origin;
  }
  
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-apisports-key",
    "Access-Control-Max-Age": "86400"
  };
}

// دالة مساعدة لتوحيد شكل الاستجابة لـ GET و POST مع التغليف الكامل (full envelope)
function jsonResponseWrapper(data, status = 200, statusInfo = {}, corsHeaders = {}) {
  const body = {
    ok: status >= 200 && status < 300,
    source: statusInfo.source || "cloudflare-worker",
    updatedAt: statusInfo.updatedAt || new Date().toISOString(),
    stale: statusInfo.stale ?? false,
    ...(statusInfo.reason ? { reason: statusInfo.reason } : {}),
    data: data
  };
  
  return new Response(JSON.stringify(body, null, 2), {
    status: status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders
    }
  });
}

// دالة تحويل التوقيت العالمي (UTC) إلى توقيت السعودية (Saudi Arabia Time UTC+3)
function getSaudiDateTime(timestampSec) {
  if (!timestampSec) return { dateSaudi: null, timeSaudi: null };
  const saudiMs = (timestampSec + 3 * 3600) * 1000;
  const saudiDate = new Date(saudiMs);
  
  const yyyy = saudiDate.getUTCFullYear();
  const mm = String(saudiDate.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(saudiDate.getUTCDate()).padStart(2, '0');
  
  const hh = String(saudiDate.getUTCHours()).padStart(2, '0');
  const min = String(saudiDate.getUTCMinutes()).padStart(2, '0');
  
  return {
    dateSaudi: `${yyyy}-${mm}-${dd}`,
    timeSaudi: `${hh}:${min}`
  };
}

// محرك جلب ومزامنة وتطبيع البيانات من API-Football
async function performSync(env) {
  const apiKey = env.API_FOOTBALL_KEY;
  const baseUrl = env.API_FOOTBALL_BASE_URL || "https://v3.football.api-sports.io";
  const leagueId = env.API_FOOTBALL_LEAGUE_ID || "1";
  const season = env.API_FOOTBALL_SEASON || "2026";
  
  if (!apiKey) {
    throw new Error("API_FOOTBALL_KEY is missing/unconfigured.");
  }
  
  const fetchFromApi = async (endpoint) => {
    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-apisports-key': apiKey,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} for ${endpoint}`);
    }
    
    const json = await response.json();
    if (json.errors && Object.keys(json.errors).length > 0) {
      throw new Error(`API error: ${JSON.stringify(json.errors)} for ${endpoint}`);
    }
    
    return json;
  };
  
  // 1. جلب الفرق المشاركة
  console.log("Worker-Sync: Fetching teams...");
  const teamsData = await fetchFromApi(`/teams?league=${leagueId}&season=${season}`);
  const rawTeams = teamsData.response || [];
  const teamCodeMap = new Map();
  const teamLogoMap = new Map();
  
  const normalizedTeams = rawTeams.map(t => {
    const team = t.team;
    const venue = t.venue;
    if (team) {
      teamCodeMap.set(team.id, team.code);
      teamLogoMap.set(team.id, team.logo);
      return {
        id: team.id,
        name: team.name,
        code: team.code || null,
        country: team.country || null,
        national: team.national ?? null,
        logo: team.logo || null,
        venueName: venue?.name || null
      };
    }
    return null;
  }).filter(Boolean);
  
  // 2. جلب جدول الترتيب وتطبيعه
  console.log("Worker-Sync: Fetching standings...");
  const standingsData = await fetchFromApi(`/standings?league=${leagueId}&season=${season}`);
  const rawStandings = standingsData.response || [];
  
  let normalizedStandings = {
    leagueId: parseInt(leagueId),
    leagueName: "FIFA World Cup",
    season: parseInt(season),
    groups: []
  };
  
  let standingRowsCount = 0;
  if (rawStandings.length > 0) {
    const leagueInfo = rawStandings[0].league;
    normalizedStandings.leagueName = leagueInfo.name;
    
    if (Array.isArray(leagueInfo.standings)) {
      for (const group of leagueInfo.standings) {
        if (Array.isArray(group) && group.length > 0) {
          const groupName = group[0].group || "Group Stage";
          const rows = group.map(row => {
            standingRowsCount++;
            return {
              rank: row.rank,
              teamId: row.team?.id || null,
              teamName: row.team?.name || null,
              teamLogo: row.team?.logo || null,
              points: row.points,
              goalsDiff: row.goalsDiff,
              group: row.group || null,
              form: row.form || null,
              status: row.status || null,
              description: row.description || null,
              allPlayed: row.all?.played ?? 0,
              allWin: row.all?.win ?? 0,
              allDraw: row.all?.draw ?? 0,
              allLose: row.all?.lose ?? 0,
              goalsFor: row.all?.goals?.for ?? 0,
              goalsAgainst: row.all?.goals?.against ?? 0
            };
          });
          normalizedStandings.groups.push({
            name: groupName,
            standings: rows
          });
        }
      }
    }
  }
  
  // بناء خارطة لمعرفة مجموعة كل منتخب لتسهيل تصنيف المباريات
  const teamIdToGroupName = new Map();
  if (normalizedStandings && Array.isArray(normalizedStandings.groups)) {
    for (const group of normalizedStandings.groups) {
      if (/^Group [A-L]$/.test(group.name)) {
        for (const row of group.standings) {
          if (row.teamId) {
            teamIdToGroupName.set(row.teamId, group.name);
          }
        }
      }
    }
  }
  
  // 3. جلب جميع المباريات
  console.log("Worker-Sync: Fetching all fixtures...");
  const fixturesData = await fetchFromApi(`/fixtures?league=${leagueId}&season=${season}`);
  const rawFixtures = fixturesData.response || [];
  
  // 4. جلب التحديث المباشر للمباريات النشطة
  console.log("Worker-Sync: Fetching live fixtures feed...");
  let liveFeed = [];
  try {
    const liveData = await fetchFromApi("/fixtures?live=all");
    liveFeed = liveData.response || [];
  } catch (err) {
    console.warn("Worker-Sync Warning: Failed to fetch live feed (live=all):", err.message);
  }
  
  const activeLiveFeed = liveFeed.filter(f => f.league?.id === parseInt(leagueId) && f.league?.season === parseInt(season));
  const activeLiveFeedMap = new Map(activeLiveFeed.map(f => [f.fixture.id, f]));
  
  const liveFixtureIds = new Set();
  const finishedFixtures = [];
  
  const normalizedMatches = rawFixtures.map(f => {
    const fix = f.fixture;
    const teams = f.teams;
    const goals = f.goals;
    const score = f.score;
    
    if (!fix) return null;
    
    let currentFix = fix;
    let currentTeams = teams;
    let currentGoals = goals;
    let currentScore = score;
    
    // إذا كانت المباراة مباشرة، نستخدم تحديثاتها من التغذية النشطة
    if (activeLiveFeedMap.has(fix.id)) {
      const liveUpdate = activeLiveFeedMap.get(fix.id);
      currentFix = liveUpdate.fixture;
      currentTeams = liveUpdate.teams;
      currentGoals = liveUpdate.goals;
      currentScore = liveUpdate.score;
    }
    
    const statusShort = currentFix.status?.short || "TBD";
    const isLive = ['1H', '2H', 'ET', 'P', 'HT', 'BT', 'INT'].includes(statusShort);
    const isFinished = ['FT', 'AET', 'PEN'].includes(statusShort);
    const isScheduled = ['TBD', 'NS'].includes(statusShort);
    
    if (isLive) {
      liveFixtureIds.add(currentFix.id);
    }
    if (isFinished) {
      finishedFixtures.push({
        id: currentFix.id,
        timestamp: currentFix.timestamp
      });
    }
    
    const { dateSaudi, timeSaudi } = getSaudiDateTime(currentFix.timestamp);
    const homeCode = currentTeams?.home?.code || teamCodeMap.get(currentTeams?.home?.id) || null;
    const awayCode = currentTeams?.away?.code || teamCodeMap.get(currentTeams?.away?.id) || null;
    
    const homeTeamId = currentTeams?.home?.id;
    const awayTeamId = currentTeams?.away?.id;
    let matchedGroup = null;
    let groupSource = null;
    
    if (homeTeamId && awayTeamId) {
      const homeGroup = teamIdToGroupName.get(homeTeamId);
      const awayGroup = teamIdToGroupName.get(awayTeamId);
      if (homeGroup && awayGroup && homeGroup === awayGroup) {
        matchedGroup = homeGroup;
        groupSource = "standings";
      }
    }
    
    if (!matchedGroup) {
      matchedGroup = (f.league?.round && f.league.round.includes('Group')) ? f.league.round : null;
      groupSource = matchedGroup ? "fallback" : null;
    }
    
    return {
      id: currentFix.id,
      dateUtc: currentFix.date,
      dateSaudi: dateSaudi,
      timeSaudi: timeSaudi,
      timestamp: currentFix.timestamp,
      statusShort: statusShort,
      statusLong: currentFix.status?.long || null,
      elapsed: currentFix.status?.elapsed || null,
      round: f.league?.round || null,
      group: matchedGroup,
      groupSource: groupSource,
      venueName: currentFix.venue?.name || null,
      venueCity: currentFix.venue?.city || null,
      leagueId: f.league?.id || null,
      leagueName: f.league?.name || null,
      season: f.league?.season || null,
      homeTeam: {
        id: currentTeams?.home?.id || null,
        name: currentTeams?.home?.name || null,
        code: homeCode,
        logo: currentTeams?.home?.logo || null,
        winner: currentTeams?.home?.winner ?? null
      },
      awayTeam: {
        id: currentTeams?.away?.id || null,
        name: currentTeams?.away?.name || null,
        code: awayCode,
        logo: currentTeams?.away?.logo || null,
        winner: currentTeams?.away?.winner ?? null
      },
      goals: {
        home: currentGoals?.home ?? null,
        away: currentGoals?.away ?? null
      },
      score: {
        halftime: {
          home: currentScore?.halftime?.home ?? null,
          away: currentScore?.halftime?.away ?? null
        },
        fulltime: {
          home: currentScore?.fulltime?.home ?? null,
          away: currentScore?.fulltime?.away ?? null
        },
        extratime: {
          home: currentScore?.extratime?.home ?? null,
          away: currentScore?.extratime?.away ?? null
        },
        penalty: {
          home: currentScore?.penalty?.home ?? null,
          away: currentScore?.penalty?.away ?? null
        }
      },
      isLive,
      isFinished,
      isScheduled
    };
  }).filter(Boolean);
  
  // 5. جلب أحداث المباريات للنشطة ولآخر 3 منتهية
  const latestFinished = finishedFixtures
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3)
    .map(f => f.id);
  const eventFixtureIds = new Set([...liveFixtureIds, ...latestFinished]);
  
  console.log(`Worker-Sync: Live fixtures: ${liveFixtureIds.size}. Fetching events for: ${eventFixtureIds.size} total.`);
  
  const eventsResult = {
    updatedAt: new Date().toISOString(),
    source: "API-Football",
    fixtures: {}
  };
  
  for (const fid of eventFixtureIds) {
    console.log(`Worker-Sync: Fetching events for fixture ${fid}...`);
    try {
      const eventsData = await fetchFromApi(`/fixtures/events?fixture=${fid}`);
      const rawEvents = eventsData.response || [];
      eventsResult.fixtures[fid] = rawEvents.map(e => ({
        elapsed: e.time?.elapsed ?? null,
        extra: e.time?.extra ?? null,
        teamId: e.team?.id || null,
        teamName: e.team?.name || null,
        playerId: e.player?.id || null,
        playerName: e.player?.name || null,
        assistId: e.assist?.id || null,
        assistName: e.assist?.name || null,
        type: e.type || null,
        detail: e.detail || null,
        comments: e.comments || null
      }));
    } catch (err) {
      console.error(`Worker-Sync: Failed to fetch events for fixture ${fid}:`, err.message);
    }
  }
  
  // 6. بناء البيانات الوصفية (Metadata)
  const metaResult = {
    updatedAt: new Date().toISOString(),
    provider: "API-Football",
    leagueId: parseInt(leagueId),
    season: parseInt(season),
    requestBudgetNote: "Sync queries 4 endpoints by default. Events queried only for live and latest 3 matches. Max 7 requests per sync run.",
    generatedBy: "api-football-sync-worker",
    groupNormalization: "standings-team-map",
    counts: {
      matches: normalizedMatches.length,
      teams: normalizedTeams.length,
      standingRows: standingRowsCount,
      eventFixtures: Object.keys(eventsResult.fixtures).length,
      liveMatches: liveFixtureIds.size
    },
    disclaimer: "Unofficial fan project. Data provided by API-Football/API-SPORTS. Not affiliated with FIFA."
  };
  
  return {
    meta: metaResult,
    matches: normalizedMatches,
    standings: normalizedStandings,
    teams: normalizedTeams,
    events: eventsResult,
    updatedAt: new Date().toISOString(),
    source: "api-football",
    version: "v1-m-b"
  };
}

// بيانات وهمية احتياطية تُستدعى محلياً في حال عدم وجود KV
const mockMeta = {
  provider: "API-Football",
  leagueId: 1,
  season: 2026,
  requestBudgetNote: "Sync queries 4 endpoints by default. Local memory fallback dataset.",
  counts: {
    matches: 2,
    teams: 2,
    standingRows: 2,
    eventFixtures: 0,
    liveMatches: 0
  }
};

const mockMatches = [
  {
    id: 1489384,
    dateUtc: "2026-06-17T20:00:00Z",
    dateSaudi: "2026-06-17",
    timeSaudi: "23:00",
    timestamp: 1781812800,
    statusShort: "NS",
    statusLong: "Not Started",
    elapsed: null,
    round: "Group Stage - 1",
    group: "Group L",
    venueName: "Estadio Azteca",
    venueCity: "Mexico City",
    homeTeam: {
      id: 10,
      name: "England",
      code: "ENG",
      logo: "https://media.api-sports.io/football/teams/10.png"
    },
    awayTeam: {
      id: 3,
      name: "Croatia",
      code: "CRO",
      logo: "https://media.api-sports.io/football/teams/3.png"
    },
    goals: {
      home: null,
      away: null
    },
    score: {},
    isLive: false,
    isFinished: false,
    isScheduled: true
  },
  {
    id: 1489385,
    dateUtc: "2026-06-17T23:00:00Z",
    dateSaudi: "2026-06-18",
    timeSaudi: "02:00",
    timestamp: 1781823600,
    statusShort: "NS",
    statusLong: "Not Started",
    elapsed: null,
    round: "Group Stage - 1",
    group: "Group L",
    venueName: "MetLife Stadium",
    venueCity: "East Rutherford",
    homeTeam: {
      id: 1504,
      name: "Ghana",
      code: "GHA",
      logo: "https://media.api-sports.io/football/teams/1504.png"
    },
    awayTeam: {
      id: 11,
      name: "Panama",
      code: "PAN",
      logo: "https://media.api-sports.io/football/teams/11.png"
    },
    goals: {
      home: null,
      away: null
    },
    score: {},
    isLive: false,
    isFinished: false,
    isScheduled: true
  }
];

const mockStandings = {
  leagueId: 1,
  leagueName: "FIFA World Cup",
  season: 2026,
  groups: [
    {
      name: "Group L",
      standings: [
        {
          rank: 1,
          teamId: 10,
          teamName: "England",
          points: 0,
          goalsDiff: 0,
          group: "Group L",
          allPlayed: 0,
          allWin: 0,
          allDraw: 0,
          allLose: 0
        },
        {
          rank: 2,
          teamId: 3,
          teamName: "Croatia",
          points: 0,
          goalsDiff: 0,
          group: "Group L",
          allPlayed: 0,
          allWin: 0,
          allDraw: 0,
          allLose: 0
        }
      ]
    }
  ]
};

const mockTeams = [
  {
    id: 10,
    name: "England",
    code: "ENG",
    logo: "https://media.api-sports.io/football/teams/10.png"
  },
  {
    id: 3,
    name: "Croatia",
    code: "CRO",
    logo: "https://media.api-sports.io/football/teams/3.png"
  }
];

const mockEvents = {
  updatedAt: "2026-06-18T00:00:00.000Z",
  source: "API-Football",
  fixtures: {}
};

// دالة مساعدة لجلب اللقطة الحالية وتحديد حالة الصلاحية (staleness)
async function getActiveSnapshot(env) {
  let snapshot = null;
  let fromFallback = false;
  
  if (env.ALMERKAZ_SNAPSHOT_KV) {
    try {
      const raw = await env.ALMERKAZ_SNAPSHOT_KV.get("live:snapshot:v1");
      if (raw) {
        snapshot = JSON.parse(raw);
      }
    } catch (err) {
      console.error("Error reading ALMERKAZ_SNAPSHOT_KV:", err.message);
    }
  }
  
  if (!snapshot) {
    snapshot = {
      meta: mockMeta,
      matches: mockMatches,
      standings: mockStandings,
      teams: mockTeams,
      events: mockEvents,
      updatedAt: new Date(Date.now() - 3600000).toISOString(), // افتراضياً قبل ساعة
      source: "cloudflare-worker-fallback",
      version: "v1-m-b-mock"
    };
    fromFallback = true;
  }
  
  const updatedAtMs = new Date(snapshot.updatedAt).getTime();
  const nowMs = Date.now();
  const elapsedSeconds = Math.floor((nowMs - updatedAtMs) / 1000);
  
  const liveStaleLimit = parseInt(env.LIVE_STALE_SECONDS) || 120;
  const generalStaleLimit = parseInt(env.GENERAL_STALE_SECONDS) || 900;
  
  const hasLiveMatches = Array.isArray(snapshot.matches) && snapshot.matches.some(m => m.isLive);
  const staleLimit = hasLiveMatches ? liveStaleLimit : generalStaleLimit;
  
  const isStale = fromFallback || (elapsedSeconds > staleLimit);
  
  return {
    snapshot,
    stale: isStale,
    source: fromFallback ? "cloudflare-worker-fallback" : "cloudflare-worker",
    updatedAt: snapshot.updatedAt,
    reason: fromFallback ? "snapshot_not_available" : null
  };
}

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = getCorsHeaders(request);
    
    // التعامل مع Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }
    
    const url = new URL(request.url);
    const path = url.pathname;
    
    // مسار الإدارة المخصص للـ Sync اليدوي المحمي (POST ONLY)
    if (path === "/admin/sync") {
      if (request.method !== "POST") {
        return jsonResponseWrapper({ error: "Method Not Allowed" }, 405, { stale: false }, corsHeaders);
      }
      
      const authHeader = request.headers.get("Authorization");
      const expectedToken = env.SYNC_ADMIN_TOKEN;
      
      if (!expectedToken) {
        return jsonResponseWrapper({ error: "Configuration Error: SYNC_ADMIN_TOKEN is not defined on server." }, 500, { stale: false }, corsHeaders);
      }
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return jsonResponseWrapper({ error: "Unauthorized: Missing Bearer Token." }, 401, { stale: false }, corsHeaders);
      }
      
      const token = authHeader.substring(7).trim();
      if (token !== expectedToken.trim()) {
        return jsonResponseWrapper({ error: "Unauthorized: Invalid Token." }, 401, { stale: false }, corsHeaders);
      }
      
      if (!env.ALMERKAZ_SNAPSHOT_KV) {
        return jsonResponseWrapper({ error: "Configuration Error: ALMERKAZ_SNAPSHOT_KV binding is missing." }, 500, { stale: false }, corsHeaders);
      }
      if (!env.API_FOOTBALL_KEY) {
        return jsonResponseWrapper({ error: "Configuration Error: API_FOOTBALL_KEY secret is missing." }, 500, { stale: false }, corsHeaders);
      }
      
      try {
        console.log("Triggering manual sync...");
        const snapshot = await performSync(env);
        await env.ALMERKAZ_SNAPSHOT_KV.put("live:snapshot:v1", JSON.stringify(snapshot));
        return jsonResponseWrapper({
          success: true,
          message: "Sync completed and snapshot updated successfully.",
          counts: snapshot.meta.counts
        }, 200, { stale: false, updatedAt: snapshot.updatedAt }, corsHeaders);
      } catch (err) {
        console.error("Manual sync execution failed:", err.message);
        return jsonResponseWrapper({ error: "Sync Failed", message: err.message }, 500, { stale: false }, corsHeaders);
      }
    }
    
    // التأكد من أن جميع المسارات العامة الأخرى هي GET فقط
    if (request.method !== "GET") {
      return jsonResponseWrapper({ error: "Method Not Allowed" }, 405, { stale: false }, corsHeaders);
    }
    
    // المسارات العامة (GET)
    switch (path) {
      case "/health": {
        let latestSnapshotUpdatedAt = null;
        let isSnapshotStale = true;
        
        if (env.ALMERKAZ_SNAPSHOT_KV) {
          try {
            const raw = await env.ALMERKAZ_SNAPSHOT_KV.get("live:snapshot:v1");
            if (raw) {
              const snapObj = JSON.parse(raw);
              latestSnapshotUpdatedAt = snapObj.updatedAt;
              const updatedAtMs = new Date(snapObj.updatedAt).getTime();
              const nowMs = Date.now();
              const elapsedSeconds = Math.floor((nowMs - updatedAtMs) / 1000);
              
              const liveStaleLimit = parseInt(env.LIVE_STALE_SECONDS) || 120;
              const generalStaleLimit = parseInt(env.GENERAL_STALE_SECONDS) || 900;
              
              const hasLiveMatches = Array.isArray(snapObj.matches) && snapObj.matches.some(m => m.isLive);
              const staleLimit = hasLiveMatches ? liveStaleLimit : generalStaleLimit;
              isSnapshotStale = elapsedSeconds > staleLimit;
            }
          } catch (e) {
            console.error("Health check read KV error:", e.message);
          }
        }
        
        const healthData = {
          status: "healthy",
          version: "1.1.0",
          now: new Date().toISOString(),
          hasApiKey: !!env.API_FOOTBALL_KEY,
          hasSnapshotKv: !!env.ALMERKAZ_SNAPSHOT_KV,
          hasSyncAdminToken: !!env.SYNC_ADMIN_TOKEN,
          latestSnapshotUpdatedAt: latestSnapshotUpdatedAt,
          stale: isSnapshotStale
        };
        
        return jsonResponseWrapper(healthData, 200, { stale: false }, corsHeaders);
      }
      
      case "/meta": {
        const { snapshot, stale, source, updatedAt, reason } = await getActiveSnapshot(env);
        return jsonResponseWrapper(snapshot.meta, 200, { stale, source, updatedAt, reason }, corsHeaders);
      }
      
      case "/matches": {
        const { snapshot, stale, source, updatedAt, reason } = await getActiveSnapshot(env);
        return jsonResponseWrapper(snapshot.matches, 200, { stale, source, updatedAt, reason }, corsHeaders);
      }
      
      case "/standings": {
        const { snapshot, stale, source, updatedAt, reason } = await getActiveSnapshot(env);
        return jsonResponseWrapper(snapshot.standings, 200, { stale, source, updatedAt, reason }, corsHeaders);
      }
      
      case "/teams": {
        const { snapshot, stale, source, updatedAt, reason } = await getActiveSnapshot(env);
        return jsonResponseWrapper(snapshot.teams, 200, { stale, source, updatedAt, reason }, corsHeaders);
      }
      
      case "/events": {
        const { snapshot, stale, source, updatedAt, reason } = await getActiveSnapshot(env);
        return jsonResponseWrapper(snapshot.events, 200, { stale, source, updatedAt, reason }, corsHeaders);
      }
      
      default:
        return jsonResponseWrapper({ error: "Not Found", path: path }, 404, { stale: false }, corsHeaders);
    }
  },
  
  // معالجة المهام المجدولة (Cron Trigger) لتحديث الكاش في الخلفية تلقائياً
  async scheduled(event, env, ctx) {
    console.log("Scheduled sync run triggered.");
    
    if (!env.ALMERKAZ_SNAPSHOT_KV) {
      console.warn("Scheduled Sync skipped: ALMERKAZ_SNAPSHOT_KV binding is missing.");
      return;
    }
    if (!env.API_FOOTBALL_KEY) {
      console.warn("Scheduled Sync skipped: API_FOOTBALL_KEY secret is missing.");
      return;
    }
    
    ctx.waitUntil(
      (async () => {
        try {
          const snapshot = await performSync(env);
          await env.ALMERKAZ_SNAPSHOT_KV.put("live:snapshot:v1", JSON.stringify(snapshot));
          console.log("Scheduled sync completed successfully. Snapshot updated in KV.");
        } catch (err) {
          console.error("Scheduled sync execution failed:", err.message);
        }
      })()
    );
  }
};
