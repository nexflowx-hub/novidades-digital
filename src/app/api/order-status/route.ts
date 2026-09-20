import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getXPaymentsSession } from "@/lib/xpayments";

export async function GET(request: Request) {
  const reference=new URL(request.url).searchParams.get("reference")?.trim();
  if(!reference) return NextResponse.json({error:"REFERENCE_REQUIRED"},{status:400});

  try {
    const admin=getSupabaseAdmin();
    const {data:order}=await admin.from("digital_orders").select("*").eq("reference",reference).maybeSingle();
    if(!order) return NextResponse.json({status:"not_found"},{status:404});

    if(order.status!=="succeeded" && order.checkout_session_id) {
      try {
        const session=await getXPaymentsSession(order.checkout_session_id);
        if(session.status==="succeeded") {
          await admin.from("digital_orders").update({status:"succeeded",updated_at:new Date().toISOString()}).eq("id",order.id);
          const {data:existing}=await admin.from("digital_entitlements").select("token").eq("order_id",order.id).maybeSingle();
          if(!existing) {
            await admin.from("digital_entitlements").insert({
              order_id:order.id,
              checkout_session_id:order.checkout_session_id,
              product_slug:order.product_slug,
              sku:order.sku,
              customer_email:order.customer_email,
              payment_reference:order.reference,
              status:"active"
            });
          }
        }
      } catch {}
    }

    const {data:entitlement}=await admin.from("digital_entitlements").select("token").eq("order_id",order.id).eq("status","active").maybeSingle();
    return NextResponse.json({
      status: entitlement ? "succeeded" : order.status,
      accessUrl: entitlement ? "/acesso/" + entitlement.token : null
    });
  } catch(error) {
    console.error("[order-status]",error);
    return NextResponse.json({error:"ORDER_STATUS_UNAVAILABLE"},{status:503});
  }
}
