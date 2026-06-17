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
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-apisports-key",
    "Access-Control-Max-Age": "86400"
  };
}

// دالة مساعدة لتوحيد شكل الاستجابة
function jsonResponse(data, status = 200, corsHeaders = {}) {
  const body = {
    ok: status >= 200 && status < 300,
    source: "cloudflare-worker",
    updatedAt: new Date().toISOString(),
    stale: false,
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

// بيانات وهمية مؤقتة مطابقة لشكل المخرجات المطلوبة
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

export default {
  // معالجة طلبات الـ HTTP الواردة
  async fetch(request, env, ctx) {
    const corsHeaders = getCorsHeaders(request);
    
    // التعامل مع طلب Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }
    
    // التأكد من أن الطلب هو GET فقط
    if (request.method !== "GET") {
      return jsonResponse({ error: "Method Not Allowed" }, 405, corsHeaders);
    }
    
    const url = new URL(request.url);
    const path = url.pathname;
    
    // المسارات والـ Endpoints المحددة
    switch (path) {
      case "/health":
        return jsonResponse({
          status: "healthy",
          version: "1.0.0",
          hasApiKey: !!env.API_FOOTBALL_KEY,
          time: new Date().toISOString()
        }, 200, corsHeaders);
        
      case "/meta":
        return jsonResponse(mockMeta, 200, corsHeaders);
        
      case "/matches":
        return jsonResponse(mockMatches, 200, corsHeaders);
        
      case "/standings":
        return jsonResponse(mockStandings, 200, corsHeaders);
        
      case "/teams":
        return jsonResponse(mockTeams, 200, corsHeaders);
        
      case "/events":
        return jsonResponse(mockEvents, 200, corsHeaders);
        
      default:
        return jsonResponse({
          error: "Not Found",
          path: path
        }, 404, corsHeaders);
    }
  },
  
  // معالجة المهام المجدولة (Cron Trigger) للاستخدام المستقبلي في تحديث الكاش
  async scheduled(event, env, ctx) {
    console.log("Scheduled sync run triggered. Ready for API-Football integration.");
  }
};
