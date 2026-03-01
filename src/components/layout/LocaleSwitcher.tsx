"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Globe } from "lucide-react";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const fullPathname = usePathname(); // e.g. "/en/listings" or "/de"

  function switchLocale(nextLocale: string) {
    // Strip the current locale prefix to get the bare path
    const pathWithoutLocale = fullPathname.replace(new RegExp(`^/${locale}`), "") || "/";
    window.location.href = `/${nextLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
  }

  return (
    <div className="flex items-center gap-1">
      <Globe className="h-4 w-4 text-gray-500" />
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`text-sm px-1.5 py-0.5 rounded transition-colors ${
            locale === l
              ? "font-semibold text-brand-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
