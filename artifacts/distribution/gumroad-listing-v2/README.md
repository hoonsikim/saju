# Gumroad listing v2

Staged copy for the live `Saju Deep Reading` product (`jdykvl`). This pack corrects the empty description, misleading online-delivery link, and contradictory refund language observed in the authenticated Gumroad editor on 2026-07-19.

Nothing in this directory proves that the live listing was saved. External state must be read back after `Save changes` and recorded separately.

## Publish order

1. Main product page: paste `description.md`; keep USD 7; use the summary in `settings.json`.
2. Content page: replace the placeholder with `content.md`.
3. Receipt page: replace the button and receipt text with `receipt.md`.
4. Refund section: use the policy in `settings.json` and make it match `/legal/refund/`.
5. Save each page once, then reopen the public product and receipt preview for read-back.

Do not claim a browser return URL contains the paid reading. Delivery is by email, and `?paid=deep` is only a return notice.
