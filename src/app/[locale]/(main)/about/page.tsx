import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import {
  Shield, Users, Star, Heart,
  ArrowRight, MapPin, CheckCircle2, Sparkles,
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

  const values = [
    { icon: <Shield className="h-6 w-6 text-brand-600" />, bg: "bg-brand-50", title: t("v1Title"), desc: t("v1Desc") },
    { icon: <Users  className="h-6 w-6 text-blue-600"  />, bg: "bg-blue-50",  title: t("v2Title"), desc: t("v2Desc") },
    { icon: <Star   className="h-6 w-6 text-amber-500" />, bg: "bg-amber-50", title: t("v3Title"), desc: t("v3Desc") },
    { icon: <Heart  className="h-6 w-6 text-rose-500"  />, bg: "bg-rose-50",  title: t("v4Title"), desc: t("v4Desc") },
  ];

  const stats = [
    { value: `${listingCount}+`, label: params.locale === "de" ? "Aktive Angebote" : "Active Listings", icon: <Sparkles className="h-5 w-5 text-brand-600" /> },
    { value: `${userCount}+`,    label: params.locale === "de" ? "Registrierte Nutzer" : "Registered Users", icon: <Users className="h-5 w-5 text-brand-600" /> },
    { value: "12",               label: params.locale === "de" ? "Berliner Bezirke" : "Berlin Districts",  icon: <MapPin className="h-5 w-5 text-brand-600" /> },
    { value: "0€",               label: params.locale === "de" ? "Grundgebühr" : "Base Fee",              icon: <CheckCircle2 className="h-5 w-5 text-brand-600" /> },
  ];

  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-emerald-500 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
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
        {/* Wave */}
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

      {/* ── MISSION + STORY ──────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Mission */}
          <div>
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">{t("missionTitle")}</p>
            <p className="text-2xl font-bold text-gray-900 leading-snug mb-4">
              {t("missionText")}
            </p>
            <div className="flex flex-col gap-2 mt-6">
              {(params.locale === "de"
                ? ["Verifizierte Nutzerprofile", "Echte Nachbarn in deinem Kiez", "Sicher & kostenlos"]
                : ["Verified user profiles", "Real neighbors in your area", "Safe & free of charge"]
              ).map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-brand-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Story */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center mb-5">
              <Sparkles className="h-5 w-5 text-brand-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">{t("storyTitle")}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{t("storyText")}</p>
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">{t("valuesTitle")}</p>
            <h2 className="text-3xl font-bold text-gray-900">
              {params.locale === "de" ? "Was uns antreibt" : "What drives us"}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-brand-100 transition-all group">
                <div className={`h-12 w-12 rounded-xl ${v.bg} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                  {v.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{v.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM VISUAL ──────────────────────────────── */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
            {params.locale === "de" ? "Unser Team" : "Our Team"}
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {params.locale === "de" ? "Menschen hinter KiezHelfer" : "People behind KiezHelfer"}
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto mb-12">
            {params.locale === "de"
              ? "Wir sind ein kleines, leidenschaftliches Team aus Berlin, das daran glaubt, dass gute Nachbarschaft alles verändert."
              : "We are a small, passionate team from Berlin who believe that good neighborliness changes everything."}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { name: "Anna K.", role: params.locale === "de" ? "Gründerin & CEO" : "Founder & CEO", initials: "AK", color: "bg-brand-100 text-brand-700" },
              { name: "Max B.",  role: params.locale === "de" ? "Technik & Produkt" : "Tech & Product",  initials: "MB", color: "bg-blue-100 text-blue-700" },
              { name: "Lena S.", role: params.locale === "de" ? "Community & Wachstum" : "Community & Growth", initials: "LS", color: "bg-amber-100 text-amber-700" },
            ].map((member) => (
              <div key={member.name} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center">
                <div className={`h-14 w-14 rounded-full ${member.color} flex items-center justify-center text-lg font-bold mx-auto mb-3`}>
                  {member.initials}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
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
