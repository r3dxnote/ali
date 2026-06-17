import fs from 'fs';
import path from 'path';

const apiKey = process.env.API_FOOTBALL_KEY;
if (!apiKey) {
  console.error("ERROR: API_FOOTBALL_KEY environment variable is not defined.");
  process.exit(1);
}

async function runProbe() {
  console.log("Starting API-Football connectivity probe...");

  const baseApiUrl = "https://v3.football.api-sports.io";
  const leagueId = "1";
  const season = "2026";

  const endpoints = {
    status: `${baseApiUrl}/status`,
    leaguesSearch: `${baseApiUrl}/leagues?search=world cup`,
    leagueLookup: `${baseApiUrl}/leagues?id=${leagueId}`,
    fixtures: `${baseApiUrl}/fixtures?league=${leagueId}&season=${season}`,
    standings: `${baseApiUrl}/standings?league=${leagueId}&season=${season}`,
    teams: `${baseApiUrl}/teams?league=${leagueId}&season=${season}`,
    liveFixtures: `${baseApiUrl}/fixtures?live=all`
  };

  const results = {
    timestamp: new Date().toISOString(),
    providerName: "API-Football v3",
    candidateLeagueId: leagueId,
    season: season,
    endpoints: {},
    conclusion: {
      hasApiAccess: false,
      hasWorldCupLeagueCandidate: false,
      hasSeasonFixtures2026: false,
      hasStandings2026: false,
      hasTeams2026: false,
      hasLiveEndpoint: false,
      hasEventsEndpointIfTested: false
    },
    limitations: [
      "free plan has low daily request limit",
      "free plan may restrict some seasons/competitions",
      "live endpoint may be empty if no live match is currently active",
      "no UI integration in V1-F-A"
    ]
  };

  let firstFixtureId = null;

  for (const [key, url] of Object.entries(endpoints)) {
    const pathUsed = url.replace(baseApiUrl, '');
    console.log(`Probing: ${key} (path: ${pathUsed})...`);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-apisports-key': apiKey,
          'Accept': 'application/json'
        }
      });

      const statusCode = response.status;
      const ok = response.ok;
      let json = null;
      let parseError = null;

      try {
        json = await response.json();
      } catch (err) {
        parseError = err.message;
      }

      const summary = {
        endpointKey: key,
        path: pathUsed,
        statusCode: statusCode,
        ok: ok,
        topLevelKeys: json ? Object.keys(json) : [],
        apiErrors: (json && json.errors && Object.keys(json.errors).length > 0) ? json.errors : null,
        apiResultsCount: json ? json.results : null,
        detectedArrayLength: (json && Array.isArray(json.response)) ? json.response.length : null,
        firstItemKeys: null,
        first3ItemsSummary: null
      };

      if (ok && json && Array.isArray(json.response)) {
        const responseArray = json.response;
        if (responseArray.length > 0) {
          const firstItem = responseArray[0];
          summary.firstItemKeys = Object.keys(firstItem);

          // Update conclusion flags
          if (key === 'status') results.conclusion.hasApiAccess = true;
          if (key === 'leagueLookup') results.conclusion.hasWorldCupLeagueCandidate = true;
          if (key === 'fixtures') {
            results.conclusion.hasSeasonFixtures2026 = true;
            firstFixtureId = firstItem.fixture?.id || null;
          }
          if (key === 'standings') results.conclusion.hasStandings2026 = true;
          if (key === 'teams') results.conclusion.hasTeams2026 = true;
          if (key === 'liveFixtures') results.conclusion.hasLiveEndpoint = true;

          // Summarize top 3 items
          if (key === 'fixtures' || key === 'liveFixtures') {
            summary.first3ItemsSummary = responseArray.slice(0, 3).map(summarizeFixture);
          } else if (key === 'leaguesSearch' || key === 'leagueLookup') {
            summary.first3ItemsSummary = responseArray.slice(0, 3).map(summarizeLeague);
          } else if (key === 'standings') {
            const flatStandings = [];
            for (const item of responseArray) {
              const flattened = summarizeStandings(item);
              if (flattened) flatStandings.push(...flattened);
            }
            summary.first3ItemsSummary = flatStandings.slice(0, 3);
          } else if (key === 'teams') {
            summary.first3ItemsSummary = responseArray.slice(0, 3).map(summarizeTeam);
          } else {
            summary.first3ItemsSummary = responseArray.slice(0, 3);
          }
        } else {
          summary.first3ItemsSummary = [];
          if (key === 'status') results.conclusion.hasApiAccess = true;
          if (key === 'liveFixtures') results.conclusion.hasLiveEndpoint = true;
        }
      } else {
        if (key === 'status' && ok && json && json.response) {
          results.conclusion.hasApiAccess = true;
          summary.detectedArrayLength = null;
          summary.firstItemKeys = Object.keys(json.response);
          summary.first3ItemsSummary = [json.response];
        }
      }

      results.endpoints[key] = summary;
    } catch (error) {
      console.error(`Fetch error for ${key}:`, error.message);
      results.endpoints[key] = {
        endpointKey: key,
        path: pathUsed,
        ok: false,
        fetchError: error.message
      };
    }
  }

  // Probe optional fixture events if we found a fixture ID
  if (firstFixtureId) {
    const key = 'fixtureEvents';
    const pathUsed = `/fixtures/events?fixture=${firstFixtureId}`;
    const url = `${baseApiUrl}/fixtures/events?fixture=${firstFixtureId}`;
    console.log(`Probing optional fixture events for fixture ID: ${firstFixtureId}...`);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-apisports-key': apiKey,
          'Accept': 'application/json'
        }
      });

      const statusCode = response.status;
      const ok = response.ok;
      let json = null;
      let parseError = null;

      try {
        json = await response.json();
      } catch (err) {
        parseError = err.message;
      }

      const summary = {
        endpointKey: key,
        path: pathUsed,
        statusCode: statusCode,
        ok: ok,
        topLevelKeys: json ? Object.keys(json) : [],
        apiErrors: (json && json.errors && Object.keys(json.errors).length > 0) ? json.errors : null,
        apiResultsCount: json ? json.results : null,
        detectedArrayLength: (json && Array.isArray(json.response)) ? json.response.length : null,
        firstItemKeys: null,
        first3ItemsSummary: null
      };

      if (ok && json && Array.isArray(json.response)) {
        results.conclusion.hasEventsEndpointIfTested = true;
        const responseArray = json.response;
        if (responseArray.length > 0) {
          summary.firstItemKeys = Object.keys(responseArray[0]);
          summary.first3ItemsSummary = responseArray.slice(0, 3).map(summarizeFixtureEvent);
        } else {
          summary.first3ItemsSummary = [];
        }
      }

      results.endpoints[key] = summary;
    } catch (error) {
      console.error(`Fetch error for ${key}:`, error.message);
      results.endpoints[key] = {
        endpointKey: key,
        path: pathUsed,
        ok: false,
        fetchError: error.message
      };
    }
  }

  // Ensure artifacts/ folder exists
  const artifactsDir = path.join(process.cwd(), 'artifacts');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  const outputPath = path.join(artifactsDir, 'api-football-probe-result.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Probe report saved successfully to: ${outputPath}`);
  console.log("API-Football probe completed.");
}

function summarizeFixture(item) {
  if (!item) return null;
  return {
    fixtureId: item.fixture?.id || null,
    fixtureDate: item.fixture?.date || null,
    statusShort: item.fixture?.status?.short || null,
    statusLong: item.fixture?.status?.long || null,
    leagueId: item.league?.id || null,
    leagueName: item.league?.name || null,
    leagueSeason: item.league?.season || null,
    homeTeamName: item.teams?.home?.name || null,
    awayTeamName: item.teams?.away?.name || null,
    goalsHome: item.goals?.home ?? null,
    goalsAway: item.goals?.away ?? null,
    scoreFulltimeHome: item.score?.fulltime?.home ?? null,
    scoreFulltimeAway: item.score?.fulltime?.away ?? null
  };
}

function summarizeLeague(item) {
  if (!item) return null;
  return {
    leagueId: item.league?.id || null,
    leagueName: item.league?.name || null,
    leagueType: item.league?.type || null,
    countryName: item.country?.name || null,
    seasonYears: Array.isArray(item.seasons) ? item.seasons.map(s => s.year) : []
  };
}

function summarizeStandings(item) {
  if (!item || !item.league) return null;
  const leagueId = item.league.id || null;
  const leagueName = item.league.name || null;
  const season = item.league.season || null;
  
  const summarizedStandings = [];
  if (Array.isArray(item.league.standings)) {
    for (const group of item.league.standings) {
      if (Array.isArray(group)) {
        for (const teamStanding of group) {
          summarizedStandings.push({
            leagueId: leagueId,
            leagueName: leagueName,
            season: season,
            teamId: teamStanding.team?.id || null,
            teamName: teamStanding.team?.name || null,
            rank: teamStanding.rank || null,
            points: teamStanding.points ?? null,
            goalsDiff: teamStanding.goalsDiff ?? null,
            allPlayed: teamStanding.all?.played ?? null,
            allWin: teamStanding.all?.win ?? null,
            allDraw: teamStanding.all?.draw ?? null,
            allLose: teamStanding.all?.lose ?? null
          });
        }
      }
    }
  }
  return summarizedStandings;
}

function summarizeTeam(item) {
  if (!item || !item.team) return null;
  return {
    teamId: item.team.id || null,
    teamName: item.team.name || null,
    teamCode: item.team.code || null,
    teamCountry: item.team.country || null,
    teamNational: item.team.national ?? null
  };
}

function summarizeFixtureEvent(item) {
  if (!item) return null;
  return {
    timeElapsed: item.time?.elapsed ?? null,
    timeExtra: item.time?.extra ?? null,
    teamName: item.team?.name || null,
    playerName: item.player?.name || null,
    assistName: item.assist?.name || null,
    type: item.type || null,
    detail: item.detail || null
  };
}

runProbe();
