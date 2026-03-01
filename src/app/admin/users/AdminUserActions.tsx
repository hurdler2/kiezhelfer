"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldOff, Ban, CheckCircle, Loader2 } from "lucide-react";

export default function AdminUserActions({ userId, currentRole, isBanned }: { userId: string; currentRole: string; isBanned: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function patch(body: object, action: string) {
    setLoading(action);
    await fetch(`/api/admin/users/${userId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => patch({ banned: !isBanned }, "ban")}
        disabled={loading !== null}
        className={`p-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 ${isBanned ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"}`}
      >
        {loading === "ban" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : isBanned ? <CheckCircle className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
        {isBanned ? "Aktif Et" : "Banla"}
      </button>
      <button
        onClick={() => patch({ role: currentRole === "ADMIN" ? "USER" : "ADMIN" }, "role")}
        disabled={loading !== null}
        className={`p-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 ${currentRole === "ADMIN" ? "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100" : "bg-brand-50 border-brand-200 text-brand-700 hover:bg-brand-100"}`}
      >
        {loading === "role" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : currentRole === "ADMIN" ? <ShieldOff className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
        {currentRole === "ADMIN" ? "User Yap" : "Admin Yap"}
      </button>
    </div>
  );
}
