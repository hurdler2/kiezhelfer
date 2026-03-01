"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, Trash2, Loader2, CheckCircle } from "lucide-react";

export default function AdminListingActions({
  listingId,
  currentStatus,
}: {
  listingId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function patch(body: object, action: string) {
    setLoading(action);
    await fetch(`/api/admin/listings/${listingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {currentStatus === "PENDING" && (
        <button
          onClick={() => patch({ status: "ACTIVE" }, "approve")}
          disabled={loading !== null}
          className="p-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 disabled:opacity-50"
        >
          {loading === "approve" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
          Onayla
        </button>
      )}

      {currentStatus === "ACTIVE" && (
        <button
          onClick={() => patch({ status: "PAUSED" }, "pause")}
          disabled={loading !== null}
          className="p-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 disabled:opacity-50"
        >
          {loading === "pause" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pause className="h-3.5 w-3.5" />}
          Duraklat
        </button>
      )}

      {currentStatus === "PAUSED" && (
        <button
          onClick={() => patch({ status: "ACTIVE" }, "activate")}
          disabled={loading !== null}
          className="p-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 disabled:opacity-50"
        >
          {loading === "activate" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          Aktif Et
        </button>
      )}

      {currentStatus !== "DELETED" && (
        <button
          onClick={() => patch({ status: "DELETED" }, "delete")}
          disabled={loading !== null}
          className="p-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 disabled:opacity-50"
        >
          {loading === "delete" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          Sil
        </button>
      )}
    </div>
  );
}
