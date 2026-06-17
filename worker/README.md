# Almerkaz Cloudflare Worker Live API

This is the Cloudflare Worker Live API foundation for **المركاز (Almerkaz)**. It provides real-time, CORS-enabled endpoints for World Cup data to prevent freezing of live minutes and data updates on the static GitHub Pages frontend.

---

## 🚀 Setup & Local Development

### 1. Installation
Navigate to the worker directory and install development dependencies (namely `wrangler` for local emulation):
```bash
cd worker
npm install
```

### 2. Configuration Configuration
Copy the example configuration file:
```bash
cp wrangler.toml.example wrangler.toml
```

### 3. Local Run
To start the Wrangler local development server:
```bash
npm run dev
```
By default, the worker will be available at: **`http://localhost:8787`**.

---

## 🔍 Local Endpoints Testing

You can query the worker endpoints locally using `curl` or a web browser:

1. **Health Check** (Checks if the worker is up and if the secret key is bound):
   - Path: `GET http://localhost:8787/health`
   - Response shape:
     ```json
     {
       "ok": true,
       "source": "cloudflare-worker",
       "updatedAt": "2026-06-18T00:00:00.000Z",
       "stale": false,
       "data": {
         "status": "healthy",
         "version": "1.0.0",
         "hasApiKey": false,
         "time": "2026-06-18T00:00:00.000Z"
       }
     }
     ```

2. **Metadata**:
   - Path: `GET http://localhost:8787/meta`

3. **Matches**:
   - Path: `GET http://localhost:8787/matches`

4. **Standings**:
   - Path: `GET http://localhost:8787/standings`

5. **Teams**:
   - Path: `GET http://localhost:8787/teams`

6. **Events**:
   - Path: `GET http://localhost:8787/events`

---

## 🔒 Secrets & Environment Management

To feed actual API-Football data, the worker requires the API key. **Never commit the key in files.**

### For Local Emulation (Optional)
Create a `.dev.vars` file in the `worker/` directory (ignored by Git):
```env
API_FOOTBALL_KEY=your_real_api_key_here
```
Wrangler will load this file automatically during `npm run dev`.

### For Production
Upload the secret key to Cloudflare securely:
```bash
npx wrangler secret put API_FOOTBALL_KEY
```
You will be prompted to paste the secret value. This binding will then be available in production as `env.API_FOOTBALL_KEY`.

---

## 🕒 Cron Trigger (Scheduled Sync)
Wrangler emulates cron triggers locally. The placeholder scheduled trigger is defined in `index.js`. 
To test the scheduled cron handler locally:
```bash
npx wrangler dev --test-scheduled
```
Then trigger it by hitting: `GET http://localhost:8787/__scheduled`.

---

## 📦 Deployment (Documentation Only)

To publish the worker live:
1. Log in to your Cloudflare account via the CLI:
   ```bash
   npx wrangler login
   ```
2. Deploy the worker:
   ```bash
   npm run deploy
   ```

---

## 🌐 Transitioning the Frontend

Currently, Almerkaz frontend (`assets/js/app.js`) fetches static files:
```javascript
const response = await fetch('./assets/data/live/matches.json');
```

To switch to the live Worker API, we will update `assets/js/app.js` (in a future phase) to detect if a live worker endpoint is configured, or conditionally fetch from it:
```javascript
const WORKER_BASE = "https://almerkaz-worker.<your-subdomain>.workers.dev";

async function fetchMatches() {
  const response = await fetch(`${WORKER_BASE}/matches`, {
    cache: 'no-store'
  });
  const result = await response.json();
  return result.data; // The wrapper places datasets in .data
}
```
CORS headers Reflected dynamically in the Worker will allow clean requests from `https://r3dxnote.github.io` without cross-origin errors.
