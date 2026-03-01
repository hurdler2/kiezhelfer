"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { MessageCircle, Loader2 } from "lucide-react";

interface Props {
  recipientId: string;
  listingId: string;
  listingTitle: string;
}

export default function ContactButton({ recipientId, listingId, listingTitle }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("listings");
  const [loading, setLoading] = useState(false);

  async function handleContact() {
    if (!session?.user) {
      router.push(`/${locale}/login`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId, listingId }),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/${locale}/messages/${data.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleContact}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MessageCircle className="h-4 w-4" />
      )}
      {t("sendMessage")}
    </button>
  );
}
