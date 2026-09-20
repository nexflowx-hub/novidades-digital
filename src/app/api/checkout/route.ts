import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutIntent, updateCheckoutIntent } from "@/lib/commerce-admin";
import { getProductById } from "@/lib/products";

export const runtime = "nodejs";

const requestSchema = z.object({
  productId: z.string().min(1),
  email: z.email(),
});

export async function POST(request: Request) {
  let reference: string | null = null;

  try {
    const body = requestSchema.parse(await request.json());
    const product = getProductById(body.productId);

    if (!product || product.status !== "live" || product.priceCents <= 0) {
      return NextResponse.json({ message: "Produto indisponível para checkout." }, { status: 404 });
    }

    const apiKey = process.env.XPAYMENTS_API_KEY;
    const baseUrl = process.env.XPAYMENTS_API_URL || "https://api.xpayments.digital/api/v1";
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://digital.novidades.store").replace(/\/$/, "");

    if (!apiKey || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { message: "Checkout em ativação. A infraestrutura de venda ainda não está completamente configurada." },
        { status: 503 },
      );
    }

    reference =
      "NVD-" +
      product.sku +
      "-" +
      Date.now() +
      "-" +
      randomBytes(4).toString("hex");

    const claim = randomBytes(32).toString("hex");
    const claimTokenHash = createHash("sha256").update(claim).digest("hex");
    const claimExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const returnUrl =
      siteUrl +
      "/checkout/sucesso?reference=" +
      encodeURIComponent(reference) +
      "&claim=" +
      encodeURIComponent(claim);

    await createCheckoutIntent({
      reference,
      productSku: product.sku,
      productSlug: product.slug,
      customerEmail: body.email,
      amountMinor: product.priceCents,
      currency: product.currency,
      claimTokenHash,
      claimExpiresAt,
      metadata: { source: "novidades-digital", release: "1.0" },
    });

    const response = await fetch(baseUrl + "/checkout/session", {
      method: "POST",
      headers: {
        authorization: "Bearer " + apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        amount: product.priceCents,
        currency: product.currency,
        reference,
        customerEmail: body.email.toLowerCase(),
        metadata: {
          source: "novidades-digital",
          productId: product.id,
          productSlug: product.slug,
          sku: product.sku,
          fulfillment: "digital",
          customerEmail: body.email.toLowerCase(),
          returnUrl,
        },
      }),
      cache: "no-store",
    });

    const payload = await response.json();

    if (!response.ok || !payload?.success || !payload?.data?.checkoutUrl) {
      await updateCheckoutIntent(reference, {
        status: "failed",
        metadata: { xpayments_error: payload?.message || "session_create_failed" },
      }).catch(() => undefined);

      return NextResponse.json(
        { message: payload?.message || "XPAYMENTS não criou a sessão." },
        { status: 502 },
      );
    }

    await updateCheckoutIntent(reference, {
      session_id: payload.data.sessionId,
      status: "pending",
    }).catch((error) => console.error("[checkout-intent-update]", error));

    return NextResponse.json({
      checkoutUrl: payload.data.checkoutUrl,
      sessionId: payload.data.sessionId,
      reference,
      claim,
    });
  } catch (error) {
    if (reference) {
      await updateCheckoutIntent(reference, { status: "failed" }).catch(() => undefined);
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Dados de checkout inválidos." }, { status: 400 });
    }
    console.error("[checkout]", error);
    return NextResponse.json({ message: "Falha ao iniciar checkout." }, { status: 500 });
  }
}
