"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";

export default function EmailVerifyBanner() {
  const t = useTranslations("auth");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function resend() {
    setLoading(true);
    try {
      await fetch("/api/auth/resend-verify", { method: "POST" });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-6 flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
      <Mail className="h-4 w-4 mt-0.5 shrink-0" />
      <div>
        <p>{t("emailVerifyBanner")}</p>
        {sent ? (
          <p className="mt-1 font-medium text-green-700">{t("emailVerifySent")}</p>
        ) : (
          <button
            onClick={resend}
            disabled={loading}
            className="mt-1 text-amber-700 font-medium underline hover:no-underline disabled:opacity-50"
          >
            {loading ? "..." : t("emailVerifyResend")}
          </button>
        )}
      </div>
    </div>
  );
}
