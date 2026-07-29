import { NextResponse } from "next/server";
import { serverEnv } from "@/config/env.server";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_DEFAULT_SECONDS,
  SESSION_MAX_AGE_REMEMBER_SECONDS,
  createSessionToken,
} from "@/lib/session";
import { loginRequestSchema, type LoginResponse } from "@/features/authentication/types/auth.types";

export async function POST(request: Request): Promise<NextResponse<LoginResponse>> {
  const body = await request.json().catch(() => null);
  const parsed = loginRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Dữ liệu đăng nhập không hợp lệ." },
      { status: 400 }
    );
  }

  const { username, password, rememberMe } = parsed.data;

  const isValid = username === serverEnv.AUTH_USERNAME && password === serverEnv.AUTH_PASSWORD;

  if (!isValid) {
    return NextResponse.json(
      { success: false, message: "Tên đăng nhập hoặc mật khẩu không đúng." },
      { status: 401 }
    );
  }

  const maxAge = rememberMe ? SESSION_MAX_AGE_REMEMBER_SECONDS : SESSION_MAX_AGE_DEFAULT_SECONDS;
  const token = await createSessionToken(username, serverEnv.AUTH_SESSION_SECRET, maxAge);

  const response = NextResponse.json<LoginResponse>({ success: true, username });

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return response;
}
