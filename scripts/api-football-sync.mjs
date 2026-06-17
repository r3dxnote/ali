import fs from 'fs';
import path from 'path';

const apiKey = process.env.API_FOOTBALL_KEY;
if (!apiKey) {
  console.error("ERROR: API_FOOTBALL_KEY environment variable is not defined.");
  process.exit(1);
}

const baseApiUrl = "https://v3.football.api-sports.io";
const leagueId = "1";
const season = "2026";

async function fetchFromApi(endpoint) {
  const url = `${baseApiUrl}${endpoint}`;
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
}

async function main() {
  try {
    console.log("Starting API-Football live data sync...");

    // 1. Fetch Teams to build mapping & normalize
    console.log("Fetching teams...");
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

    // 2. Fetch Standings & normalize
    console.log("Fetching standings...");
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

    // Build teamId to groupName Map from standings
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

    // 3. Fetch Fixtures
    console.log("Fetching all fixtures...");
    const fixturesData = await fetchFromApi(`/fixtures?league=${leagueId}&season=${season}`);
    const rawFixtures = fixturesData.response || [];

    // 4. Fetch Live Fixtures from global live endpoint
    console.log("Fetching live fixtures feed...");
    let liveFeed = [];
    try {
      const liveData = await fetchFromApi("/fixtures?live=all");
      liveFeed = liveData.response || [];
    } catch (err) {
      console.warn("Warning: Failed to fetch live feed (live=all), continuing with main list:", err.message);
    }

    // Filter live feed to league 1 season 2026
    const activeLiveFeed = liveFeed.filter(f => f.league?.id === parseInt(leagueId) && f.league?.season === parseInt(season));
    const activeLiveFeedMap = new Map(activeLiveFeed.map(f => [f.fixture.id, f]));

    // Track live fixtures and finished fixtures for event lookup
    const liveFixtureIds = new Set();
    const finishedFixtures = [];

    const normalizedMatches = rawFixtures.map(f => {
      const fix = f.fixture;
      const teams = f.teams;
      const goals = f.goals;
      const score = f.score;

      if (!fix) return null;

      // Check if this fixture is active in the live feed to update it
      let currentFix = fix;
      let currentTeams = teams;
      let currentGoals = goals;
      let currentScore = score;

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

      // Convert UTC date to Saudi Arabian Time (UTC+3)
      const { dateSaudi, timeSaudi } = getSaudiDateTime(currentFix.timestamp);

      // Look up codes if missing in the fixture teams object
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

    // 5. Determine which fixtures to fetch events for:
    // a. All currently live fixtures
    // b. Latest 3 finished fixtures
    const latestFinished = finishedFixtures
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3)
      .map(f => f.id);

    const eventFixtureIds = new Set([...liveFixtureIds, ...latestFinished]);

    console.log(`Live fixtures count: ${liveFixtureIds.size}. Fetching events for: ${eventFixtureIds.size} fixtures total.`);

    const eventsResult = {
      updatedAt: new Date().toISOString(),
      source: "API-Football",
      fixtures: {}
    };

    for (const fid of eventFixtureIds) {
      console.log(`Fetching events for fixture ${fid}...`);
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
        console.error(`Failed to fetch events for fixture ${fid}:`, err.message);
      }
    }

    // 6. Normalize and write meta.json
    const metaResult = {
      updatedAt: new Date().toISOString(),
      provider: "API-Football",
      leagueId: parseInt(leagueId),
      season: parseInt(season),
      requestBudgetNote: "Sync queries 4 endpoints by default (teams, standings, fixtures, live). Events queried only for live and latest 3 matches. Max 7 requests per sync run.",
      generatedBy: "api-football-sync",
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

    // Ensure assets/data/live exists
    const dataDir = path.join(process.cwd(), 'assets', 'data', 'live');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write all normalized JSON files
    fs.writeFileSync(path.join(dataDir, 'meta.json'), JSON.stringify(metaResult, null, 2), 'utf-8');
    fs.writeFileSync(path.join(dataDir, 'matches.json'), JSON.stringify(normalizedMatches, null, 2), 'utf-8');
    fs.writeFileSync(path.join(dataDir, 'standings.json'), JSON.stringify(normalizedStandings, null, 2), 'utf-8');
    fs.writeFileSync(path.join(dataDir, 'teams.json'), JSON.stringify(normalizedTeams, null, 2), 'utf-8');
    fs.writeFileSync(path.join(dataDir, 'events.json'), JSON.stringify(eventsResult, null, 2), 'utf-8');

    console.log("API-Football live data sync completed successfully.");
  } catch (err) {
    console.error("Critical error in sync script:", err.message);
    process.exit(1);
  }
}

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

main();
