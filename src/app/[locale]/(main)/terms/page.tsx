import { setRequestLocale } from "next-intl/server";

export default async function TermsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Nutzungsbedingungen</h1>
      <p className="text-sm text-gray-400 mb-10">Stand: April 2026</p>

      <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Vertragsgegenstand &amp; Rolle von KiezHelfer</h2>
          <p>KiezHelfer stellt lediglich die <strong>technische Infrastruktur</strong> zur Kontaktaufnahme zwischen Privatpersonen in Berlin bereit. KiezHelfer ist kein Handwerksbetrieb, kein Dienstleistungsunternehmen und kein Arbeitsvermittler. Der Betreiber tritt zu keinem Zeitpunkt als Vertragspartner, Makler oder Arbeitgeber auf.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Vertragsschluss ausschließlich zwischen Nutzern</h2>
          <p>Verträge über Hilfeleistungen (mündlich oder schriftlich) entstehen ausschließlich und direkt zwischen dem Hilfesuchenden und dem Helfer. KiezHelfer bietet selbst keine Handwerks- oder Dienstleistungen an. Durch die Nutzung der Plattform entsteht <strong>kein Arbeitsverhältnis</strong> und kein Dienstvertrag zwischen dem Nutzer und dem Plattformbetreiber.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Registrierung und Nutzerkonto</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>3.1 Die Nutzung setzt eine Registrierung voraus. Der Nutzer verpflichtet sich, wahrheitsgemäße Angaben zu machen.</li>
            <li>3.2 Die Nutzung ist ausschließlich natürlichen Personen zu privaten Zwecken gestattet. Gewerbliche Angebote sind ohne ausdrückliche Genehmigung untersagt.</li>
            <li>3.3 Das Mindestalter für die Registrierung beträgt 18 Jahre (oder 16 Jahre mit Zustimmung der Erziehungsberechtigten).</li>
            <li>3.4 Die Bereitstellung der Plattform ist für Nutzer aktuell kostenlos. Der Betreiber erhebt keine Vermittlungsprovisionen.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Verhaltensregeln und Inhalte</h2>
          <p className="mb-2">4.1 Jeder Nutzer ist für die von ihm eingestellten Inhalte (Texte, Bilder, Gesuche) selbst verantwortlich.</p>
          <p className="mb-2">4.2 Untersagt sind Inhalte, die:</p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>gegen geltendes Recht verstoßen,</li>
            <li>beleidigend, diskriminierend oder gewaltverherrlichend sind,</li>
            <li>Werbung oder Spam enthalten.</li>
          </ul>
          <p>4.3 Der Betreiber behält sich vor, Inhalte bei Verstößen ohne Vorankündigung zu löschen und Nutzerkonten zu sperren.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Eigenverantwortung &amp; Handwerksordnung (HwO)</h2>
          <p className="mb-2">Die Nutzer sind allein dafür verantwortlich, die Eignung und fachliche Qualifikation des Gegenübers zu prüfen.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Meisterpflicht:</strong> Für viele handwerkliche Tätigkeiten (z. B. Elektro, Gas, Wasser, Statik) besteht in Deutschland eine Meisterpflicht oder eine Eintragungspflicht in die Handwerksrolle.</li>
            <li><strong>Zulassung:</strong> Nutzer verpflichten sich, nur Tätigkeiten anzubieten, die sie nach geltendem Recht (insbesondere Handwerksordnung und Gewerbeordnung) ausführen dürfen.</li>
            <li><strong>Keine Prüfung:</strong> KiezHelfer führt keine Überprüfung von Meisterbriefen, Gewerbeanmeldungen oder Zertifikaten durch. Die Verantwortung hierfür liegt allein bei den Nutzern.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Haftungsausschluss &amp; Versicherung</h2>
          <p className="mb-2"><strong>6.1 Keine Haftung für Schäden:</strong> Da KiezHelfer nicht Vertragspartner der Hilfeleistung ist, übernimmt der Betreiber keine Haftung für Sachschäden, Vermögensschäden oder Personenschäden, die im Rahmen der vermittelten Nachbarschaftshilfe entstehen.</p>
          <p><strong>6.2 Versicherungsschutz:</strong> Wir weisen ausdrücklich darauf hin, dass die gesetzliche Unfallversicherung hier meist nicht greift. Wir raten jedem Nutzer dringend zum Abschluss einer <strong>privaten Haftpflichtversicherung</strong>, die auch Gefälligkeitshandlungen abdeckt.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Steuern, Gewerbe &amp; Schwarzarbeit</h2>
          <p className="mb-2">Jeder Helfer handelt eigenverantwortlich. Er hat selbstständig zu prüfen und sicherzustellen, dass seine Tätigkeit:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>die Grenzen der steuerfreien Nachbarschaftshilfe nicht überschreitet,</li>
            <li>gegebenenfalls steuerlich angemeldet wird (z. B. Kleingewerbe),</li>
            <li>nicht gegen das Gesetz zur Bekämpfung der Schwarzarbeit verstößt.</li>
          </ul>
          <p className="mt-2">Der Betreiber leistet keine Rechts- oder Steuerberatung.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Freistellung durch den Nutzer</h2>
          <p>Der Nutzer stellt den Betreiber von sämtlichen Ansprüchen Dritter (z. B. andere Nutzer, Behörden oder Handwerkskammern) frei, die auf einer rechtswidrigen Nutzung der Plattform oder einem Verstoß gegen diese Bedingungen durch den Nutzer beruhen. Dies umfasst auch die Kosten einer angemessenen Rechtsverteidigung.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Haftungsbeschränkung des Betreibers</h2>
          <p>Der Betreiber haftet nur für Schäden aus der Nutzung der Plattform selbst, die auf einer vorsätzlichen oder grob fahrlässigen Pflichtverletzung des Betreibers beruhen. Für die ständige Verfügbarkeit oder technische Fehler der Plattform wird keine Gewähr übernommen.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Beendigung der Nutzung</h2>
          <p>Nutzer können ihr Konto jederzeit löschen. Der Betreiber kann den Betrieb der Plattform jederzeit einstellen oder ändern.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Datenschutz</h2>
          <p>Die Verarbeitung personenbezogener Daten erfolgt gemäß der separaten <strong>Datenschutzerklärung</strong> auf unserer Webseite.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Schlussbestimmungen</h2>
          <p>Sollten einzelne Bestimmungen dieser Bedingungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Es gilt das Recht der Bundesrepublik Deutschland.</p>
        </section>

      </div>
    </div>
  );
}
