import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Keine Datei gefunden." }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Nur JPEG, PNG und WebP erlaubt." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Datei darf maximal 5 MB groß sein." },
        { status: 400 }
      );
    }

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const filename = `listings/${session.user.id}-${Date.now()}.${ext}`;

    const blob = await put(filename, file, { access: "public" });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload fehlgeschlagen." },
      { status: 500 }
    );
  }
}
