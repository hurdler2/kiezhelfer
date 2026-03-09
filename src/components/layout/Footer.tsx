import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("footer");
  const tCat = useTranslations("categories");

  const serviceLinks = [
    { slug: "reparaturen-montage",  key: "reparaturenMontage" },
    { slug: "technik-computer",     key: "technikComputer" },
    { slug: "alltag-nachbarschaft", key: "alltagNachbarschaft" },
    { slug: "garten-outdoor",       key: "gartenOutdoor" },
    { slug: "transport-kurier",     key: "transportKurier" },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">

      {/* ── Ana içerik ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Sütun 1 — Logo + açıklama + platform linkleri */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logoo.png"
                alt="KiezHelfer"
                width={140}
                height={140}
                className="rounded-xl object-contain"
              />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              {t("tagline")}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>Berlin, Deutschland</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/wie-es-funktioniert" className="hover:text-brand-500 transition-colors">
                  {t("howItWorks")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-500 transition-colors">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-500 transition-colors">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Sütun 2 — Hizmetler */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-5">{t("services")}</h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/listings?category=${s.slug}` as any}
                    className="text-sm text-gray-600 hover:text-brand-500 transition-colors"
                  >
                    {tCat(s.key as any)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sütun 3 — Beliebt in Berlin */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-5">{t("popular")}</h3>
            <ul className="space-y-2.5">
              {[
                { label: t("pop1"), href: "/listings?category=reparaturen-montage" },
                { label: t("pop2"), href: "/listings?category=technik-computer" },
                { label: t("pop3"), href: "/listings?category=alltag-nachbarschaft" },
                { label: t("pop4"), href: "/listings?category=garten-outdoor" },
                { label: t("pop5"), href: "/listings?category=transport-kurier" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href as any}
                    className="text-sm text-gray-600 hover:text-brand-500 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sütun 4 — CTA */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-5">{t("join")}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              {t("joinDesc")}
            </p>
            <Link
              href="/listings/new"
              className="inline-flex items-center gap-2 px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              {t("ctaButton")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Alt bar ───────────────────────────────────────────────── */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} KiezHelfer. {t("rights")}.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">{t("privacy")}</Link>
            <Link href="/terms" className="hover:text-gray-600 transition-colors">{t("terms")}</Link>
            <Link href="/contact" className="hover:text-gray-600 transition-colors">{t("contact")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
