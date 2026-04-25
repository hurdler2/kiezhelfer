"use client";

import { useState, useRef } from "react";
import { Eye, EyeOff, Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/user";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import { BERLIN_DISTRICTS } from "@/types";
import Image from "next/image";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const tp = useTranslations("profile");
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setAvatarError("Only JPEG, PNG and WebP allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Max 5 MB.");
      return;
    }

    setAvatarFile(file);
    setAvatarError(null);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function onSubmit(data: RegisterFormValues) {
    setError(null);
    if (!termsAccepted) {
      setTermsError(true);
      return;
    }
    setTermsError(false);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      if (data.district) formData.append("district", data.district);
      if (data.bio) formData.append("bio", data.bio);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 2000);
    } catch {
      setError(t("networkError"));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex justify-between items-center p-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logolast2.png" alt="KiezHelfer" width={140} height={140} className="object-contain h-10 w-auto" />
          <div className="flex flex-col leading-none">
            <span className="text-base font-extrabold tracking-tight text-gray-900">Kiez<span className="text-brand-500">Helfer</span></span>
            <span className="text-[9px] font-medium tracking-widest uppercase mt-0.5 text-gray-400">Berlin</span>
          </div>
        </Link>
        <LocaleSwitcher />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{t("registerTitle")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("joinCommunity")}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            {success ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-medium text-gray-900">{t("registrationSuccess")}</p>
                <p className="text-sm text-gray-500 mt-1">{t("redirecting")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("profilePhoto")}
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-300 hover:border-brand-500 flex items-center justify-center overflow-hidden transition-colors bg-gray-50"
                    >
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="Avatar"
                          fill
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <Camera className="h-6 w-6 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700"
                      >
                        {avatarPreview ? t("changePhoto") : t("uploadPhoto")}
                      </button>
                      <p className="text-xs text-gray-400 mt-0.5">JPEG, PNG, WebP · max 5 MB</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  {avatarError && (
                    <p className="text-sm text-red-600 mt-1">{avatarError}</p>
                  )}
                </div>

                <Input
                  id="name"
                  type="text"
                  label={t("name")}
                  placeholder={t("namePlaceholder")}
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  id="email"
                  type="email"
                  label={t("email")}
                  placeholder={t("emailPlaceholder")}
                  error={errors.email?.message}
                  {...register("email")}
                />
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    label={t("password")}
                    placeholder={t("passwordPlaceholder")}
                    error={errors.password?.message}
                    className="pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-7 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    label={t("confirmPassword")}
                    placeholder={t("confirmPasswordPlaceholder")}
                    error={errors.confirmPassword?.message}
                    className="pr-10"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-7 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Bio / Fähigkeiten */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {tp("skillsLabel")}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={tp("bioPlaceholder")}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    {...register("bio")}
                  />
                </div>

                {/* District (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("district")}
                  </label>
                  <select
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-teal-500 focus:outline-none"
                    {...register("district")}
                  >
                    <option value="">{t("selectDistrict")}</option>
                    {BERLIN_DISTRICTS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nutzungsbedingungen */}
                <div>
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => { setTermsAccepted(e.target.checked); setTermsError(false); }}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                      Ich habe die{" "}
                      <button
                        type="button"
                        onClick={() => setTermsOpen(true)}
                        className="text-brand-600 hover:underline font-medium"
                      >
                        Nutzungsbedingungen
                      </button>{" "}
                      gelesen und akzeptiere sie.
                    </label>
                  </div>
                  {termsError && (
                    <p className="text-xs text-red-600 mt-1">Bitte akzeptiere die Nutzungsbedingungen.</p>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button type="submit" loading={isSubmitting} className="w-full">
                  {t("submitRegister")}
                </Button>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            {t("alreadyHaveAccount")}{" "}
            <Link href="/login" className="text-teal-600 hover:text-teal-700 font-medium">
              {t("loginLink")}
            </Link>
          </p>
        </div>
      </div>

      {/* Nutzungsbedingungen Modal */}
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900">Nutzungsbedingungen</h2>
              <button onClick={() => setTermsOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="overflow-y-auto px-6 py-4 text-sm text-gray-700 leading-relaxed space-y-4 flex-1">
              <p className="text-xs text-gray-400">Stand: April 2026</p>

              <section><h3 className="font-semibold text-gray-900 mb-1">1. Vertragsgegenstand &amp; Rolle von KiezHelfer</h3><p>KiezHelfer stellt lediglich die <strong>technische Infrastruktur</strong> zur Kontaktaufnahme zwischen Privatpersonen in Berlin bereit. KiezHelfer ist kein Handwerksbetrieb, kein Dienstleistungsunternehmen und kein Arbeitsvermittler.</p></section>

              <section><h3 className="font-semibold text-gray-900 mb-1">2. Vertragsschluss ausschließlich zwischen Nutzern</h3><p>Verträge über Hilfeleistungen entstehen ausschließlich und direkt zwischen dem Hilfesuchenden und dem Helfer. Durch die Nutzung der Plattform entsteht <strong>kein Arbeitsverhältnis</strong> zwischen dem Nutzer und dem Plattformbetreiber.</p></section>

              <section><h3 className="font-semibold text-gray-900 mb-1">3. Registrierung und Nutzerkonto</h3><ul className="list-disc pl-4 space-y-1"><li>Die Nutzung setzt eine Registrierung mit wahrheitsgemäßen Angaben voraus.</li><li>Die Nutzung ist ausschließlich natürlichen Personen zu privaten Zwecken gestattet.</li><li>Das Mindestalter beträgt 18 Jahre (oder 16 Jahre mit Zustimmung der Erziehungsberechtigten).</li><li>Die Plattform ist für Nutzer aktuell kostenlos.</li></ul></section>

              <section><h3 className="font-semibold text-gray-900 mb-1">4. Verhaltensregeln und Inhalte</h3><p>Untersagt sind Inhalte, die gegen geltendes Recht verstoßen, beleidigend oder diskriminierend sind oder Werbung enthalten. Der Betreiber kann Inhalte bei Verstößen löschen und Konten sperren.</p></section>

              <section><h3 className="font-semibold text-gray-900 mb-1">5. Eigenverantwortung &amp; Handwerksordnung</h3><p>Nutzer sind selbst verantwortlich, die Qualifikation des Gegenübers zu prüfen. KiezHelfer führt keine Überprüfung von Meisterbriefen oder Zertifikaten durch.</p></section>

              <section><h3 className="font-semibold text-gray-900 mb-1">6. Haftungsausschluss &amp; Versicherung</h3><p>Der Betreiber übernimmt keine Haftung für Schäden im Rahmen vermittelter Nachbarschaftshilfe. Wir empfehlen dringend den Abschluss einer <strong>privaten Haftpflichtversicherung</strong>.</p></section>

              <section><h3 className="font-semibold text-gray-900 mb-1">7. Steuern &amp; Schwarzarbeit</h3><p>Jeder Helfer handelt eigenverantwortlich und hat sicherzustellen, dass seine Tätigkeit steuerlich korrekt angemeldet ist und nicht gegen das Schwarzarbeitsgesetz verstößt.</p></section>

              <section><h3 className="font-semibold text-gray-900 mb-1">8–12. Weitere Bestimmungen</h3><p>Der Nutzer stellt den Betreiber von Ansprüchen Dritter frei. Der Betreiber haftet nur bei vorsätzlicher Pflichtverletzung. Nutzer können ihr Konto jederzeit löschen. Es gilt deutsches Recht.</p></section>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setTermsOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Schließen
              </button>
              <button
                onClick={() => { setTermsAccepted(true); setTermsError(false); setTermsOpen(false); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold"
              >
                Akzeptieren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
