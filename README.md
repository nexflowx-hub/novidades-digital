# Novidades Digital

Aplicação de produtos digitais do ecossistema **Novidades.store**.

## Produção

- Discovery: `https://novidades.store/conteudos-digitais`
- Venda, ferramentas e entrega: `https://digital.novidades.store`
- Checkout: `https://checkout.xpayments.digital`

## Release 1

**Conversion Content OS — R$97, pagamento único**

Pacote:
1. Conversion Content OS — Guide
2. Conversion Workbook
3. Hook Library — 300 estruturas
4. Prompt Library — 36 prompts
5. CTA & Offer Swipe File
6. Content Repurposing Matrix
7. Quick Start
8. Customer License & Terms

O Hook Lab Beta é uma camada executável complementar. O pacote pago não depende do software para cumprir a oferta da Release 1.

## Runtime

```bash
bun install
cp .env.example .env.local
bun run dev
```

Para checkout real:

```bash
XPAYMENTS_API_KEY=<api-key-live-da-store-NOVIDADES-BRL>
```

A API key é exclusivamente server-side. Preço, moeda e SKU são resolvidos pelo registry interno; o browser nunca define o valor cobrado.

## Storage

GitHub **não** é storage de entrega ao cliente. PDFs, ZIPs, planilhas e mídia ficam em object storage privado e são liberados por entitlement + URL assinada.

## Segurança

Não colocar em variáveis `NEXT_PUBLIC_*`:
- XPAYMENTS API key
- Supabase service-role key
- tokens ou segredos de providers

Consulte `docs/ARCHITECTURE.md`.
