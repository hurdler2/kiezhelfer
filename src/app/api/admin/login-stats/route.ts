import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [daily, monthly, yearly, last30Days] = await Promise.all([
    // Bugün
    prisma.loginEvent.count({ where: { createdAt: { gte: startOfToday } } }),
    // Bu ay
    prisma.loginEvent.count({ where: { createdAt: { gte: startOfMonth } } }),
    // Bu yıl
    prisma.loginEvent.count({ where: { createdAt: { gte: startOfYear } } }),
    // Son 30 günün günlük dağılımı (grafik için)
    prisma.$queryRaw<{ day: string; count: bigint }[]>`
      SELECT
        TO_CHAR(DATE_TRUNC('day', "createdAt"), 'DD.MM') AS day,
        COUNT(*)::bigint AS count
      FROM login_events
      WHERE "createdAt" >= ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY DATE_TRUNC('day', "createdAt") ASC
    `,
  ]);

  return NextResponse.json({
    daily,
    monthly,
    yearly,
    last30Days: last30Days.map((r) => ({
      day: r.day,
      count: Number(r.count),
    })),
  });
}
