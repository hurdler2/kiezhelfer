import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "KiezHelfer – Nachbarschaftshilfe in Berlin",
  description:
    "Finde Handwerker, Nachhilfelehrer und mehr in deinem Kiez – zu fairen Preisen. Hilf deinen Nachbarn und verdiene Geld mit deinen Fähigkeiten.",
  keywords: "Berlin, Nachbarschaftshilfe, Handwerker, Nachhilfe, Kiez, Hilfe",
};

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

  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider messages={messages}>
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
