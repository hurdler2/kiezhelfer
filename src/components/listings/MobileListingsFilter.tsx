"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Category } from "@prisma/client";
import { BERLIN_DISTRICTS } from "@/types";
import { SlidersHorizontal, X, Search, MapPin } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  "reparaturen-montage": "🔧",
  "technik-computer": "💻",
  "alltag-nachbarschaft": "🤝",
  "garten-outdoor": "🌿",
  "transport-kurier": "🚗",
};

interface Props {
  categories: Category[];
  currentCategory?: string;
  currentDistrict?: string;
  currentQ?: string;
}

export default function MobileListingsFilter({
  categories,
  currentCategory,
  currentDistrict,
  currentQ,
}: Props) {
  const t = useTranslations("listings");
  const tc = useTranslations("categories");
  const router = useRouter();
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [localQ, setLocalQ] = useState(currentQ ?? "");

  const navigate = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(window.location.search);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ q: localQ || null });
  };

  const hasFilters = !!(currentCategory || currentDistrict || currentQ);

  const getCatLabel = (slug: string) => {
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) return slug;
    return tc(cat.nameKey.replace("categories.", "") as Parameters<typeof tc>[0]);
  };

  return (
    <div className="space-y-2.5">
      {/* ① Arama çubuğu — her zaman görünür */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="search"
          value={localQ}
          onChange={(e) => setLocalQ(e.target.value)}
          placeholder={t("filterSearch")}
          className="w-full pl-9 pr-10 py-2.5 text-base border border-gray-200 rounded-xl bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        {localQ && (
          <button
            type="button"
            onClick={() => {
              setLocalQ("");
              navigate({ q: null });
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* ② Kategori pill'leri + ilçe filtresi butonu */}
      <div className="flex items-center gap-2">
        {/* Kaydırılabilir pill'ler — sağda gradient kaydırma ipucu verir */}
        <div className="relative flex-1 min-w-0">
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pr-6">
            <button
              onClick={() => navigate({ category: null })}
              className={`flex-shrink-0 px-3.5 py-1.5 text-sm rounded-full border font-medium transition-colors ${
                !currentCategory
                  ? "bg-brand-500 text-white border-brand-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-400 hover:text-brand-600"
              }`}
            >
              {t("allCategories")}
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  navigate({
                    category: cat.slug === currentCategory ? null : cat.slug,
                  })
                }
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 text-sm rounded-full border font-medium transition-colors ${
                  currentCategory === cat.slug
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-brand-400 hover:text-brand-600"
                }`}
              >
                <span>{CATEGORY_ICONS[cat.slug] ?? "📌"}</span>
                <span>{tc(cat.nameKey.replace("categories.", "") as Parameters<typeof tc>[0])}</span>
              </button>
            ))}
          </div>
        </div>

        {/* İlçe filtresi butonu */}
        <button
          onClick={() => setSheetOpen(true)}
          aria-label={t("filterDistrict")}
          className={`relative flex-shrink-0 p-2 rounded-full border transition-colors ${
            currentDistrict
              ? "bg-brand-50 border-brand-400 text-brand-700"
              : "bg-white border-gray-200 text-gray-500 hover:border-brand-400 hover:text-brand-600"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {currentDistrict && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full border-2 border-white" />
          )}
        </button>
      </div>

      {/* ③ Aktif filtre chip'leri */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-1.5">
          {currentCategory && (
            <span className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-brand-50 text-brand-700 text-xs font-medium rounded-full border border-brand-200">
              <span>{CATEGORY_ICONS[currentCategory] ?? "📌"}</span>
              <span>{getCatLabel(currentCategory)}</span>
              <button
                onClick={() => navigate({ category: null })}
                className="ml-0.5 p-0.5 rounded-full hover:bg-brand-200 transition-colors"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
          {currentDistrict && (
            <span className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
              <MapPin className="h-3 w-3" />
              <span>
                {currentDistrict
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
              <button
                onClick={() => navigate({ district: null })}
                className="ml-0.5 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
          {currentQ && (
            <span className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
              <Search className="h-3 w-3" />
              <span>&ldquo;{currentQ}&rdquo;</span>
              <button
                onClick={() => {
                  setLocalQ("");
                  navigate({ q: null });
                }}
                className="ml-0.5 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setLocalQ("");
              router.push(pathname);
            }}
            className="text-xs text-red-500 hover:text-red-700 underline-offset-2 hover:underline"
          >
            {t("clearFilters")}
          </button>
        </div>
      )}

      {/* ④ İlçe bottom sheet */}
      {sheetOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSheetOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 px-5 pt-4 pb-[env(safe-area-inset-bottom,24px)] shadow-2xl">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                {t("filterDistrict")}
              </h3>
              <button
                onClick={() => setSheetOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1 max-h-72 overflow-y-auto">
              <button
                onClick={() => {
                  navigate({ district: null });
                  setSheetOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  !currentDistrict
                    ? "bg-brand-500 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t("allDistricts")}
              </button>
              {BERLIN_DISTRICTS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => {
                    navigate({
                      district: d.value === currentDistrict ? null : d.value,
                    });
                    setSheetOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    currentDistrict === d.value
                      ? "bg-brand-500 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {d.value
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
