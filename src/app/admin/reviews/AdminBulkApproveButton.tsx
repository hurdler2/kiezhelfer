"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";

export default function AdminBulkApproveButton({ pendingCount }: { pendingCount: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (pendingCount === 0) return null;

  const handleBulkApprove = async () => {
    if (!confirm(`${pendingCount} bekleyen yorumun hepsini onaylamak istediğinize emin misiniz?`)) return;
    setLoading(true);
    try {
      await fetch("/api/admin/reviews/bulk-approve", { method: "POST" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBulkApprove}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors"
    >
      <CheckCheck className="h-3.5 w-3.5" />
      {loading ? "Onaylanıyor..." : `Hepsini Onayla (${pendingCount})`}
    </button>
  );
}
