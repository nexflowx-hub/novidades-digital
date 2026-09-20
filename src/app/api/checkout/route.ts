import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getProduct } from "@/lib/products";
import { createXPaymentsCheckout } from "@/lib/xpayments";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

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
    const returnUrl=returnBase + "?reference=" + encodeURIComponent(reference);

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
        returnUrl
      }
    });

    const admin=getSupabaseAdmin();
    const {error}=await admin.from("digital_orders").insert({
      checkout_session_id: checkout.sessionId,
      reference,
      product_slug: product.slug,
      sku: product.sku,
      customer_email: email,
      customer_name: name,
      amount_cents: product.priceCents,
      currency: product.currency,
      status: "pending"
    });
    if(error) throw error;

    return NextResponse.json({
      checkoutUrl: checkout.checkoutUrl,
      sessionId: checkout.sessionId,
      reference
    });
  } catch (error) {
    console.error("[digital-checkout]", error);
    return NextResponse.json({error:"CHECKOUT_UNAVAILABLE"},{status:503});
  }
}
