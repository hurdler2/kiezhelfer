import { setRequestLocale } from "next-intl/server";

export default async function PrivacyPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Datenschutzerklärung</h1>
      <p className="text-sm text-gray-400 mb-10">Stand: 07.04.2026</p>

      <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1) Einleitung und Kontaktdaten des Verantwortlichen</h2>
          <p className="mb-2">1.1 Wir freuen uns, dass Sie unsere Website besuchen, und bedanken uns für Ihr Interesse. Im Folgenden informieren wir Sie über den Umgang mit Ihren personenbezogenen Daten bei der Nutzung unserer Website. Personenbezogene Daten sind hierbei alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
          <p>1.2 Verantwortlicher für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist Gamze Yilmaz, c/o POSTFLEX PFX-552-936 Emsdettener Straße 10, 48268 Greven, Deutschland, Tel.: 01788644671, E-Mail: info@kiezhelfer.com.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2) Datenerfassung beim Besuch unserer Website</h2>
          <p className="mb-2">2.1 Bei der bloß informatorischen Nutzung unserer Website erheben wir nur solche Daten, die Ihr Browser an den Seitenserver übermittelt (sog. &bdquo;Server-Logfiles&ldquo;). Wenn Sie unsere Website aufrufen, erheben wir die folgenden Daten:</p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Unsere besuchte Website</li>
            <li>Datum und Uhrzeit zum Zeitpunkt des Zugriffes</li>
            <li>Menge der gesendeten Daten in Byte</li>
            <li>Quelle/Verweis, von welchem Sie auf die Seite gelangten</li>
            <li>Verwendeter Browser</li>
            <li>Verwendetes Betriebssystem</li>
            <li>Verwendete IP-Adresse (ggf. in anonymisierter Form)</li>
          </ul>
          <p className="mb-2">Die Verarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. f DSGVO auf Basis unseres berechtigten Interesses an der Verbesserung der Stabilität und Funktionalität unserer Website.</p>
          <p>2.2 Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung personenbezogener Daten eine SSL- bzw. TLS-Verschlüsselung.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3) Hosting & Content-Delivery-Network</h2>
          <p className="mb-2"><strong>Vercel</strong></p>
          <p className="mb-2">Für das Hosting unserer Website nutzen wir das System des folgenden Anbieters: Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>
          <p className="mb-2">Wir haben mit dem Anbieter einen Auftragsverarbeitungsvertrag geschlossen, der den Schutz der Daten unserer Seitenbesucher sicherstellt und eine unberechtigte Weitergabe an Dritte untersagt.</p>
          <p>Für Datenübermittlungen in die USA hat sich der Anbieter dem EU-US-Datenschutzrahmen (EU-US Data Privacy Framework) angeschlossen.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4) Kontaktaufnahme</h2>
          <p className="mb-2">Im Rahmen der Kontaktaufnahme mit uns (z.B. per Kontaktformular oder E-Mail) werden personenbezogene Daten erhoben. Diese Daten werden ausschließlich zum Zweck der Beantwortung Ihres Anliegens gespeichert und verwendet.</p>
          <p>Rechtsgrundlage für die Verarbeitung dieser Daten ist unser berechtigtes Interesse an der Beantwortung Ihres Anliegens gemäß Art. 6 Abs. 1 lit. f DSGVO.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5) Registrierung auf der Website</h2>
          <p className="mb-2">Sie können sich auf unserer Website unter Angabe von personenbezogenen Daten registrieren. Wir verwenden für die Registrierung das sog. Double-opt-in-Verfahren, d.h. Ihre Registrierung ist erst abgeschlossen, wenn Sie Ihre Anmeldung über eine Bestätigungs-E-Mail durch Klick auf den darin enthaltenen Link bestätigt haben.</p>
          <p>Wenn Sie unser Portal nutzen, speichern wir Ihre zur Vertragserfüllung erforderlichen Daten, bis Sie Ihren Zugang endgültig löschen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6) Seitenfunktionalitäten – Google Maps</h2>
          <p className="mb-2">Diese Webseite nutzt einen Online-Kartendienst des folgenden Anbieters: Google Maps (API) von Google Ireland Limited, Gordon House, 4 Barrow St, Dublin, D04 E5W5, Irland.</p>
          <p className="mb-2">Bereits beim Aufrufen derjenigen Unterseiten, in die die Karte von Google Maps eingebunden ist, werden Informationen über Ihre Nutzung unserer Website (wie z.B. Ihre IP-Adresse) an Server von Google übertragen und dort gespeichert.</p>
          <p>Weitere Hinweise zum Datenschutz von Google finden sich hier: <a href="https://business.safety.google/intl/de/privacy/" className="text-brand-600 hover:underline" target="_blank" rel="noopener noreferrer">https://business.safety.google/intl/de/privacy/</a></p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">7) Rechte des Betroffenen</h2>
          <p className="mb-2">7.1 Das geltende Datenschutzrecht gewährt Ihnen gegenüber dem Verantwortlichen die nachstehenden Betroffenenrechte:</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Auskunftsrecht gemäß Art. 15 DSGVO</li>
            <li>Recht auf Berichtigung gemäß Art. 16 DSGVO</li>
            <li>Recht auf Löschung gemäß Art. 17 DSGVO</li>
            <li>Recht auf Einschränkung der Verarbeitung gemäß Art. 18 DSGVO</li>
            <li>Recht auf Unterrichtung gemäß Art. 19 DSGVO</li>
            <li>Recht auf Datenübertragbarkeit gemäß Art. 20 DSGVO</li>
            <li>Recht auf Widerruf erteilter Einwilligungen gemäß Art. 7 Abs. 3 DSGVO</li>
            <li>Recht auf Beschwerde gemäß Art. 77 DSGVO</li>
          </ul>
          <p className="font-semibold text-gray-800 mb-2">7.2 WIDERSPRUCHSRECHT</p>
          <p className="uppercase text-xs leading-relaxed">
            WENN WIR IM RAHMEN EINER INTERESSENABWÄGUNG IHRE PERSONENBEZOGENEN DATEN AUFGRUND UNSERES ÜBERWIEGENDEN BERECHTIGTEN INTERESSES VERARBEITEN, HABEN SIE DAS JEDERZEITIGE RECHT, AUS GRÜNDEN, DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIESE VERARBEITUNG WIDERSPRUCH MIT WIRKUNG FÜR DIE ZUKUNFT EINZULEGEN.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">8) Dauer der Speicherung personenbezogener Daten</h2>
          <p className="mb-2">Die Dauer der Speicherung von personenbezogenen Daten bemisst sich anhand der jeweiligen Rechtsgrundlage, am Verarbeitungszweck und – sofern einschlägig – zusätzlich anhand der jeweiligen gesetzlichen Aufbewahrungsfrist.</p>
          <p>Sofern sich aus den sonstigen Informationen dieser Erklärung nichts anderes ergibt, werden gespeicherte personenbezogene Daten dann gelöscht, wenn sie für die Zwecke, für die sie erhoben wurden, nicht mehr notwendig sind.</p>
        </section>

        <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
          Copyright-Hinweis: Diese Datenschutzerklärung wurde von den Fachanwälten der IT-Recht Kanzlei erstellt und ist urheberrechtlich geschützt.
        </p>

      </div>
    </div>
  );
}
