import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    success: true,
    service: "novidades-digital",
    version: "1.0.0",
    status: "ONLINE",
    checkoutConfigured: Boolean(process.env.XPAYMENTS_API_KEY)
  });
}
