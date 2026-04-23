import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import ListingCard from "@/components/listings/ListingCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import type { Metadata } from "next";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import {
  ArrowRight, Shield, MessageCircle, MapPin,
  BadgeCheck, Zap, ChevronRight,
  UserCheck, ThumbsUp,
} from "lucide-react";

const BASE_URL = "https://kiezhelfer.vercel.app";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isDE = params.locale === "de";
  return {
    title: isDE
      ? "KiezHelfer – Nachbarschaftshilfe in Berlin"
      : "KiezHelfer – Neighborhood Help in Berlin",
    description: isDE
      ? "Finde Handwerker, Alltags- & Nachbarschaftshilfe in deinem Berliner Kiez – lokal, einfach, fair. Heute gesucht. Heute erledigt!"
      : "Find craftsmen and everyday help in your Berlin neighborhood – local, simple, fair. Searched today. Done today!",
    alternates: {
      canonical: `${BASE_URL}/${params.locale}`,
      languages: { de: `${BASE_URL}/de`, en: `${BASE_URL}/en` },
    },
  };
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("home");
  const tCat = await getTranslations("categories");
  const session = await auth();
  const isLoggedIn = !!session?.user;

  const [featuredListings, listingCount, userCount, categories] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "ACTIVE" },
      include: {
        user: {
          select: {
            id: true, name: true,
            profile: { select: { avatarUrl: true, district: true, averageRating: true, reviewCount: true } },
          },
        },
        category: true,
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.listing.count({ where: { status: "ACTIVE" } }),
    prisma.user.count(),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const categoryMeta: Record<string, { photo: string; gradient: string; descKey: string }> = {
    "reparaturen-montage": {
      photo: "/Site-Fotolar/Kleine-Reparaturen.png",
      gradient: "from-orange-900/70 via-orange-800/40 to-transparent",
      descKey: "reparaturenMontageDesc",
    },
    "technik-computer": {
      photo: "/Site-Fotolar/Tecknik%26Computerhilfe.png",
      gradient: "from-blue-900/70 via-blue-800/40 to-transparent",
      descKey: "technikComputerDesc",
    },
    "alltag-nachbarschaft": {
      photo: "/Site-Fotolar/Gemini_Generated_Image_xyhm7cxyhm7cxyhm.png",
      gradient: "from-emerald-900/70 via-emerald-800/40 to-transparent",
      descKey: "alltagNachbarschaftDesc",
    },
    "garten-outdoor": {
      photo: "/Site-Fotolar/Garten%26Outdoor.png",
      gradient: "from-green-900/70 via-green-800/40 to-transparent",
      descKey: "gartenOutdoorDesc",
    },
    "transport-kurier": {
      photo: "/Site-Fotolar/Transport%26Umzughilfe.png",
      gradient: "from-amber-900/70 via-amber-800/40 to-transparent",
      descKey: "transportKurierDesc",
    },
  };

  return (
    <>
      <LocalBusinessSchema />
      <Navbar transparent />
      <main className="min-h-screen bg-white">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden text-white min-h-[680px]">
          <Image
            src="/hero2.png"
            alt="KiezHelfer Hero"
            fill
            priority
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-900/45 to-slate-950/60" />
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center">
            <div className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-400/25 rounded-full px-4 py-1.5 text-xs text-brand-300 mb-8 font-medium tracking-wide uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
              Berlin · {userCount}+ {t("registeredUsersLabel")}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 leading-[1.12] tracking-tight">
              <span className="text-white">{t("heroTitle")}</span>
            </h1>
            <p className="text-base md:text-lg text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
              {t("heroSubtitle")}
            </p>

            {/* Search */}
            <form
              action={`/${params.locale}/listings`}
              method="GET"
              className="max-w-2xl mx-auto mb-10"
            >
              <div className="flex rounded-xl overflow-hidden bg-white/20 backdrop-blur-md border border-white/35 focus-within:border-white/60 transition-colors">
                <input
                  type="text"
                  name="q"
                  placeholder={t("searchPlaceholder")}
                  className="flex-1 px-5 py-4 bg-transparent text-white text-sm placeholder:text-white/60 focus:outline-none focus-visible:ring-0"
                />
                <button
                  type="submit"
                  className="m-1.5 px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  {t("searchButton")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Kategori pilleri */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => {
                const nameKey = (cat.nameKey ?? "").replace("categories.", "");
                return (
                  <Link
                    key={cat.id}
                    href={`/listings?category=${cat.slug}` as any}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white text-xs font-medium transition-all backdrop-blur-sm"
                  >
                    {nameKey ? tCat(nameKey as any) : cat.slug}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── İSTATİSTİK BANDI ─────────────────────────────────────── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-3 divide-x divide-gray-100">
              {[
                { icon: <ThumbsUp className="h-5 w-5 text-brand-600" />, value: `${listingCount}+`, label: t("statsListings") },
                { icon: <MapPin className="h-5 w-5 text-brand-600" />, value: "12", label: t("statsBezirke") },
                { icon: <UserCheck className="h-5 w-5 text-brand-600" />, value: `${userCount}+`, label: t("statsUsers") },
              ].map((s) => (
                <div key={s.label} className="flex flex-col sm:flex-row items-center justify-center gap-3 py-6 px-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    {s.icon}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-2xl font-extrabold text-gray-900 leading-none">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NEDEN KIEZHELFERs ────────────────────────────────────── */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">{t("whyTitle")}</p>
              <h2 className="text-3xl font-bold text-gray-900">
                {t("whySubtitle")}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: <BadgeCheck className="h-6 w-6 text-brand-600" />, bg: "bg-brand-50", title: t("why1Title"), desc: t("why1Desc") },
                { icon: <MessageCircle className="h-6 w-6 text-blue-600" />, bg: "bg-blue-50", title: t("why2Title"), desc: t("why2Desc") },
                { icon: <MapPin className="h-6 w-6 text-emerald-600" />, bg: "bg-emerald-50", title: t("why3Title"), desc: t("why3Desc") },
                { icon: <Zap className="h-6 w-6 text-amber-500" />, bg: "bg-amber-50", title: t("why4Title"), desc: t("why4Desc") },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-100 transition-all group">
                  <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── KATEGORİLER ──────────────────────────────────────────── */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-1">{t("categoriesLabel")}</p>
                <h2 className="text-3xl font-bold text-gray-900">{t("categoriesTitle")}</h2>
              </div>
              <Link href="/listings" className="hidden sm:flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium">
                {t("viewAll")} <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => {
                const meta = categoryMeta[cat.slug];
                const nameKey = (cat.nameKey ?? "").replace("categories.", "");
                const label = nameKey ? tCat(nameKey as any) : cat.slug;
                const descKey = meta?.descKey as any;
                const desc = descKey ? tCat(descKey) : "";
                return (
                  <Link
                    key={cat.id}
                    href={`/listings?category=${cat.slug}` as any}
                    className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={meta?.photo ?? "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=700&h=460&fit=crop&q=85"}
                        alt={label}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${meta?.gradient ?? "from-gray-900/70 via-gray-800/40 to-transparent"}`} />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <p className="text-white font-bold text-base leading-snug drop-shadow-sm">
                          {label}
                        </p>
                        <p className="text-white/75 text-xs mt-1 font-medium">{desc}</p>
                      </div>
                    </div>
                    <div className="bg-white border-t border-gray-100 px-5 py-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">
                        {t("viewListings")}
                      </span>
                      <ChevronRight className="h-4 w-4 text-brand-500 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── GÜNCEL İLANLAR ───────────────────────────────────────── */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-1">
                  {t("latestLabel")}
                </p>
                <h2 className="text-3xl font-bold text-gray-900">{t("featuredListings")}</h2>
              </div>
              <Link href="/listings" className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium">
                {t("viewAll")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {featuredListings.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {featuredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing as any} locale={params.locale} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg">{t("noListings")}</p>
                <Link href="/listings/new" className="mt-4 inline-block text-brand-600 font-medium">{t("beFirst")}</Link>
              </div>
            )}
          </div>
        </section>

        {/* ── NASIL ÇALIŞIR ────────────────────────────────────────── */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Başlık */}
            <div className="text-center mb-14">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
                {t("howItWorksLabel")}
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{t("howItWorks")}</h2>
            </div>

            {/* Adımlar */}
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {[
                {
                  step: "1",
                  photo: "/Site-Fotolar/Registrieren.png",
                  title: t("step1Title"),
                  desc: t("step1Desc"),
                  href: "/register",
                },
                {
                  step: "2",
                  photo: "/Site-Fotolar/Angebo%20erstellen.png",
                  title: t("step2Title"),
                  desc: t("step2Desc"),
                  href: "/listings/create",
                },
                {
                  step: "3",
                  photo: "/Site-Fotolar/Verbinden.png",
                  title: t("step3Title"),
                  desc: t("step3Desc"),
                  href: isLoggedIn ? "/listings" : "/register",
                },
              ].map((item, i) => (
                <div key={item.step} className="flex flex-col">
                  {/* Fotoğraf + numara */}
                  <Link href={item.href}>
                  <div className="relative rounded-2xl overflow-hidden mb-5 aspect-[4/3] bg-gray-100 shadow-sm border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity">
                    <Image
                      src={item.photo}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Numara - sol üst, beyaz daire */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white text-gray-900 font-extrabold text-base shadow-md">
                        {item.step}
                      </span>
                    </div>
                    {/* Bağlantı oku - sağ alt köşe (son kart hariç) */}
                    {i < 2 && (
                      <div className="hidden md:flex absolute bottom-3 right-3 z-10 items-center justify-center h-7 w-7 rounded-full bg-white/90 shadow border border-gray-100">
                        <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  </Link>
                  {/* Metin */}
                  <div className="flex items-start gap-3">
                    <span className="text-2xl font-extrabold text-gray-200 leading-none mt-0.5 select-none">{item.step}</span>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── CTA BANNER ───────────────────────────────────────────── */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Başlık */}
            <div className="text-center mb-14">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
                {t("ctaLabel")}
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {t("ctaMainTitle")}
              </h2>
              <p className="text-gray-500 mt-3 text-sm max-w-md mx-auto">
                {t("ctaMainSubtitle")}
              </p>
            </div>

            {/* Fotoğraflı kartlar */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* Kart 1 — Hilfe suchen */}
              <Link
                href="/listings"
                className="group relative overflow-hidden rounded-3xl min-h-[480px] flex flex-col justify-end shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              >
                {/* Arka plan fotoğrafı */}
                <div className="absolute inset-0">
                  <Image
                    src="/Site-Fotolar/Hilfe%20suchen.png"
                    alt={t("ctaSeekHelp")}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-800/50 to-slate-700/10" />
                {/* Üst badge */}
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    <UserCheck className="h-3.5 w-3.5" />
                    {t("ctaSeekBadge")}
                  </span>
                </div>
                {/* İçerik */}
                <div className="relative p-8 space-y-3">
                  <h3 className="text-2xl font-extrabold text-white leading-tight">
                    {t("ctaSeekHelp")}
                  </h3>
                  <p className="text-white/75 text-sm leading-relaxed">
                    {t("ctaSeekDesc")}
                  </p>
                  <div className="pt-3">
                    <span className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold text-sm px-6 py-3 rounded-xl group-hover:bg-blue-50 transition-colors shadow-md">
                      {t("ctaBrowseListings")}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Kart 2 — Hilfe anbieten */}
              <Link
                href="/listings/new"
                className="group relative overflow-hidden rounded-3xl min-h-[480px] flex flex-col justify-end shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              >
                {/* Arka plan fotoğrafı */}
                <div className="absolute inset-0">
                  <Image
                    src="/Site-Fotolar/Hilfe%20anbieten.png"
                    alt={t("ctaOfferHelp")}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {/* Gradient overlay — yeşil ton */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-900/55 to-green-800/10" />
                {/* Üst badge */}
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center gap-1.5 bg-brand-500/30 backdrop-blur-sm border border-brand-400/40 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Zap className="h-3.5 w-3.5" />
                    {t("ctaOfferBadge")}
                  </span>
                </div>
                {/* İçerik */}
                <div className="relative p-8 space-y-3">
                  <h3 className="text-2xl font-extrabold text-white leading-tight">
                    {t("ctaOfferHelp")}
                  </h3>
                  <p className="text-white/75 text-sm leading-relaxed">
                    {t("ctaOfferDesc")}
                  </p>
                  <div className="pt-3">
                    <span className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-md group-hover:shadow-brand-500/30 group-hover:shadow-xl">
                      {t("ctaCreateListing")}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>

            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
