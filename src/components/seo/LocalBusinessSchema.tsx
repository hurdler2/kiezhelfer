export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "KiezHelfer",
    description:
      "Nachbarschaftshilfe-Plattform in Berlin – Finde Handwerker, Nachhilfe und Alltagshilfe in deinem Kiez.",
    url: "https://kiezhelfer.vercel.app",
    logo: "https://kiezhelfer.vercel.app/logolast2.png",
    image: "https://kiezhelfer.vercel.app/logolast2.png",
    telephone: "",
    email: "kontakt@kiezhelfer.de",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Berlin",
      addressCountry: "DE",
    },
    areaServed: {
      "@type": "City",
      name: "Berlin",
      sameAs: "https://www.wikidata.org/wiki/Q64",
    },
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 52.52,
        longitude: 13.405,
      },
      geoRadius: "30000",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dienstleistungen in Berlin",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Kleine Reparaturen & Montageservice" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Technik- & Computerhilfe" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Alltags- & Nachbarschaftshilfe" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Garten- & Outdoor-Hilfe" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Transport & Kurierhilfe" } },
      ],
    },
    sameAs: [
      "https://www.linkedin.com/in/ahmetmustafayilmaz",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
