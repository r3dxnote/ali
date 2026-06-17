# Almerkaz Cloudflare Worker Live API & Snapshot Engine

This is the Cloudflare Worker Live API & Snapshot Engine for **المركاز (Almerkaz)**. It provides real-time, CORS-enabled endpoints for World Cup data and coordinates scheduled background synchronizations directly with API-Football, caching results in Cloudflare KV to bypass GitHub Pages/Actions build delays.

---

## 🛠️ Infrastructure Provisioning & Caching (KV)

To persist normalized snapshots, the worker utilizes Cloudflare KV Storage.

### 1. Create KV Namespaces
Run the following commands in the CLI to generate your production and preview KV namespaces:
```bash
# Production Namespace
npx wrangler kv:namespace create ALMERKAZ_SNAPSHOT_KV

# Preview Namespace (for local staging/checks)
npx wrangler kv:namespace create ALMERKAZ_SNAPSHOT_KV --preview
```

### 2. Configure bindings in `wrangler.toml`
Take the output IDs returned from the console commands above and bind them to the KV namespace block inside `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "ALMERKAZ_SNAPSHOT_KV"
id = "<PRODUCTION_KV_NAMESPACE_ID>"
preview_id = "<PREVIEW_KV_NAMESPACE_ID>"
```

---

## 🔒 Secrets Binding & Token Management

The engine requires two secure variables. **Never check in or expose these secrets in code.**

### 1. Set API-Football Key (`API_FOOTBALL_KEY`)
Upload your subscription key securely to Cloudflare:
```bash
npx wrangler secret put API_FOOTBALL_KEY
```

### 2. Set Admin Auth Token (`SYNC_ADMIN_TOKEN`)
Choose a secure, random string to protect the manual sync endpoint `/admin/sync`. Upload it to Cloudflare:
```bash
npx wrangler secret put SYNC_ADMIN_TOKEN
```

### For Local Emulation (Optional)
To test secrets locally without hitches, create a `.dev.vars` file in the `worker/` directory (automatically ignored by Git):
```env
API_FOOTBALL_KEY=your_secret_api_sports_key
SYNC_ADMIN_TOKEN=your_custom_admin_bearer_string
```
Wrangler will load this file automatically during local emulation.

---

## 🚀 Setup & Local Development

### 1. Installation
Install local Wrangler devDependencies:
```bash
cd worker
npm install
```

### 2. Local Run
To start the emulated server:
```bash
npm run dev
```
The worker will listen on: **`http://localhost:8787`**.

---

## 🧪 Testing Endpoints Locally

### 1. Health Status check
Check the health status and bindings configuration:
```bash
curl -X GET http://localhost:8787/health
```
**Response Schema:**
```json
{
  "ok": true,
  "source": "cloudflare-worker",
  "updatedAt": "2026-06-18T00:00:00.000Z",
  "stale": false,
  "data": {
    "status": "healthy",
    "version": "1.1.0",
    "now": "2026-06-18T00:00:00.000Z",
    "hasApiKey": true,
    "hasSnapshotKv": true,
    "hasSyncAdminToken": true,
    "latestSnapshotUpdatedAt": "2026-06-18T00:00:00.000Z",
    "stale": false
  }
}
```

### 2. Triggering a Manual Sync (/admin/sync)
Trigger the server-side API-Football fetch and update the KV cache snapshot:
```bash
curl -X POST http://localhost:8787/admin/sync \
  -H "Authorization: Bearer <your-configured-sync-admin-token>"
```
* **Success (200 OK):** Returns count metrics and updates `live:snapshot:v1` in KV.
* **Failure (401 Unauthorized):** Missing or incorrect Bearer token.
* **Failure (500 Config/Fetch Error):** Missing bindings or API key failure.

### 3. Fetching Cached Live Data
Fetch normalized datasets compiled from the latest cached snapshot:
* **Metadata:** `GET http://localhost:8787/meta`
* **Matches:** `GET http://localhost:8787/matches`
* **Standings:** `GET http://localhost:8787/standings`
* **Teams:** `GET http://localhost:8787/teams`
* **Events:** `GET http://localhost:8787/events`

*Note: If no snapshot has been pushed to KV yet, GET endpoints will gracefully return styled fallback/mock data marked with `"stale": true` and `"source": "cloudflare-worker-fallback"`.*

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
   const LIVE_API_BASE = "https://almerkaz-worker.<your-subdomain>.workers.dev";
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
3. CORS permissions reflected dynamically inside `getCorsHeaders` ensure that requests made from `https://r3dxnote.github.io` succeed cleanly.
