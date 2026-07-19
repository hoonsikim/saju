# Saju Fulfillment Gateway

Isolated Cloudflare Worker for Gumroad-triggered paid reading fulfillment.

Flow:

1. Gumroad sends unsigned form data to an unguessable `POST /gumroad/ping/<PING_TOKEN>` URL.
2. The Worker extracts only `sale_id`, then verifies the sale with `GET https://api.gumroad.com/v2/sales/:id` using `GUMROAD_ACCESS_TOKEN`.
3. A D1 `INSERT OR IGNORE` claims the `sale_id` before enqueueing `{ "sale_id": "..." }`.
4. The queue consumer refetches the sale, reconstructs strict birth fields from the authenticated sale response, calls the `saju-reading` Worker through the `SAJU_READING_WORKER` service binding at token-guarded `POST /fulfillment/reading`, validates the reading, and sends Resend with `Idempotency-Key: saju-reading/<sale_id>`.

No email, birth fields, URL params, custom fields, or reading text are stored in D1 or intentionally logged.

## API

- `GET /health` returns only `{ "ok": true }`; it does not disclose binding or secret readiness.
- `POST /gumroad/ping/<PING_TOKEN>` accepts `application/x-www-form-urlencoded`. The unguessable path token limits anonymous API amplification; authenticated Gumroad sale retrieval remains the payment proof.
- `GET /admin/status` requires `Authorization: Bearer <ADMIN_TOKEN>` and returns PII-free operational counts. Query-string tokens are rejected.
- `GET|POST /admin/generation-canary` requires `Authorization: Bearer <ADMIN_TOKEN>`, sends fixed synthetic birth data through the service binding, and returns only `{ "ok": true }` or `{ "ok": false, "code": "...", "retryable": true|false }`. It never returns the reading, usage, raw input, buyer data, or email status.

## Sale Verification Contract

The gateway fails closed unless the authenticated Gumroad sale response confirms the configured identifiers. `EXPECTED_GUMROAD_SELLER_ID` and `EXPECTED_GUMROAD_PRODUCT_ID` have no production defaults and must be set after a live Gumroad API canary confirms the response shape and IDs. The task-supplied historical values below are candidates, not deploy authority:

- `seller_id` exactly `fj-2-s19frzPz_yWhLMEoQ==`
- `product_id` exactly `rVcTCMwSjj3looPJR-caoQ==`
- fallback product permalink exactly `reading` only when `product_id` is missing
- paid USD `700` cents
- quantity `1`
- `paid` is explicitly `true`
- `test` is `false`
- refunded, partially refunded, chargedback, and disputed are all explicitly `false`

Buyer email and checkout fields are read only from the verified sale response. Ping PII is ignored.

Supported sale input shapes for checkout fields are intentionally narrow:

- `sale.url_params` or `sale.url_parameters` as an object or array of `{ key|name|field, value }`
- `sale.custom_fields`, `sale.custom_fields_info`, or `sale.custom_fields_details` as an object or array of `{ key|name|field, value }`

Required fields are `birth=YYYYMMDDHHmm`, `gender=male|female`, `lang`, and `readingType=general|career|love|wealth`. Unknown or missing shapes fail closed. After creating a real Gumroad API token, run a live canary against a test sale response and update this parser only if Gumroad returns a different authenticated field shape.

Registered source allowlist:

- `indexnow_saju_vs_bazi_001`
- `reddit_chinesezodiac_001`
- `reddit_chineseastrology_001`
- `fivearts_001`
- `gumroad_discover_001`

Unknown source is stored as `null`/unattributed.

## Provision

Do not run these until external resource creation is approved.

Hard pre-cutover gate:

- Create a real local `wrangler.toml` from `wrangler.toml.example`; do not deploy from `wrangler.toml.example`.
- Keep the real `wrangler.toml` local/untracked. It should not contain secrets, but it will contain account/resource identifiers such as D1 IDs.
- Replace every placeholder ID/value in the real `wrangler.toml`, including `database_id`, `EXPECTED_GUMROAD_SELLER_ID`, and `EXPECTED_GUMROAD_PRODUCT_ID`.
- Run a Wrangler dry-run against the real `wrangler.toml` and confirm the `SAJU_READING_WORKER`, D1, and Queue bindings before any Gumroad Ping cutover.
- Do not set the Gumroad Ping URL until secrets are set on both Workers, migrations are applied, deploy succeeds, and `GET /admin/generation-canary` succeeds.

```bash
cd fulfillment-gateway
npm install
npx wrangler d1 create saju-fulfillment-orders
npx wrangler queues create saju-fulfillment
npx wrangler queues create saju-fulfillment-dlq
cp wrangler.toml.example wrangler.toml
# Paste the returned D1 database_id into wrangler.toml.
# Keep wrangler.toml local/untracked and verify it with:
npx wrangler deploy --dry-run --outdir /tmp/saju-fulfillment-gateway-dryrun
npx wrangler d1 migrations apply saju-fulfillment-orders
npx wrangler secret put GUMROAD_ACCESS_TOKEN
npx wrangler secret put FULFILLMENT_READING_TOKEN
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put ADMIN_TOKEN
npx wrangler secret put PING_TOKEN
npx wrangler deploy
```

Before deploy, verify the identifiers with a live authenticated canary:

```bash
curl -sS https://api.gumroad.com/v2/sales/<test-sale-id> \
  -H "Authorization: Bearer $GUMROAD_ACCESS_TOKEN"
```

Confirm the requested sale `id`, `seller_id`, `product_id`, `paid`, quantity, price/currency, refund/dispute flags, and URL/custom field shape. Put the confirmed seller/product IDs in `wrangler.toml`, deploy, verify `GET /admin/generation-canary`, then set Gumroad Ping to `https://<worker>/gumroad/ping/<PING_TOKEN>`.

The same `FULFILLMENT_READING_TOKEN` must also be set on the existing `saju-reading` Worker. Anthropic remains owned by `saju-reading`; this gateway must not hold `ANTHROPIC_API_KEY`.

The existing Resend account has verified `saju.thehueviz.com`; the example sender uses `readings@saju.thehueviz.com`. Do not fall back to `onboarding@resend.dev`, which is a test sender and cannot deliver to arbitrary customers.

## Rollback

1. Remove the Gumroad ping URL or point it back to a holding endpoint.
2. Pause the queue consumer in Cloudflare if deliveries are failing.
3. Roll back the Worker deployment to the previous version from Cloudflare.
4. Keep D1 records for operational dedupe; they contain no buyer PII.

## Local Test

```bash
npm test
```
