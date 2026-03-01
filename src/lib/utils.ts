import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { de, enUS } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date | string, locale: string = "de") {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: locale === "de" ? de : enUS,
  });
}

export function formatPrice(priceType: string, priceAmount: number | null, locale: string = "de") {
  if (priceType === "free") return locale === "de" ? "Kostenlos" : "Free";
  if (priceType === "negotiable") return locale === "de" ? "Preis nach Absprache" : "Negotiable";
  if (!priceAmount) return locale === "de" ? "Preis nach Absprache" : "Negotiable";

  const formatted = new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(priceAmount);

  if (priceType === "hourly") return `${formatted}${locale === "de" ? "/Std." : "/hr"}`;
  return formatted;
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
