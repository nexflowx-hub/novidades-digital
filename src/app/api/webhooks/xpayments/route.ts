import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  getCheckoutIntent,
  getWebhookSecret,
  grantEntitlement,
  updateCheckoutIntent,
} from "@/lib/commerce-admin";

export const runtime = "nodejs";

function validSignature(rawBody: string, provided: string | null, secret: string) {
  if (!provided || !/^[a-f0-9]{64}$/i.test(provided)) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(provided, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

function mapStatus(event: string, status: string) {
  const joined = (event + " " + status).toLowerCase();
  if (joined.includes("succeeded") || joined.includes("paid") || joined.includes("completed")) return "succeeded";
  if (joined.includes("processing") || joined.includes("pending")) return "processing";
  if (joined.includes("cancel")) return "canceled";
  if (joined.includes("expire")) return "expired";
  if (joined.includes("fail")) return "failed";
  return "pending";
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-nexflowx-signature");
    const secret = await getWebhookSecret();

    if (!validSignature(rawBody, signature, secret)) {
      return NextResponse.json({ received: false, error: "invalid_signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody) as {
      event?: string;
      transaction_id?: string;
      reference?: string;
      amount?: number;
      currency?: string;
      status?: string;
      method?: string;
    };

    const reference = String(payload.reference || "").trim();
    if (!reference) {
      return NextResponse.json({ received: true, ignored: true, reason: "reference_missing" });
    }

    const intent = await getCheckoutIntent(reference);
    if (!intent) {
      return NextResponse.json({ received: true, ignored: true, reason: "not_digital_intent" });
    }

    const amountMinor = Math.round(Number(payload.amount) * 100);
    const currency = String(payload.currency || "").toUpperCase();

    if (amountMinor !== intent.amount_minor || currency !== intent.currency.toUpperCase()) {
      console.error("[xpayments-webhook] reconciliation mismatch", {
        reference,
        amountMinor,
        expectedAmountMinor: intent.amount_minor,
        currency,
        expectedCurrency: intent.currency,
      });
      return NextResponse.json({ received: false, error: "reconciliation_mismatch" }, { status: 409 });
    }

    const status = mapStatus(String(payload.event || ""), String(payload.status || ""));
    const transactionId = payload.transaction_id ? String(payload.transaction_id) : null;

    await updateCheckoutIntent(reference, {
      status,
      transaction_id: transactionId,
      metadata: {
        last_event: payload.event || null,
        payment_method: payload.method || null,
        webhook_received_at: new Date().toISOString(),
      },
    });

    if (status === "succeeded") {
      await grantEntitlement(intent, transactionId);
    }

    return NextResponse.json({
      received: true,
      reference,
      status,
      entitlementGranted: status === "succeeded",
    });
  } catch (error) {
    console.error("[xpayments-webhook]", error);
    return NextResponse.json({ received: false, error: "internal_error" }, { status: 500 });
  }
}
