import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import authConfig from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized: (authConfig.callbacks as any).authorized,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: (authConfig.callbacks as any).session,
    async jwt(params) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = await (authConfig.callbacks as any).jwt(params);

      // Onaylanmamış kullanıcılarda DB'yi kontrol et (admin onayı veya email linki sonrası banner kaybolsun)
      if (!params.user && token.emailVerifiedAt === null && token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { emailVerifiedAt: true },
          });
          if (dbUser?.emailVerifiedAt) {
            token.emailVerifiedAt = dbUser.emailVerifiedAt;
          }
        } catch { /* ignore */ }
      }

      return token;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { profile: true },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.profile?.avatarUrl ?? user.image,
          role: user.role,
          emailVerifiedAt: user.emailVerifiedAt,
        };
      },
    }),
  ],
  events: {
    async signIn({ user }) {
      if (!user?.id) return;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma as any).loginEvent.create({ data: { userId: user.id } });
      } catch {
        // Tablo henüz oluşturulmamışsa sessizce geç
      }
    },
  },
});
