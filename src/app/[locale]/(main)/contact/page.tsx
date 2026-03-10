"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Clock } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const t = useTranslations("legal");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setSent(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setError(t("contactError"));
      }
    } catch {
      setError(t("contactNetworkError"));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("contactTitle")}</h1>
      <p className="text-gray-500 mb-10">{t("contactSubtitle")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{t("contactAddress")}</p>
              <p className="text-sm text-gray-500 mt-1">
                {t("contactCompany")}<br />
                {t("contactStreet")}<br />
                {t("contactCity")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{t("contactEmailLabel")}</p>
              <a href={`mailto:${t("contactEmailValue")}`} className="text-sm text-teal-600 hover:text-teal-700 mt-1 block">
                {t("contactEmailValue")}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{t("contactHoursLabel")}</p>
              <p className="text-sm text-gray-500 mt-1">{t("contactHoursValue")}</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {sent ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-medium text-gray-900">{t("contactSuccess")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="contact-name"
                label={t("contactNameLabel")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                id="contact-email"
                type="email"
                label={t("contactEmailInput")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("contactMessageLabel")}
                </label>
                <textarea
                  rows={5}
                  placeholder={t("contactMessagePlaceholder")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}
              <Button type="submit" loading={sending} className="w-full">
                {t("contactSend")}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
