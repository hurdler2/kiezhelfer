import NextAuth from "next-auth";
import authConfig from "@/auth.config";

// Edge-compatible auth — no Prisma, JWT-only session verification
export const { auth } = NextAuth(authConfig);
