import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/session";

export async function POST(): Promise<NextResponse<{ success: true }>> {
  const response = NextResponse.json({ success: true as const });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
