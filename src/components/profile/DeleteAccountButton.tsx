"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";

export default function DeleteAccountButton() {
  const t = useTranslations("profile");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? t("deleteAccountError"));
        setLoading(false);
        return;
      }
      await signOut({ redirect: false });
      window.location.href = "/de";
    } catch {
      setError(t("deleteAccountError"));
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
      >
        <Trash2 className="h-4 w-4" />
        {t("deleteAccountBtn")}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{t("deleteAccountTitle")}</h2>
            <p className="text-sm text-gray-500 mb-6">{t("deleteAccountDesc")}</p>

            {error && (
              <p className="text-sm text-red-600 mb-4">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t("deleteAccountCancel")}
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {loading ? "..." : t("deleteAccountConfirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
