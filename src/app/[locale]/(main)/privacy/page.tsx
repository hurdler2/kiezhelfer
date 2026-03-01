import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function PrivacyPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("legal");
  const isDE = params.locale === "de";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("privacyTitle")}</h1>
      <p className="text-sm text-gray-400 mb-8">{t("lastUpdated")}</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">
        {isDE ? (
          <>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Verantwortlicher</h2>
              <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist KiezHelfer, Berlin, Deutschland. Bei Fragen zum Datenschutz kannst du uns unter kontakt@kiezhelfer.de erreichen.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Erhobene Daten</h2>
              <p>Wir erheben folgende personenbezogene Daten, wenn du dich registrierst oder die Plattform nutzt:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Name und E-Mail-Adresse</li>
                <li>Standortinformationen (Bezirk in Berlin)</li>
                <li>Inhalte deiner Angebote und Nachrichten</li>
                <li>Profilinformationen (Foto, Beschreibung, Fähigkeiten)</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Zweck der Datenverarbeitung</h2>
              <p>Deine Daten werden ausschließlich zur Bereitstellung der KiezHelfer-Plattform verwendet – zur Verwaltung deines Kontos, zur Darstellung von Angeboten und zur Ermöglichung der Kommunikation zwischen Nutzern.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Datenspeicherung</h2>
              <p>Deine Daten werden auf Servern in der Europäischen Union gespeichert. Wir behalten deine Daten so lange, wie dein Konto aktiv ist. Du kannst jederzeit die Löschung deines Kontos beantragen.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Deine Rechte</h2>
              <p>Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung deiner personenbezogenen Daten. Bitte wende dich dazu an kontakt@kiezhelfer.de.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Cookies</h2>
              <p>Wir verwenden ausschließlich technisch notwendige Cookies für die Authentifizierung. Es werden keine Tracking- oder Werbe-Cookies eingesetzt.</p>
            </section>
          </>
        ) : (
          <>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Data Controller</h2>
              <p>The controller responsible for data processing on this website is KiezHelfer, Berlin, Germany. For privacy-related questions, you can reach us at contact@kiezhelfer.de.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Data Collected</h2>
              <p>We collect the following personal data when you register or use the platform:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Name and email address</li>
                <li>Location information (district in Berlin)</li>
                <li>Contents of your listings and messages</li>
                <li>Profile information (photo, description, skills)</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Purpose of Data Processing</h2>
              <p>Your data is used exclusively to provide the KiezHelfer platform – to manage your account, display listings, and enable communication between users.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Data Storage</h2>
              <p>Your data is stored on servers within the European Union. We retain your data for as long as your account is active. You can request deletion of your account at any time.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Your Rights</h2>
              <p>You have the right to access, rectify, delete, and restrict the processing of your personal data. Please contact us at contact@kiezhelfer.de.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Cookies</h2>
              <p>We only use technically necessary cookies for authentication. No tracking or advertising cookies are used.</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
