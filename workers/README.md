# Saju Reading Worker

Cloudflare Worker that turns birth info into a Saju reading via Claude.

## Endpoints

- `GET /health` → `{ ok: true, ts: <epoch> }`
- `POST /reading` — body:
  ```json
  { "year": 1990, "month": 1, "day": 1, "hour": 0, "minute": 0, "language": "ko" }
  ```
  response:
  ```json
  {
    "saju": { "pillars": {...}, "dayMaster": "甲", "elements": {...}, "tenGods": {...} },
    "reading": "<Claude-generated text>",
    "language": "ko",
    "usage": { "input_tokens": ..., "output_tokens": ... }
  }
  ```

Allowed languages: `en`, `ko`, `ja`, `zh`.

## Directional analytics candidate (not deployed by this change)

`POST /track` accepts only the event/property allowlists in `src/index.js`.
Analytics attribution is a closed registry shared with `src/attribution.js`.
Current registered sources are `indexnow_saju_vs_bazi_001`,
`reddit_chinesezodiac_001`, `reddit_chineseastrology_001`, `fivearts_001`, and
`gumroad_discover_001`. The Worker derives canonical UTM dimensions from that
registry. Direct traffic is allowed by omitting attribution. Unknown sources
and caller-supplied or mismatched UTM dimensions are rejected rather than
stored.

Each accepted event writes exactly one deterministic, seven-day TTL KV key:

```text
evt:v2:{Asia/Seoul-day}:{source}:{campaign}:{event}:{sha256(session)}
```

There are no read/modify/write counters and no separate raw or dedupe record.
Concurrent retries converge on the same KV key. This does **not** prevent a
public caller from forging new session IDs. `/metrics` paginates event keys,
aggregates only bounded dimensions, and stops at a hard 1,000-key read cap. A
cap hit is reported as `decisionQuality: "not-decision-quality"`; otherwise the
result is still `directional-only`. Treat these analytics as directional or
unavailable for decisions until a stronger Durable Object ingestion boundary
and human verification are in place.

Recognizable automation user agents are excluded. For explicit local owner or
test work, set `window.SAJU_ANALYTICS_MODE = 'exclude'` before the page module,
set `localStorage['saju.analytics.mode'] = 'exclude'` and reload, or send
`X-Saju-Analytics-Mode: exclude` to the Worker. Remove the localStorage key to
resume measurement. This is a **signaled exclusion**, not automatic owner
detection, and it writes no analytics record.

`POST /feedback` retains the bounded feedback record for 30 days. It never
stores raw session IDs, IP addresses, countries, or user agents; an optional
session is domain-separated and SHA-256 hashed. The UI asks users not to enter
birth or contact data in free text, and the Worker rejects obvious email,
birth-date, and phone patterns before KV storage or Telegram notification.

## Setup

```bash
cd workers
npm install
npx wrangler login                              # first time only
npx wrangler secret put ANTHROPIC_API_KEY       # paste sk-ant-...
npx wrangler deploy
```

Default URL after deploy: `https://saju-reading.<account>.workers.dev`.

## Config

`wrangler.toml` vars (non-secret):
- `ALLOWED_ORIGIN` — CORS origin. Default `https://hoonsikim.github.io`.
- `ANTHROPIC_MODEL` — model id. Default `claude-opus-4-8`.
- `MAX_TOKENS` — output cap. Default `8192`.

Secrets (set via `wrangler secret put`):
- `ANTHROPIC_API_KEY` — required.

## Local dev

```bash
npx wrangler dev
# then:
curl -sX POST http://localhost:8787/reading \
  -H 'Content-Type: application/json' \
  -d '{"year":1990,"month":1,"day":1,"hour":0,"language":"ko"}'
```

For local dev, put `ANTHROPIC_API_KEY=...` in `.dev.vars` (gitignored).

## Cost note

The publish-pack economics calculator uses the current official Anthropic price
snapshot for Claude Opus 4.8, the configured 8,192-token output cap, an explicit
input cap, and a bounded retry count. Do not use a hard-coded per-reading estimate;
refresh the source snapshot when it expires.
