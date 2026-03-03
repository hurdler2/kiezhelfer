"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error ?? t("networkError"));
      }
    } catch {
      setError(t("networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex justify-between items-center p-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="KiezHelfer" width={100} height={100} className="rounded-lg" />
          <span className="font-bold text-gray-900">KiezHelfer</span>
        </Link>
        <LocaleSwitcher />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{t("forgotTitle")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("forgotSubtitle")}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            {sent ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">📧</div>
                <p className="font-medium text-gray-900">{t("forgotSentTitle")}</p>
                <p className="text-sm text-gray-500 mt-1">{t("forgotSentDesc")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="email"
                  type="email"
                  label={t("email")}
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}
                <Button type="submit" loading={loading} className="w-full">
                  {t("forgotSubmit")}
                </Button>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            <Link href="/login" className="text-teal-600 hover:text-teal-700 font-medium">
              {t("backToLogin")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
