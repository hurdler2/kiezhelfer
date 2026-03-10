import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendMail, contactReplyEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { replyText } = await req.json();
  if (!replyText?.trim()) {
    return NextResponse.json({ error: "Yanıt metni boş olamaz" }, { status: 400 });
  }

  const message = await (prisma as any).contactMessage.findUnique({
    where: { id: params.id },
  });

  if (!message) {
    return NextResponse.json({ error: "Mesaj bulunamadı" }, { status: 404 });
  }

  const { subject, html } = contactReplyEmail(message.name, message.message, replyText.trim());
  await sendMail({ to: message.email, subject, html });

  // Mark as read after replying
  await (prisma as any).contactMessage.update({
    where: { id: params.id },
    data: { isRead: true },
  });

  return NextResponse.json({ ok: true });
}
