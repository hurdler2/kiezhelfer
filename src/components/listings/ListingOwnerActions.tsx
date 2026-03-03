"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, PauseCircle, PlayCircle } from "lucide-react";

interface Props {
  listingId: string;
  initialStatus: "PENDING" | "ACTIVE" | "PAUSED";
  locale: string;
  activeLabel: string;
  pausedLabel: string;
  deleteLabel: string;
  deleteConfirm: string;
  pauseLabel: string;
  unpauseLabel: string;
}

export default function ListingOwnerActions({
  listingId,
  initialStatus,
  locale,
  deleteLabel,
  deleteConfirm,
  pauseLabel,
  unpauseLabel,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  async function togglePause() {
    const newStatus = status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    setLoading(true);
    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm(deleteConfirm)) return;
    setLoading(true);
    try {
      await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DELETED" }),
      });
      router.push(`/${locale}/listings`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Pause/Unpause — only for ACTIVE or PAUSED listings */}
      {(status === "ACTIVE" || status === "PAUSED") && (
        <button
          onClick={togglePause}
          disabled={loading}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
            status === "ACTIVE"
              ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200"
              : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
          }`}
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : status === "ACTIVE" ? (
            <>
              <PauseCircle className="h-3.5 w-3.5" />
              {pauseLabel}
            </>
          ) : (
            <>
              <PlayCircle className="h-3.5 w-3.5" />
              {unpauseLabel}
            </>
          )}
        </button>
      )}

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <>
            <Trash2 className="h-3.5 w-3.5" />
            {deleteLabel}
          </>
        )}
      </button>
    </div>
  );
}
