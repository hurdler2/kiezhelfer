import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name, E-Mail und Nachricht sind Pflichtfelder." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse." }, { status: 400 });
    }

    await (prisma as any).contactMessage.create({
      data: { name: name.trim(), email: email.trim(), message: message.trim() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Nachricht konnte nicht gesendet werden." }, { status: 500 });
  }
}
