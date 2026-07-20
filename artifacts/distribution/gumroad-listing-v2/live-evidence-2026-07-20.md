# Gumroad and fulfillment live evidence — 2026-07-20

## Authenticated Gumroad read-back

After each `Save changes`, the product editor was reloaded and read back:

- `Saju Deep Reading` remained published at USD 7 with URL slug `reading`.
- The full description, summary, cover, and square thumbnail persisted.
- The Content tab states email delivery, usually within 10 minutes with a 24-hour recovery allowance, and does not claim the return page is the paid report.
- The Receipt tab persisted `Read delivery details` and the matching delivery/refund message.
- The product refund selector is `No refunds allowed`; the fine print preserves the explicit technical non-delivery refund and applicable-law/Gumroad-protection exceptions.
- Gumroad Advanced settings persisted the authenticated Cloudflare gateway Ping URL after a reload.

## Runtime checks

- GitHub Pages served the cutover frontend and `src/direct-checkout.js` with HTTP 200.
- The public Gumroad product and checkout endpoints returned HTTP 200 without completing a purchase.
- The Cloudflare gateway health check returned `{"ok":true}`.
- Authenticated admin status returned an empty order count, consistent with zero verified sales at cutover.
- The protected generation canary returned HTTP 200 and a valid bounded response.
- Resend accepted an owner-address canary request with HTTP 200.
- The root suite passed 63 checks and the fulfillment gateway suite passed 17 checks.

## Deliberate evidence boundary

No paid self-purchase or external buyer purchase was performed. This proves that the live listing, Ping cutover, generation dependency, and email-provider acceptance are configured and responsive; it does not yet prove Gumroad's exact first real Ping payload or successful delivery to a buyer inbox. The first external order must remain a monitored canary until the verified order, generation, Resend acceptance, and delivered-email evidence agree.

Reddit moderator messaging was unavailable for the intended community/account, so no Reddit post or direct message was sent.
