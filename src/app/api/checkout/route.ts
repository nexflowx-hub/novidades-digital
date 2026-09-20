import { NextResponse } from "next/server";
import { z } from "zod";
import { getProductById } from "@/lib/products";

export const runtime = "nodejs";

const requestSchema = z.object({
  productId: z.string().min(1),
  email: z.email()
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const product = getProductById(body.productId);

    if (!product || product.status !== "live" || product.priceCents <= 0) {
      return NextResponse.json({ message: "Produto indisponível para checkout." }, { status: 404 });
    }

    const apiKey = process.env.XPAYMENTS_API_KEY;
    const baseUrl = process.env.XPAYMENTS_API_URL || "https://api.xpayments.digital/api/v1";

    if (!apiKey) {
      return NextResponse.json(
        { message: "Checkout em ativação. Configure XPAYMENTS_API_KEY no ambiente de produção." },
        { status: 503 }
      );
    }

    const reference = "NVD-" + product.sku + "-" + Date.now();
    const response = await fetch(baseUrl + "/checkout/session", {
      method: "POST",
      headers: {
        authorization: "Bearer " + apiKey,
        "content-type": "application/json",
        accept: "application/json"
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
          fulfillment: "digital"
        }
      }),
      cache: "no-store"
    });

    const payload = await response.json();

    if (!response.ok || !payload?.success || !payload?.data?.checkoutUrl) {
      return NextResponse.json(
        { message: payload?.message || "XPAYMENTS não criou a sessão." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      checkoutUrl: payload.data.checkoutUrl,
      sessionId: payload.data.sessionId,
      reference
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Dados de checkout inválidos." }, { status: 400 });
    }
    console.error("[checkout]", error);
    return NextResponse.json({ message: "Falha ao iniciar checkout." }, { status: 500 });
  }
}
