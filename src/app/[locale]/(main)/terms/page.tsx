import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function TermsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("legal");
  const isDE = params.locale === "de";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("termsTitle")}</h1>
      <p className="text-sm text-gray-400 mb-8">{t("lastUpdated")}</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">
        {isDE ? (
          <>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Geltungsbereich</h2>
              <p>Diese Nutzungsbedingungen gelten für die Nutzung der KiezHelfer-Plattform. Mit der Registrierung stimmst du diesen Bedingungen zu.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Leistungsbeschreibung</h2>
              <p>KiezHelfer ist eine Plattform, auf der Berliner Bürger ihre Fähigkeiten und Dienstleistungen anbieten und suchen können. Wir sind kein Vertragspartner der vermittelten Leistungen – alle Vereinbarungen werden direkt zwischen den Nutzern getroffen.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Nutzerpflichten</h2>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Du darfst nur wahrheitsgemäße Angaben machen</li>
                <li>Du darfst keine illegalen Angebote einstellen</li>
                <li>Du darfst andere Nutzer nicht belästigen oder täuschen</li>
                <li>Du bist für den Inhalt deiner Angebote selbst verantwortlich</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Haftungsausschluss</h2>
              <p>KiezHelfer haftet nicht für die Qualität der angebotenen Dienstleistungen, für Schäden die durch Transaktionen zwischen Nutzern entstehen, oder für die Richtigkeit der Nutzerangaben.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Kontosperrung</h2>
              <p>Wir behalten uns das Recht vor, Konten zu sperren oder zu löschen, die gegen diese Nutzungsbedingungen verstoßen.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Änderungen</h2>
              <p>Wir können diese Nutzungsbedingungen jederzeit ändern. Änderungen werden dir per E-Mail mitgeteilt.</p>
            </section>
          </>
        ) : (
          <>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Scope</h2>
              <p>These Terms of Service apply to the use of the KiezHelfer platform. By registering, you agree to these terms.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Service Description</h2>
              <p>KiezHelfer is a platform where Berlin residents can offer and find skills and services. We are not a party to the services arranged – all agreements are made directly between users.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">3. User Obligations</h2>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>You may only provide truthful information</li>
                <li>You may not post illegal offers</li>
                <li>You may not harass or deceive other users</li>
                <li>You are responsible for the content of your listings</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Disclaimer</h2>
              <p>KiezHelfer is not liable for the quality of services offered, for damages arising from transactions between users, or for the accuracy of user-provided information.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Account Suspension</h2>
              <p>We reserve the right to suspend or delete accounts that violate these Terms of Service.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Changes</h2>
              <p>We may update these Terms of Service at any time. Changes will be communicated to you via email.</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
