import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum – KiezHelfer",
};

export default async function ImpressumPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">Impressum</h1>

      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Angaben gemäß § 5 TMG</h2>
          <p>
            Gamze Yilmaz<br />
            c/o POSTFLEX PFX-552-936<br />
            Emsdettener Straße 10<br />
            48268 Greven<br />
            Deutschland
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Kontakt</h2>
          <p>
            Tel.: 01788644671<br />
            E-Mail: <a href="mailto:info@kiezhelfer.com" className="text-brand-600 hover:underline">info@kiezhelfer.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Streitschlichtung</h2>
          <p>
            Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder verpflichtet noch bereit.
          </p>
        </section>

      </div>
    </div>
  );
}
