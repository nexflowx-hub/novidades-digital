import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function validSignature(raw: string, received: string | null, secret: string) {
  if (!received) return false;
  const expected=createHmac("sha256",secret).update(raw).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected,"hex"),Buffer.from(received,"hex"));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const secret=process.env.XPAYMENTS_WEBHOOK_SECRET;
  if(!secret) return NextResponse.json({error:"WEBHOOK_NOT_CONFIGURED"},{status:503});

  const raw=await request.text();
  const signature=request.headers.get("x-nexflowx-signature");
  if(!validSignature(raw,signature,secret)) {
    return NextResponse.json({error:"INVALID_SIGNATURE"},{status:401});
  }

  let payload: {
    event?: string;
    transaction_id?: string;
    reference?: string;
    status?: string;
    amount?: number;
    currency?: string;
    method?: string;
  };
  try { payload=JSON.parse(raw); } catch {
    return NextResponse.json({error:"INVALID_JSON"},{status:400});
  }

  const reference=String(payload.reference||"").trim();
  if(!reference) return NextResponse.json({received:true,ignored:true});

  const admin=getSupabaseAdmin();
  const mappedStatus=
    payload.event==="payment_intent.succeeded" || payload.status==="succeeded" ? "succeeded" :
    payload.event==="payment_intent.payment_failed" || payload.status==="failed" ? "failed" :
    payload.event==="payment_intent.canceled" || payload.status==="canceled" ? "canceled" :
    payload.status==="processing" ? "processing" : "pending";

  const {data:order,error:orderError}=await admin
    .from("digital_orders")
    .select("*")
    .eq("reference",reference)
    .maybeSingle();

  if(orderError) throw orderError;
  if(!order) return NextResponse.json({received:true,ignored:true,reason:"order_not_found"});

  await admin.from("digital_orders").update({
    status:mappedStatus,
    xpayments_transaction_id:payload.transaction_id||null,
    payment_method:payload.method||null,
    updated_at:new Date().toISOString()
  }).eq("id",order.id);

  if(mappedStatus==="succeeded") {
    const {data:existing}=await admin
      .from("digital_entitlements")
      .select("id,token")
      .eq("order_id",order.id)
      .maybeSingle();

    if(!existing) {
      const {error:entitlementError}=await admin.from("digital_entitlements").insert({
        order_id:order.id,
        checkout_session_id:order.checkout_session_id,
        product_slug:order.product_slug,
        sku:order.sku,
        customer_email:order.customer_email,
        payment_reference:order.reference,
        status:"active"
      });
      if(entitlementError) throw entitlementError;
    }
  }

  return NextResponse.json({received:true,status:mappedStatus});
}
