import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import ListingCard from "@/components/listings/ListingCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Avatar from "@/components/ui/Avatar";
import StarRating from "@/components/ui/StarRating";
import Image from "next/image";
import {
  ArrowRight, Shield, MessageCircle, MapPin,
  BadgeCheck, Zap, Star, ChevronRight,
  UserCheck, Clock, ThumbsUp,
} from "lucide-react";

export default async function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("home");

  const [featuredListings, listingCount, userCount, categories, topReviews] = await Promise.all([
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
    prisma.review.findMany({
      where: { status: "APPROVED", rating: { gte: 4 }, comment: { not: null } },
      select: {
        id: true, rating: true, comment: true,
        author: { select: { name: true, profile: { select: { avatarUrl: true } } } },
        target: { select: { name: true } },
      },
      orderBy: { rating: "desc" },
      take: 6,
    }),
  ]);

  const categoryIcons: Record<string, { color: string; bg: string; photo: string }> = {
    "home-repair": { color: "text-orange-700", bg: "bg-orange-50",   photo: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=260&fit=crop&q=80" },
    "cleaning":    { color: "text-sky-700",    bg: "bg-sky-50",      photo: "https://images.unsplash.com/photo-1527515545081-5db817172677?w=400&h=260&fit=crop&q=80" },
    "it-help":     { color: "text-violet-700", bg: "bg-violet-50",   photo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=260&fit=crop&q=80" },
    "tutoring":    { color: "text-green-700",  bg: "bg-green-50",    photo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=260&fit=crop&q=80" },
    "babysitting": { color: "text-pink-700",   bg: "bg-pink-50",     photo: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=260&fit=crop&q=80" },
    "moving":      { color: "text-amber-700",  bg: "bg-amber-50",    photo: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400&h=260&fit=crop&q=80" },
    "gardening":   { color: "text-emerald-700",bg: "bg-emerald-50",  photo: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=260&fit=crop&q=80" },
    "cooking":     { color: "text-red-700",    bg: "bg-red-50",      photo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=260&fit=crop&q=80" },
    "beauty":      { color: "text-fuchsia-700",bg: "bg-fuchsia-50",  photo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=260&fit=crop&q=80" },
    "other":       { color: "text-brand-700",  bg: "bg-brand-50",    photo: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=260&fit=crop&q=80" },
  };

  const categoryLabels: Record<string, Record<string, string>> = {
    de: {
      "home-repair": "Hausreparatur", "cleaning": "Reinigung", "it-help": "IT-Hilfe",
      "tutoring": "Nachhilfe", "babysitting": "Kinderbetreuung", "moving": "Umzug",
      "gardening": "Garten", "cooking": "Kochen", "beauty": "Schönheit", "other": "Sonstiges",
    },
    en: {
      "home-repair": "Home Repair", "cleaning": "Cleaning", "it-help": "IT Help",
      "tutoring": "Tutoring", "babysitting": "Babysitting", "moving": "Moving",
      "gardening": "Gardening", "cooking": "Cooking", "beauty": "Beauty", "other": "Other",
    },
  };

  return (
    <>
      <Navbar transparent />
      <main className="min-h-screen bg-white">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden text-white min-h-[820px]">
          {/* Arka plan fotoğrafı */}
          <Image
            src="/hero2.png"
            alt="KiezHelfer Hero"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Koyu gradient overlay — okunabilirlik için */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-900/45 to-slate-950/60" />
          {/* Navbar arkası için ekstra koyu şerit */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-48 text-center">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-400/25 rounded-full px-4 py-1.5 text-xs text-brand-300 mb-8 font-medium tracking-wide uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
              Berlin · {userCount}+ {params.locale === "de" ? "registrierte Nutzer" : "registered users"}
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
                  className="flex-1 px-5 py-4 bg-transparent text-white text-sm placeholder:text-white/60 focus:outline-none"
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
              {categories.slice(0, 7).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/listings?category=${cat.slug}` as any}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all"
                >
                  {categoryLabels[params.locale]?.[cat.slug] ?? cat.slug}
                </Link>
              ))}
            </div>
          </div>


        </section>

        {/* ── İSTATİSTİK BANDI ─────────────────────────────────────── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
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
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">{t("whyTitle")}</p>
              <h2 className="text-3xl font-bold text-gray-900">
                {params.locale === "de" ? "Vertrauen steht an erster Stelle" : "Trust comes first"}
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
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-1">{params.locale === "de" ? "Kategorien" : "Categories"}</p>
                <h2 className="text-3xl font-bold text-gray-900">{t("categoriesTitle")}</h2>
              </div>
              <Link href="/listings" className="hidden sm:flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium">
                {t("viewAll")} <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categories.map((cat) => {
                const icon = categoryIcons[cat.slug];
                return (
                  <Link
                    key={cat.id}
                    href={`/listings?category=${cat.slug}` as any}
                    className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="relative h-28 overflow-hidden">
                      <Image
                        src={icon?.photo ?? "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=260&fit=crop&q=80"}
                        alt={categoryLabels[params.locale]?.[cat.slug] ?? cat.slug}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                      />
                    </div>
                    <div className={`px-3 py-2.5 ${icon?.bg ?? "bg-gray-50"} text-center`}>
                      <span className={`text-xs font-semibold ${icon?.color ?? "text-gray-700"}`}>
                        {categoryLabels[params.locale]?.[cat.slug] ?? cat.slug}
                      </span>
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
                  {params.locale === "de" ? "Neueste Angebote" : "Latest Listings"}
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
        <section className="py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">
                {params.locale === "de" ? "So einfach geht's" : "Simple as that"}
              </p>
              <h2 className="text-3xl font-bold text-gray-900">{t("howItWorks")}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-8 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px bg-gradient-to-r from-brand-200 via-brand-300 to-brand-200" />
              {[
                { icon: <UserCheck className="h-7 w-7 text-brand-600" />, step: "01", title: t("step1Title"), desc: t("step1Desc") },
                { icon: <Clock    className="h-7 w-7 text-brand-600" />, step: "02", title: t("step2Title"), desc: t("step2Desc") },
                { icon: <MessageCircle className="h-7 w-7 text-brand-600" />, step: "03", title: t("step3Title"), desc: t("step3Desc") },
              ].map((item) => (
                <div key={item.step} className="relative flex flex-col items-center text-center">
                  <div className="relative h-16 w-16 rounded-2xl bg-brand-50 border-2 border-brand-100 flex items-center justify-center mb-5 z-10">
                    {item.icon}
                    <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 max-w-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── YORUMLAR ─────────────────────────────────────────────── */}
        {topReviews.length >= 3 && (
          <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">
                  {params.locale === "de" ? "Was unsere Nutzer sagen" : "What our users say"}
                </p>
                <h2 className="text-3xl font-bold text-gray-900">
                  {params.locale === "de" ? "Echte Bewertungen" : "Real Reviews"}
                </h2>
                <div className="flex items-center justify-center gap-1 mt-3">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-500 font-medium">5.0 · {topReviews.length}+ {params.locale === "de" ? "Bewertungen" : "reviews"}</span>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {topReviews.slice(0, 6).map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                    <div className="flex items-start gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed flex-1 italic">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                      <Avatar src={review.author.profile?.avatarUrl} name={review.author.name} size="sm" />
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{review.author.name}</p>
                        <p className="text-xs text-gray-400">
                          {params.locale === "de" ? "Bewertung für" : "Review for"} {review.target.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA BANNER ───────────────────────────────────────────── */}
        <section className="py-24 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            {/* Başlık */}
            <div className="text-center mb-14">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
                {params.locale === "de" ? "Jetzt starten" : "Get Started"}
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {params.locale === "de"
                  ? "Wie möchtest du mitmachen?"
                  : "How would you like to join?"}
              </h2>
              <p className="text-gray-500 mt-3 text-sm max-w-md mx-auto">
                {params.locale === "de"
                  ? "KiezHelfer verbindet Berliner – egal ob du Hilfe brauchst oder Hilfe anbietest."
                  : "KiezHelfer connects Berliners – whether you need help or offer it."}
              </p>
            </div>

            {/* İki kart */}
            <div className="grid md:grid-cols-2 gap-5">

              {/* Kart 1 — Hilfe suchen */}
              <div className="group relative overflow-hidden rounded-2xl bg-white border border-brand-100 hover:border-brand-300 hover:shadow-lg transition-all duration-300 p-8">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-50 -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                    <UserCheck className="h-7 w-7 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {params.locale === "de" ? "Hilfe suchen" : "Find Help"}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    {params.locale === "de"
                      ? "Finde qualifizierte Nachbarn für Hausreparaturen, Nachhilfe, Umzug und mehr – direkt in deinem Kiez."
                      : "Find qualified neighbors for home repairs, tutoring, moving and more – right in your neighborhood."}
                  </p>
                  <Link
                    href="/listings"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    {params.locale === "de" ? "Angebote durchsuchen" : "Browse Listings"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Kart 2 — Angebot erstellen */}
              <div className="group relative overflow-hidden rounded-2xl bg-brand-500 border border-brand-500 hover:shadow-xl hover:bg-brand-600 transition-all duration-300 p-8">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-black/10 translate-y-1/2 -translate-x-1/2" />
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mb-6">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {params.locale === "de" ? "Hilfe anbieten" : "Offer Help"}
                  </h3>
                  <p className="text-brand-100 text-sm leading-relaxed mb-8">
                    {params.locale === "de"
                      ? "Erstelle kostenlos dein Angebot, teile deine Fähigkeiten mit deinen Nachbarn und verdiene Geld."
                      : "Create your free listing, share your skills with neighbors and earn money."}
                  </p>
                  <Link
                    href="/listings/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-700 text-sm font-bold rounded-xl hover:bg-brand-50 transition-colors shadow-sm"
                  >
                    {params.locale === "de" ? "Angebot erstellen" : "Create Listing"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Alt — Ücretsiz & güvenli */}
            <p className="text-center text-xs text-brand-700/60 mt-8 flex items-center justify-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              {params.locale === "de"
                ? "Kostenlos registrieren · Keine Gebühren · Verifizierte Nutzer"
                : "Free to register · No fees · Verified users"}
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
