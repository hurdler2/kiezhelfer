"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Flag, X, Loader2, AlertTriangle } from "lucide-react";

const REASON_KEYS = ["spam", "fake", "harassment", "scam", "inappropriate", "other"] as const;

export default function ReportUserButton({
  reportedId,
  reportedName,
}: {
  reportedId: string;
  reportedName: string;
}) {
  const t = useTranslations("reports");
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
        body: JSON.stringify({ reportedId, reason, details }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? t("errorGeneric"));
      } else {
        setDone(true);
      }
    } catch {
      setError(t("errorConnection"));
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
        {t("button")}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h2 className="font-semibold text-gray-900">{t("title")}</h2>
              </div>
              <button onClick={close} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {done ? (
                <div className="text-center py-6">
                  <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">{t("successTitle")}</p>
                  <p className="text-sm text-gray-500">
                    {t("successMessage", { name: reportedName })}
                  </p>
                  <button
                    onClick={close}
                    className="mt-5 px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {t("close")}
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <p className="text-sm text-gray-500">
                    <strong className="text-gray-700">{t("reportingAbout", { name: reportedName })}</strong>
                    {" "}{t("teamWillReview")}
                  </p>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("reasonLabel")} <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {REASON_KEYS.map((key) => (
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
                          {t(`reasons.${key}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("detailsLabel")}
                      <span className="text-gray-400 font-normal ml-1">{t("detailsOptional")}</span>
                    </label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      rows={3}
                      placeholder={t("detailsPlaceholder")}
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
                      {t("cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={!reason || loading}
                      className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                    >
                      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      {t("submit")}
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
