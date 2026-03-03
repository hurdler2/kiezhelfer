"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormValues) {
    setError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
          <Image src="/logo.png" alt="KiezHelfer" width={100} height={100} className="rounded-lg" />
          <span className="font-bold text-gray-900">KiezHelfer</span>
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
    </div>
  );
}
