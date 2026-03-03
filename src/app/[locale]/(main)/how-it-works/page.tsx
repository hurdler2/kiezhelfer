import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { UserCheck, ClipboardList, Handshake, Star, Search, CheckSquare, Wrench, Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface Props {
  params: { locale: string };
}

const helferIcons = [UserCheck, ClipboardList, Handshake, Star];
const helferColors = [
  "bg-brand-50 text-brand-600",
  "bg-blue-50 text-blue-600",
  "bg-emerald-50 text-emerald-600",
  "bg-amber-50 text-amber-500",
];
const sucherIcons = [Search, CheckSquare, Wrench, Heart];
const sucherColors = [
  "bg-brand-50 text-brand-600",
  "bg-blue-50 text-blue-600",
  "bg-emerald-50 text-emerald-600",
  "bg-rose-50 text-rose-500",
];

export default async function HowItWorksPage({ params }: Props) {
  setRequestLocale(params.locale);

  // German users → redirect to /de/wie-es-funktioniert
  if (params.locale === "de") {
    redirect("/de/wie-es-funktioniert");
  }

  const t = await getTranslations("howItWorks");

  const helferSteps = [
    { title: t("h1Title"), desc: t("h1Desc") },
    { title: t("h2Title"), desc: t("h2Desc") },
    { title: t("h3Title"), desc: t("h3Desc") },
    { title: t("h4Title"), desc: t("h4Desc") },
  ];

  const sucherSteps = [
    { title: t("s1Title"), desc: t("s1Desc") },
    { title: t("s2Title"), desc: t("s2Desc") },
    { title: t("s3Title"), desc: t("s3Desc") },
    { title: t("s4Title"), desc: t("s4Desc") },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
            {t("badge")}
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
          <p className="text-gray-500 text-base leading-relaxed">{t("subtitle")}</p>
        </div>
      </section>

      {/* Für Helfer */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <span className="inline-block bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {t("helferBadge")}
            </span>
            <h2 className="text-2xl font-bold text-gray-900">{t("helferHeadline")}</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {helferSteps.map((step, i) => {
              const Icon = helferIcons[i];
              return (
                <div
                  key={i}
                  className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-brand-100 transition-all"
                >
                  <div className="shrink-0">
                    <div className={`h-11 w-11 rounded-xl ${helferColors[i]} flex items-center justify-center`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-1">{t("step")} {i + 1}</p>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">{step.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <hr className="border-gray-100" />
      </div>

      {/* Für Hilfesuchende */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {t("sucherBadge")}
            </span>
            <h2 className="text-2xl font-bold text-gray-900">{t("sucherHeadline")}</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {sucherSteps.map((step, i) => {
              const Icon = sucherIcons[i];
              return (
                <div
                  key={i}
                  className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
                >
                  <div className="shrink-0">
                    <div className={`h-11 w-11 rounded-xl ${sucherColors[i]} flex items-center justify-center`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-1">{t("step")} {i + 1}</p>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">{step.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("ctaTitle")}</h2>
          <p className="text-gray-500 text-sm mb-7">{t("ctaText")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              {t("ctaRegister")}
            </Link>
            <Link
              href="/listings"
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-brand-300 text-gray-700 text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              {t("ctaListings")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
