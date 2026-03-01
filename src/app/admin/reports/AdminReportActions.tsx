"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Ban, Loader2, X } from "lucide-react";

const REASON_LABEL: Record<string, string> = {
  spam: "Spam / Reklam",
  fake: "Sahte Profil",
  harassment: "Taciz / Hakaret",
  scam: "Dolandırıcılık",
  inappropriate: "Uygunsuz İçerik",
  other: "Diğer",
};

export default function AdminReportActions({
  reportId,
  currentStatus,
  isBanned,
  reason,
  details,
  reportedName,
}: {
  reportId: string;
  currentStatus: string;
  isBanned: boolean;
  reason: string;
  details: string | null;
  reportedName: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function act(action: string) {
    if (action === "ban") {
      const ok = window.confirm(`${reportedName ?? "Bu kullanıcı"} banlanacak. Emin misiniz?`);
      if (!ok) return;
    }
    setLoading(action);
    setModalOpen(false);
    await fetch(`/api/admin/reports/${reportId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(null);
    router.refresh();
  }

  if (currentStatus === "DISMISSED") {
    return <span className="text-xs text-gray-400 italic">Reddedildi</span>;
  }

  if (isBanned && currentStatus === "REVIEWED") {
    return <span className="text-xs text-gray-400 italic">Banlandı</span>;
  }

  return (
    <>
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* İncele — modal açar */}
        {currentStatus === "PENDING" && (
          <button
            onClick={() => setModalOpen(true)}
            disabled={loading !== null}
            className="p-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 disabled:opacity-50"
          >
            {loading === "review" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
            İncele
          </button>
        )}

        {currentStatus !== "DISMISSED" && (
          <button
            onClick={() => act("dismiss")}
            disabled={loading !== null}
            className="p-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            {loading === "dismiss" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
            Reddet
          </button>
        )}

        {!isBanned && (
          <button
            onClick={() => act("ban")}
            disabled={loading !== null}
            className="p-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            {loading === "ban" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Ban className="h-3.5 w-3.5" />}
            Banla
          </button>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Şikayet Detayı</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Şikayet Edilen</p>
                <p className="text-gray-800 font-medium">{reportedName ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Neden</p>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                  {REASON_LABEL[reason] ?? reason}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Açıklama</p>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm leading-relaxed">
                  {details || <span className="italic text-gray-400">Açıklama girilmemiş</span>}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => act("review")}
                disabled={loading !== null}
                className="flex-1 py-2 rounded-lg border text-xs font-medium transition-colors flex items-center justify-center gap-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 disabled:opacity-50"
              >
                {loading === "review" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                İncelendi (işlem yok)
              </button>
              <button
                onClick={() => act("dismiss")}
                disabled={loading !== null}
                className="flex-1 py-2 rounded-lg border text-xs font-medium transition-colors flex items-center justify-center gap-1 bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                {loading === "dismiss" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                Reddet
              </button>
              {!isBanned && (
                <button
                  onClick={() => act("ban")}
                  disabled={loading !== null}
                  className="flex-1 py-2 rounded-lg border text-xs font-medium transition-colors flex items-center justify-center gap-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  {loading === "ban" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Ban className="h-3.5 w-3.5" />}
                  Banla
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}