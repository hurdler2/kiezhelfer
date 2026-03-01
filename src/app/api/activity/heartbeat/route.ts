import { auth } from "@/auth";
import { updatePresence } from "@/lib/online-store";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const body = await req.json().catch(() => ({}));
  const pathname = (body.pathname as string) || "/";

  updatePresence((session.user as any).id, ip, pathname);

  return NextResponse.json({ ok: true });
}
