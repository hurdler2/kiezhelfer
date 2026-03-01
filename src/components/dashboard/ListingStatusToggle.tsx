"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

interface Props {
  listingId: string;
  initialStatus: "ACTIVE" | "PAUSED" | "DELETED";
  activeLabel: string;
  pausedLabel: string;
  deleteLabel: string;
  deleteConfirm: string;
}

export default function ListingStatusToggle({
  listingId,
  initialStatus,
  activeLabel,
  pausedLabel,
  deleteLabel,
  deleteConfirm,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  async function toggleStatus() {
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

  async function deleteListing() {
    if (!confirm(deleteConfirm)) return;
    setLoading(true);
    try {
      await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* Toggle button */}
      <button
        onClick={toggleStatus}
        disabled={loading}
        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
          status === "ACTIVE"
            ? "bg-green-100 text-green-700 hover:bg-yellow-100 hover:text-yellow-700"
            : "bg-yellow-100 text-yellow-700 hover:bg-green-100 hover:text-green-700"
        }`}
        title={status === "ACTIVE" ? pausedLabel : activeLabel}
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : status === "ACTIVE" ? (
          activeLabel
        ) : (
          pausedLabel
        )}
      </button>

      {/* Delete button */}
      <button
        onClick={deleteListing}
        disabled={loading}
        className="p-1 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
        title={deleteLabel}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
