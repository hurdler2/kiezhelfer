"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Trash2, Loader2 } from "lucide-react";

export default function AdminReviewActions({ reviewId, currentStatus }: { reviewId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function patch(body: object, action: string) {
    setLoading(action);
    await fetch(`/api/admin/reviews/${reviewId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setLoading(null);
    router.refresh();
  }

  async function deleteReview() {
    if (!window.confirm("Bu yorumu kalıcı olarak silmek istiyor musunuz?")) return;
    setLoading("delete");
    await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1.5">
      {currentStatus !== "APPROVED" && (
        <button onClick={() => patch({ status: "APPROVED" }, "approve")} disabled={loading !== null} className="p-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
          {loading === "approve" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />} Onayla
        </button>
      )}
      {currentStatus !== "REJECTED" && (
        <button onClick={() => patch({ status: "REJECTED" }, "reject")} disabled={loading !== null} className="p-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100">
          {loading === "reject" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />} Reddet
        </button>
      )}
      <button onClick={deleteReview} disabled={loading !== null} title="Kalıcı Sil" className="p-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700">
        {loading === "delete" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Sil
      </button>
    </div>
  );
}
