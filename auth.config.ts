import type { NextAuthConfig } from "next-auth";

export default {
  pages: {
    signIn: "/de/anmelden",
    error: "/de/anmelden",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = [
        "/angebote/neu",
        "/listings/new",
        "/nachrichten",
        "/messages",
        "/profil",
        "/profile",
        "/uebersicht",
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
