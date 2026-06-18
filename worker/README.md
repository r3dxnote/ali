# Almerkaz Cloudflare Worker Live API & Snapshot Engine

This is the Cloudflare Worker Live API & Snapshot Engine for **المركاز (Almerkaz)**. It provides real-time, CORS-enabled endpoints for World Cup data and coordinates scheduled background synchronizations directly with API-Football, caching results in Cloudflare KV to bypass GitHub Pages/Actions build delays.

---

## 🛠️ Infrastructure Caching & Rate Limit Mitigation

To prevent provider rate-limit exhaustion (e.g. `Too many requests...` API errors), the engine includes:
1. **Minimal-first fetch strategy:** Core schedules (fixtures and live feed) are fetched first. Standings and teams are fetched afterwards, or reused from cache.
2. **Staggered request delays:** Small configurable delays are injected between API requests to prevent bursting.
3. **Static data cache reuse:** Standings and team data (which change rarely) are reused from the active KV cache for a configurable duration, reducing total requests per sync run.
4. **Partial snapshot fallback:** If standings or teams fetches are rate-limited, the sync completes in **partial mode**, deriving team metadata from the match schedules and setting `partial: true` with warning logs.
5. **Rate-limit detection (HTTP 429 & Custom error payloads):** Preserves the latest working snapshot if the provider returns a rate limit, returning status `429` with detailed recovery diagnostics.
6. **Events capping:** Live match events fetches are restricted to a maximum of 2 active live fixtures per sync run.

---

## ⚙️ Configurable Variables (`wrangler.toml` / `[vars]`)

The following variables can be adjusted to tune performance:
* `LIVE_STALE_SECONDS` (Default: `120`): Maximum age of snapshot data during live match windows before it is marked stale.
* `GENERAL_STALE_SECONDS` (Default: `900`): Maximum age of snapshot data outside match windows before it is marked stale.
* `API_FOOTBALL_REQUEST_DELAY_MS` (Default: `1000`): Delay in milliseconds injected between sequential provider requests.
* `STATIC_REFRESH_SECONDS` (Default: `21600`): Maximum age (6 hours) of cached team and standings static data before a fresh refetch is attempted.

---

## 🚀 Setup & Local Development

### 1. Installation
Install local Wrangler devDependencies:
```bash
cd worker
npm install
```

### 2. Configure bindings in `wrangler.toml`
Take the KV Namespace IDs created via the Cloudflare CLI and bind them inside `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "ALMERKAZ_SNAPSHOT_KV"
id = "<PRODUCTION_KV_NAMESPACE_ID>"
preview_id = "<PREVIEW_KV_NAMESPACE_ID>"
```

### 3. Set secrets on Cloudflare
```bash
# Upload API-Football key
npx wrangler secret put API_FOOTBALL_KEY

# Upload Sync Admin Bearer Token
npx wrangler secret put SYNC_ADMIN_TOKEN
```

### For Local Emulation (Optional)
To test secrets locally, populate a `.dev.vars` file in the `worker/` directory:
```env
API_FOOTBALL_KEY=your_secret_api_sports_key
SYNC_ADMIN_TOKEN=your_custom_admin_bearer_string
```

### 4. Local Run
```bash
npm run dev
```

---

## 🧪 Testing Endpoints Locally

### 1. Health Status check
Check the health status and bindings configuration:
```bash
curl -X GET http://localhost:8787/health
```

### 2. Triggering a Manual Sync (/admin/sync)
Trigger the server-side API-Football fetch and update the KV cache snapshot:
```bash
curl -X POST http://localhost:8787/admin/sync \
  -H "Authorization: Bearer <your-configured-sync-admin-token>"
```

---

## 🕒 Cron Trigger (Background Sync)
Cloudflare triggers the `scheduled` hook at intervals configured in your `wrangler.toml` cron triggers. It refreshes the KV snapshot in the background.

To test the cron trigger locally:
```bash
npx wrangler dev --test-scheduled
```
Then trigger the schedule by querying:
```bash
curl -X GET http://localhost:8787/__scheduled
```

---

## 🌐 Transitioning the Frontend (Future V1-M-C Phase)

In the next phase (`V1-M-C`), the Almerkaz frontend (`assets/js/app.js`) will swap static JSON dependencies for the Live Worker API.

### How it will switch:
1. Detect worker hostname or configure a custom base:
   ```javascript
   const LIVE_API_BASE = "https://almerkaz-live-api.r3dxnote.workers.dev";
   ```
2. Modify fetch helpers to query the worker:
   ```javascript
   async function fetchLiveMatches() {
     try {
       const res = await fetch(`${LIVE_API_BASE}/matches`, { cache: 'no-store' });
       const json = await res.json();
       if (json.ok && Array.isArray(json.data)) {
         return json.data; // Serve live worker data
       }
     } catch (e) {
       console.warn("Fallback to static cache due to API issue:", e);
     }
     // Fallback to local static PWA cache if worker is down
     const fallbackRes = await fetch('./assets/data/live/matches.json');
     return await fallbackRes.json();
   }
   ```
