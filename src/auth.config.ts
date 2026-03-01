import type { NextAuthConfig } from "next-auth";

export default {
  pages: {
    signIn: "/de/login",
    error: "/de/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = [
        "/listings/new",
        "/messages",
        "/profile",
        "/dashboard",
      ];

      const isProtected = protectedPaths.some((path) =>
        nextUrl.pathname.includes(path)
      );

      if (isProtected && !isLoggedIn) {
        return false;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
