"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import type { Category } from "@prisma/client";
import { BERLIN_DISTRICTS } from "@/types";
import { Search, X } from "lucide-react";

interface Props {
  categories: Category[];
  locale: string;
  currentCategory?: string;
  currentDistrict?: string;
  currentQ?: string;
}

export default function ListingsFilter({ categories, locale: _locale, currentCategory, currentDistrict, currentQ }: Props) {
  const t = useTranslations("listings");
  const tc = useTranslations("categories");
  const router = useRouter();
  const pathname = usePathname();

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

  const hasFilters = currentCategory || currentDistrict || currentQ;

  return (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("filterSearch")}</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            defaultValue={currentQ}
            placeholder={t("filterSearch")}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilter("q", (e.target as HTMLInputElement).value || null);
              }
            }}
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("filterCategory")}</label>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter("category", null)}
            className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
              !currentCategory ? "bg-brand-50 text-brand-700 font-medium" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t("allCategories")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", cat.slug === currentCategory ? null : cat.slug)}
              className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
                currentCategory === cat.slug
                  ? "bg-brand-50 text-brand-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tc(cat.nameKey.replace("categories.", "") as Parameters<typeof tc>[0])}
            </button>
          ))}
        </div>
      </div>

      {/* District */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("filterDistrict")}</label>
        <select
          value={currentDistrict ?? ""}
          onChange={(e) => updateFilter("district", e.target.value || null)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-brand-500 focus:outline-none bg-white"
        >
          <option value="">{t("allDistricts")}</option>
          {BERLIN_DISTRICTS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={() => router.push(pathname)}
          className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700"
        >
          <X className="h-4 w-4" />
          {t("clearFilters")}
        </button>
      )}
    </div>
  );
}
