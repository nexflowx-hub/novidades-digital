import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    success: true,
    service: "Novidades Digital",
    version: "0.1.0",
    status: "ONLINE",
    time: new Date().toISOString(),
  });
}
