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
- `ANTHROPIC_MODEL` — model id. Default `claude-haiku-4-5-20251001`.
- `MAX_TOKENS` — output cap. Default `1024`.

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

Haiku 4.5 at ~$1/MTok in, ~$5/MTok out. With ~1k in + 1k out per reading,
that is ~$0.006/reading. Free tier (100k req/day) covers MVP easily —
LLM cost dominates.
