"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("E-posta veya şifre hatalı.");
      return;
    }

    // Rol kontrolü
    const res = await fetch("/api/auth/session");
    const session = await res.json();
    if (session?.user?.role !== "ADMIN") {
      await signOut({ redirect: false });
      setError("Bu hesabın admin yetkisi yok.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#080d14] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[380px]">
        {/* Logo & title */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-2xl bg-brand-500 blur-xl opacity-30" />
            <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-2xl">
              <Image src="/logo.png" alt="KiezHelfer" width={32} height={32} className="rounded-lg brightness-200" />
            </div>
          </div>
          <h1 className="text-white text-[22px] font-bold tracking-tight">KiezHelfer Admin</h1>
          <p className="text-slate-500 text-sm mt-1">Yönetici girişi gerekli</p>
        </div>

        {/* Card */}
        <div className="bg-[#111827]/80 backdrop-blur-xl rounded-2xl border border-white/8 p-7 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full bg-[#0d1520] border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20 placeholder-slate-600 transition-all"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0d1520] border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20 placeholder-slate-600 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <Lock className="h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-lg shadow-brand-500/25 mt-1"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-700 mt-6">
          Sadece yetkili yöneticiler giriş yapabilir
        </p>
      </div>
    </div>
  );
}
