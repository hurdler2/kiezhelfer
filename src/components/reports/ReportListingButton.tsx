"use client";

import { useState } from "react";
import { Flag, X, Loader2, AlertTriangle } from "lucide-react";

const REASON_LABELS: Record<string, string> = {
  spam: "Spam / Reklam",
  fake: "Sahte İlan",
  harassment: "Taciz / Hakaret",
  scam: "Dolandırıcılık",
  inappropriate: "Uygunsuz İçerik",
  other: "Diğer",
};

export default function ReportListingButton({
  listingId,
  listingTitle,
  ownerId,
}: {
  listingId: string;
  listingTitle: string;
  ownerId: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportedId: ownerId, listingId, reason, details }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Bir hata oluştu");
      } else {
        setDone(true);
      }
    } catch {
      setError("Bağlantı hatası, lütfen tekrar deneyin");
    } finally {
      setLoading(false);
    }
  }

  function close() {
    setOpen(false);
    setTimeout(() => {
      setDone(false);
      setReason("");
      setDetails("");
      setError("");
    }, 300);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
      >
        <Flag className="h-3.5 w-3.5" />
        İlanı Şikayet Et
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h2 className="font-semibold text-gray-900">İlan Şikayet Et</h2>
              </div>
              <button onClick={close} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5">
              {done ? (
                <div className="text-center py-6">
                  <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">Şikayetiniz alındı</p>
                  <p className="text-sm text-gray-500">Ekibimiz en kısa sürede inceleyecek.</p>
                  <button
                    onClick={close}
                    className="mt-5 px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <p className="text-sm text-gray-500">
                    <strong className="text-gray-700">&quot;{listingTitle}&quot;</strong>{" "}
                    başlıklı ilan için şikayet oluşturuyorsunuz. Ekibimiz inceleyecektir.
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Neden <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(REASON_LABELS).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setReason(key)}
                          className={`px-3 py-2 text-xs rounded-lg border text-left transition-colors ${
                            reason === key
                              ? "border-red-400 bg-red-50 text-red-700 font-medium"
                              : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Açıklama <span className="text-gray-400 font-normal ml-1">(isteğe bağlı)</span>
                    </label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      rows={3}
                      placeholder="Daha fazla detay ekleyin..."
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                  )}

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={close}
                      className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={!reason || loading}
                      className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                    >
                      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Şikayet Gönder
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
