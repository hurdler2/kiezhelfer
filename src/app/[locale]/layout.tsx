import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import ScrollRestorer from "@/components/layout/ScrollRestorer";

const BASE_URL = "https://kiezhelfer.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isDE = params.locale === "de";

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: isDE
        ? "KiezHelfer – Nachbarschaftshilfe in Berlin"
        : "KiezHelfer – Neighborhood Help in Berlin",
      template: "%s | KiezHelfer",
    },
    description: isDE
      ? "Finde Handwerker, Alltags- & Nachbarschaftshilfe und mehr in deinem Kiez – zu fairen Preisen. Hilf deinen Nachbarn und verdiene Geld mit deinen Fähigkeiten."
      : "Find craftsmen, everyday help and more in your Berlin neighborhood – at fair prices. Help your neighbors and earn money with your skills.",
    keywords: isDE
      ? ["Berlin", "Nachbarschaftshilfe", "Handwerker", "Kiez", "Nachbarschaft", "Dienstleistungen Berlin", "Reparaturen Berlin", "Nachhilfe Berlin"]
      : ["Berlin", "neighborhood help", "handyman Berlin", "local services Berlin", "community help"],
    openGraph: {
      type: "website",
      locale: isDE ? "de_DE" : "en_US",
      alternateLocale: isDE ? ["en_US"] : ["de_DE"],
      url: `${BASE_URL}/${params.locale}`,
      siteName: "KiezHelfer",
      title: isDE
        ? "KiezHelfer – Nachbarschaftshilfe in Berlin"
        : "KiezHelfer – Neighborhood Help in Berlin",
      description: isDE
        ? "Finde Handwerker und Nachbarschaftshilfe in deinem Berliner Kiez – lokal, einfach, fair."
        : "Find craftsmen and local help in your Berlin neighborhood – local, simple, fair.",
    },
    twitter: {
      card: "summary_large_image",
      title: "KiezHelfer – Nachbarschaftshilfe in Berlin",
      description: "Finde Handwerker und Nachbarschaftshilfe in deinem Berliner Kiez.",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `${BASE_URL}/${params.locale}`,
      languages: {
        de: `${BASE_URL}/de`,
        en: `${BASE_URL}/en`,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!routing.locales.includes(locale as "de" | "en")) {
    notFound();
  }

  setRequestLocale(locale);

  const [messages, session] = await Promise.all([
    getMessages({ locale }),
    auth(),
  ]);

  // Admin kullanıcıları user sitesine erişemez
  if ((session?.user as any)?.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider messages={messages}>
        <ScrollRestorer />
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
