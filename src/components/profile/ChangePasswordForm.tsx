"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ChangePasswordForm() {
  const t = useTranslations("auth");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError(t("passwordTooShort"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setError(data.error ?? t("networkError"));
      }
    } catch {
      setError(t("networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Input
          id="currentPassword"
          type={showCurrent ? "text" : "password"}
          label={t("currentPassword")}
          placeholder="••••••••"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="pr-10"
          required
        />
        <button
          type="button"
          onClick={() => setShowCurrent((v) => !v)}
          className="absolute right-3 top-7 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <div className="relative">
        <Input
          id="newPassword"
          type={showNew ? "text" : "password"}
          label={t("newPassword")}
          placeholder={t("passwordPlaceholder")}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="pr-10"
          required
        />
        <button
          type="button"
          onClick={() => setShowNew((v) => !v)}
          className="absolute right-3 top-7 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          {t("changePasswordSuccess")}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <Button type="submit" loading={loading}>
        {t("changePasswordSubmit")}
      </Button>
    </form>
  );
}
