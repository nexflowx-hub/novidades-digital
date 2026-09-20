import "server-only";

type CreateCheckoutInput = {
  amount: number;
  currency: string;
  reference: string;
  customerEmail: string;
  metadata: Record<string, unknown>;
};

export async function createXPaymentsCheckout(input: CreateCheckoutInput) {
  const base = process.env.XPAYMENTS_API_URL || "https://api.xpayments.digital";
  const apiKey = process.env.XPAYMENTS_API_KEY;
  if (!apiKey) throw new Error("XPAYMENTS_API_KEY_NOT_CONFIGURED");

  const response = await fetch(base + "/api/v1/checkout/session", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + apiKey,
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body?.success || !body?.data?.checkoutUrl) {
    throw new Error(body?.message || body?.error?.message || "XPAYMENTS_CHECKOUT_FAILED");
  }
  return body.data as {
    sessionId: string;
    checkoutUrl: string;
    storeCode: string;
    expiresAt: string;
  };
}

export async function getXPaymentsSession(sessionId: string) {
  const base = process.env.XPAYMENTS_API_URL || "https://api.xpayments.digital";
  const response = await fetch(base + "/api/v1/checkout/session/" + encodeURIComponent(sessionId), {
    cache: "no-store",
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body?.success) throw new Error("XPAYMENTS_SESSION_LOOKUP_FAILED");
  return body.data as {
    sessionId: string;
    amount: number;
    currency: string;
    reference: string;
    status: string;
    customerEmail: string | null;
    metadata: Record<string, unknown>;
    expiresAt: string;
  };
}
