import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "./lib/auth";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is an admin path (e.g. /ar/admin, /en/admin, etc.)
  const isAdminRoute = /\/(ar|en)\/admin(\/.*)?$/.test(pathname);
  const isLoginPage = /\/(ar|en)\/admin\/login$/.test(pathname);

  if (isAdminRoute) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isAuthenticated = await verifyAdminToken(token);

    // Extract locale (ar or en)
    const localeMatch = pathname.match(/^\/(ar|en)/);
    const locale = localeMatch ? localeMatch[1] : "ar";

    if (isLoginPage) {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
      }
      return intlMiddleware(request);
    }

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|uploads|.*\\..*).*)"],
};
