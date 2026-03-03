"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  messageId: string;
  isRead: boolean;
}

export default function AdminContactActions({ messageId, isRead }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/admin/contact/${messageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !isRead }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="text-[12px] px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-50"
    >
      {loading ? "..." : isRead ? "Okunmadı işaretle" : "Okundu işaretle"}
    </button>
  );
}
