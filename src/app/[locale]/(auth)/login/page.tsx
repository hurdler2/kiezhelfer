"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { loginSchema, type LoginFormValues } from "@/lib/validations/user";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormValues) {
    setError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError(t("invalidCredentials"));
      return;
    }

    // Admin hesabı kullanıcı login sayfasından giriş yapamaz
    const res = await fetch("/api/auth/session");
    const session = await res.json();
    if (session?.user?.role === "ADMIN") {
      await signOut({ redirect: false });
      setError(t("adminLoginRequired"));
      return;
    }

    window.location.href = `/${locale}/dashboard`;
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
            <h1 className="text-2xl font-bold text-gray-900">{t("loginTitle")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("welcomeBack")}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  placeholder="••••••••"
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

              <div className="text-right">
                <Link href="/forgot-password" className="text-xs text-teal-600 hover:text-teal-700">
                  {t("forgotPassword")}
                </Link>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button type="submit" loading={isSubmitting} className="w-full">
                {t("submitLogin")}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-teal-600 hover:text-teal-700 font-medium">
              {t("registerLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
