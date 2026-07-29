import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverEnv } from "@/config/env.server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import type { CurrentUser } from "@/features/authentication/types/auth.types";

export async function GET(): Promise<NextResponse<{ user: CurrentUser | null }>> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const session = await verifySessionToken(token, serverEnv.AUTH_SESSION_SECRET);
  if (!session) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: { username: session.username } });
}
