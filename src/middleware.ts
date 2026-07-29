import { NextResponse, type NextRequest } from "next/server";
import { ROUTES, PUBLIC_ROUTES, DEFAULT_AUTHENTICATED_ROUTE } from "@/config/routes";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import { serverEnv } from "@/config/env.server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token, serverEnv.AUTH_SESSION_SECRET) : null;
  const isAuthenticated = session !== null;

  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    // Clear a stale/invalid cookie so the browser doesn't keep sending it.
    if (token) response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  if (isAuthenticated && pathname === ROUTES.login) {
    return NextResponse.redirect(new URL(DEFAULT_AUTHENTICATED_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
