"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Category } from "@prisma/client";
import { BERLIN_DISTRICTS } from "@/types";
import { SlidersHorizontal, X, Search } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const [localQ, setLocalQ] = useState(currentQ ?? "");

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(window.location.search);
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router]
  );

  const hasAdvancedFilters = currentDistrict || currentQ;
  const advancedFilterCount = [currentDistrict, currentQ].filter(Boolean).length;

  return (
    <>
      {/* Horizontal scrollable category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {/* All categories pill */}
        <button
          onClick={() => updateFilter("category", null)}
          className={`flex-shrink-0 px-3.5 py-1.5 text-sm rounded-full border font-medium transition-colors ${
            !currentCategory
              ? "bg-brand-500 text-white border-brand-500"
              : "bg-white text-gray-600 border-gray-300 hover:border-brand-400 hover:text-brand-600"
          }`}
        >
          {t("allCategories")}
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              updateFilter("category", cat.slug === currentCategory ? null : cat.slug)
            }
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 text-sm rounded-full border font-medium transition-colors ${
              currentCategory === cat.slug
                ? "bg-brand-500 text-white border-brand-500"
                : "bg-white text-gray-600 border-gray-300 hover:border-brand-400 hover:text-brand-600"
            }`}
          >
            <span>{CATEGORY_ICONS[cat.slug] ?? "📌"}</span>
            <span>{tc(cat.nameKey.replace("categories.", "") as Parameters<typeof tc>[0])}</span>
          </button>
        ))}

        {/* Advanced filters button */}
        <button
          onClick={() => setOpen(true)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 text-sm rounded-full border font-medium transition-colors ${
            hasAdvancedFilters
              ? "bg-brand-50 text-brand-700 border-brand-400"
              : "bg-white text-gray-600 border-gray-300 hover:border-brand-400 hover:text-brand-600"
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{t("mobileFilterBtn")}</span>
          {advancedFilterCount > 0 && (
            <span className="ml-0.5 bg-brand-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {advancedFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Bottom Sheet */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 px-5 pt-4 pb-8 shadow-2xl">
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900">{t("mobileFilterTitle")}</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("filterSearch")}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={localQ}
                  onChange={(e) => setLocalQ(e.target.value)}
                  placeholder={t("filterSearch")}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* District select */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("filterDistrict")}
              </label>
              <select
                value={currentDistrict ?? ""}
                onChange={(e) => updateFilter("district", e.target.value || null)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:border-brand-500 focus:outline-none bg-white"
              >
                <option value="">{t("allDistricts")}</option>
                {BERLIN_DISTRICTS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.value
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              {(currentQ || currentDistrict || currentCategory) && (
                <button
                  onClick={() => {
                    router.push(pathname);
                    setOpen(false);
                  }}
                  className="flex-1 py-3 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                >
                  {t("clearFilters")}
                </button>
              )}
              <button
                onClick={() => {
                  updateFilter("q", localQ || null);
                  setOpen(false);
                }}
                className="flex-1 py-3 text-sm font-medium bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors"
              >
                {t("mobileFilterApply")}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
