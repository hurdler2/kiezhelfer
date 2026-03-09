import type { Metadata } from "next";

const BASE_URL = "https://kiezhelfer.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isDE = params.locale === "de";
  return {
    title: isDE ? "Kontakt – KiezHelfer" : "Contact – KiezHelfer",
    description: isDE
      ? "Nimm Kontakt mit dem KiezHelfer-Team auf. Wir sind für dich da und helfen dir gerne weiter."
      : "Get in touch with the KiezHelfer team. We are here for you and happy to help.",
    alternates: {
      canonical: `${BASE_URL}/${params.locale}/contact`,
      languages: { de: `${BASE_URL}/de/contact`, en: `${BASE_URL}/en/contact` },
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
