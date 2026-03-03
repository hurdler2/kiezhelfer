import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./src/auth.edge";

const intlMiddleware = createMiddleware(routing);

export default auth(function middleware(request: NextRequest & { auth: any }) {
  const { pathname } = request.nextUrl;
  const session = request.auth;
  const role = session?.user ? (session.user as any).role : null;

  // Admin paneli: ADMIN olmayan kullanıcılar → /de'ye yönlendir
  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/de", request.url));
    }
    return; // ADMIN → geç
  }

  // ADMIN kullanıcı kullanıcı sitesine girmeye çalışıyorsa → /admin'e yönlendir
  if (role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return intlMiddleware(request);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads|admin-login|.*\\..*).*)", "/"],
};
