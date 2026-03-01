import { auth } from "@/auth";
import { getOnlineUsers } from "@/lib/online-store";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const online = getOnlineUsers();

  if (online.length === 0) {
    return NextResponse.json({ users: [], total: 0 });
  }

  const userIds = online.map((u) => u.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profile: { select: { district: true, avatarUrl: true } },
    },
  });

  const userMap = new Map(users.map((u) => [u.id, u]));

  const result = online.map((entry) => {
    const user = userMap.get(entry.userId);
    return {
      userId: entry.userId,
      name: user?.name ?? "—",
      email: user?.email ?? "—",
      role: user?.role ?? "USER",
      district: user?.profile?.district ?? "—",
      ip: entry.ip,
      pathname: entry.pathname,
      lastSeen: entry.lastSeen.toISOString(),
    };
  });

  // Sort by lastSeen desc
  result.sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());

  return NextResponse.json({ users: result, total: result.length });
}
