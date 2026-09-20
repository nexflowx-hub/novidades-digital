import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getProduct } from "@/lib/products";
import { createXPaymentsCheckout } from "@/lib/xpayments";

export async function POST(request: Request) {
  try {
    const body=await request.json();
    const product=getProduct(String(body.slug||""));
    const email=String(body.email||"").trim().toLowerCase();
    const name=String(body.name||"").trim();

    if(!product || product.status!=="ready") {
      return NextResponse.json({error:"PRODUCT_NOT_AVAILABLE"},{status:404});
    }
    if(!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({error:"INVALID_EMAIL"},{status:400});
    }
    if(name.length<2) {
      return NextResponse.json({error:"INVALID_NAME"},{status:400});
    }

    const reference="ND-" + product.sku + "-" + randomUUID().slice(0,8).toUpperCase();
    const returnBase=process.env.XPAYMENTS_SUCCESS_URL || "https://digital.novidades.store/obrigado";

    const checkout=await createXPaymentsCheckout({
      amount: product.priceCents,
      currency: product.currency,
      reference,
      customerEmail: email,
      metadata: {
        product_slug: product.slug,
        sku: product.sku,
        customer_name: name,
        source: "novidades-digital",
        success_url: returnBase
      }
    });

    return NextResponse.json({ checkoutUrl: checkout.checkoutUrl, sessionId: checkout.sessionId });
  } catch (error) {
    console.error("[digital-checkout]", error);
    return NextResponse.json({error:"CHECKOUT_UNAVAILABLE"},{status:503});
  }
}
