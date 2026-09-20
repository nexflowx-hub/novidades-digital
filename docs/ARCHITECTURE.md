# Novidades Digital — Launch Architecture

## Surfaces

- `novidades.store/conteudos-digitais` — discovery/catalog.
- `digital.novidades.store` — sales, tools, customer access and digital delivery.
- `checkout.xpayments.digital` — payment checkout created server-to-server.

## Checkout

The browser sends only `productId` + customer email to `POST /api/checkout`.
Price, currency, SKU and metadata are resolved server-side from the product registry.

Runtime secret:
- `XPAYMENTS_API_KEY` — live API key for the selected XPayments Store.

Never expose this key through `NEXT_PUBLIC_*`.

## Storage

GitHub is not customer binary storage.

Customer PDFs/ZIPs/XLSX/media should live in the private Supabase Storage bucket `novidades-digital` (or R2 later). Delivery uses entitlement checks and short-lived signed URLs.

## Product gates

Only products with license/review gates cleared become `status: live`.

Current launch:
- DP-001 Conversion Content OS — LIVE candidate, R$97.
- DP-002/003/004/006 — staged until technical/editorial/license gates close.

## Hook Lab

Release 1 contains a deterministic public beta:
- structured brief,
- 12 hook families,
- lightweight RCP indicators,
- no model/API dependency,
- no invented proof or scarcity.

AI generation remains a later server-side layer.
