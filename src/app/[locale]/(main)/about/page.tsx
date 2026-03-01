import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight, MapPin, CheckCircle2, Sparkles, Users,
  Zap, Shield, Clock, DollarSign, TrendingUp, Star,
} from "lucide-react";

interface Props {
  params: { locale: string };
}

export default async function AboutPage({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations("about");

  const [listingCount, userCount] = await Promise.all([
    prisma.listing.count({ where: { status: "ACTIVE" } }),
    prisma.user.count(),
  ]);

  const stats = [
    { value: `${listingCount}+`, label: params.locale === "de" ? "Aktive Angebote" : "Active Listings", icon: <Sparkles className="h-5 w-5 text-brand-600" /> },
    { value: `${userCount}+`,    label: params.locale === "de" ? "Registrierte Nutzer" : "Registered Users", icon: <Users className="h-5 w-5 text-brand-600" /> },
    { value: "12",               label: params.locale === "de" ? "Berliner Bezirke" : "Berlin Districts", icon: <MapPin className="h-5 w-5 text-brand-600" /> },
    { value: "0€",               label: params.locale === "de" ? "Grundgebühr" : "Base Fee", icon: <CheckCircle2 className="h-5 w-5 text-brand-600" /> },
  ];

  const features = [
    { icon: <Users className="h-5 w-5 text-brand-600" />,     text: t("f1") },
    { icon: <Shield className="h-5 w-5 text-blue-600" />,     text: t("f2") },
    { icon: <Clock className="h-5 w-5 text-amber-600" />,     text: t("f3") },
    { icon: <DollarSign className="h-5 w-5 text-emerald-600" />, text: t("f4") },
    { icon: <TrendingUp className="h-5 w-5 text-purple-600" />, text: t("f5") },
  ];

  const whyItems = [t("why1"), t("why2"), t("why3"), t("why4"), t("why5")];
  const visionItems = [t("vision1"), t("vision2"), t("vision3"), t("vision4")];
  const skills = [t("skill1"), t("skill2"), t("skill3"), t("skill4"), t("skill5")];

  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-emerald-500 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
          <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow">
            Heute gesucht. Heute erledigt!
          </p>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            Berlin · 2024
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6 whitespace-pre-line">
            {t("heroTitle")}
          </h1>
          <p className="text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1200 50 960 60 720 40C480 20 240 0 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-center text-xs font-semibold text-brand-600 uppercase tracking-widest mb-10">
          {t("statsTitle")}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center group">
              <div className="h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-6">
            {t("problemBadge")}
          </p>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 leading-snug mb-4">
                {t("problemHeadline")}
              </h2>
              <p className="text-brand-600 font-semibold mb-6">{t("problemSub")}</p>
              <p className="text-gray-600 leading-relaxed mb-4">{t("problemStory")}</p>
              <p className="text-gray-600 leading-relaxed">{t("problemNeighbors")}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <p className="text-gray-700 font-medium mb-5 leading-relaxed">{t("talentQuestion")}</p>
              <ul className="space-y-3">
                {skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-brand-500 flex-shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-xl font-bold text-brand-600">{t("talentQuote")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── UNSERE IDEE ──────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
              {t("ideaBadge")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              {t("ideaHeadline")}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">{t("ideaText")}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[t("ideaNot1"), t("ideaNot2"), t("ideaNot3")].map((item) => (
              <div key={item} className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
                <span className="text-xl font-bold text-red-400 block mb-2">✗</span>
                <p className="font-semibold text-red-700 text-sm">{item}</p>
              </div>
            ))}
          </div>

          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-8 text-center">
            <p className="text-xl font-bold text-brand-700">{t("ideaInstead")}</p>
          </div>
        </div>
      </section>

      {/* ── MEHR ALS NUR ─────────────────────────────── */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
              {t("featuresBadge")}
            </p>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {t("featuresHeadline")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md hover:border-brand-100 transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <p className="text-sm font-medium text-gray-800 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 font-semibold mt-10 text-base">
            {t("featuresBoth")}
          </p>
        </div>
      </section>

      {/* ── WARUM DAS WICHTIG IST ────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-8 text-center">
            {t("whyBadge")}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {whyItems.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-4 w-4 text-brand-600" />
                </div>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-brand-600 font-semibold mt-10 text-lg italic">
            {t("whyTagline")}
          </p>
        </div>
      </section>

      {/* ── UNSERE VISION ────────────────────────────── */}
      <section className="bg-gradient-to-br from-brand-600 to-emerald-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-4">
            {t("visionBadge")}
          </p>
          <p className="text-white/80 mb-8 text-base">{t("visionIntro")}</p>
          <div className="grid sm:grid-cols-2 gap-4 text-left mb-10">
            {visionItems.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white/10 border border-white/20 rounded-2xl p-5">
                <Star className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/90 font-medium">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-white font-bold text-lg">{t("visionTagline")}</p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("ctaTitle")}</h2>
          <p className="text-gray-500 mb-8">{t("ctaText")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
            >
              {t("ctaButton")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/listings"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-white border border-gray-200 hover:border-brand-300 text-gray-700 hover:text-brand-600 font-semibold text-sm rounded-xl transition-colors"
            >
              {t("ctaButtonSecondary")}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
