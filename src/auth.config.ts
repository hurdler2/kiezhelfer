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
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = ((user as unknown) as { role?: string }).role ?? "USER";
      }
      return token;
    },
    session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session.user as any).id = token.id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session.user as any).role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
