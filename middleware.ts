import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin paneli next-intl'den tamamen bağımsız — locale yönlendirmesi yapma
  if (pathname.startsWith("/admin")) {
    return;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads|.*\\..*).*)", "/"],
};
