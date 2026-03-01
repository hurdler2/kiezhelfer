import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const BERLIN_DISTRICTS = [
  "mitte",
  "friedrichshain-kreuzberg",
  "pankow",
  "charlottenburg-wilmersdorf",
  "spandau",
  "steglitz-zehlendorf",
  "tempelhof-schoeneberg",
  "neukoelln",
  "treptow-koepenick",
  "marzahn-hellersdorf",
  "lichtenberg",
  "reinickendorf",
];

const COORDS: Record<string, { lat: number; lng: number }> = {
  "mitte": { lat: 52.5200, lng: 13.4050 },
  "friedrichshain-kreuzberg": { lat: 52.5021, lng: 13.4543 },
  "pankow": { lat: 52.5669, lng: 13.4030 },
  "charlottenburg-wilmersdorf": { lat: 52.5067, lng: 13.3040 },
  "spandau": { lat: 52.5352, lng: 13.1979 },
  "steglitz-zehlendorf": { lat: 52.4317, lng: 13.2497 },
  "tempelhof-schoeneberg": { lat: 52.4671, lng: 13.3810 },
  "neukoelln": { lat: 52.4812, lng: 13.4353 },
  "treptow-koepenick": { lat: 52.4539, lng: 13.5742 },
  "marzahn-hellersdorf": { lat: 52.5403, lng: 13.5977 },
  "lichtenberg": { lat: 52.5182, lng: 13.4960 },
  "reinickendorf": { lat: 52.5756, lng: 13.3337 },
};

const USERS = [
  { name: "Anna Bauer",       email: "anna.bauer@example.de",       bio: "Ich bin Handwerkerin mit 10 Jahren Erfahrung und helfe gern in der Nachbarschaft.", skills: ["Handwerk", "Renovierung", "Malerei"] },
  { name: "Max Schneider",    email: "max.schneider@example.de",     bio: "IT-Spezialist und Hobbygärtner. Ich helfe bei Tech-Problemen und Gartenpflege.", skills: ["IT-Support", "Gartenpflege", "Linux"] },
  { name: "Laura Hoffmann",   email: "laura.hoffmann@example.de",    bio: "Lehrerin mit Herz für Kinder. Nachhilfe und Babysitting sind meine Stärken.", skills: ["Nachhilfe", "Babysitting", "Englisch"] },
  { name: "Felix Wagner",     email: "felix.wagner@example.de",      bio: "Gelernter Koch und Foodie. Ich koche für Partys und gebe Kochkurse.", skills: ["Kochen", "Catering", "Backen"] },
  { name: "Sophie Müller",    email: "sophie.mueller@example.de",    bio: "Professionelle Reinigungskraft mit eigenem Equipment. Sauber und zuverlässig.", skills: ["Reinigung", "Haushaltsorganisation"] },
  { name: "Jonas Klein",      email: "jonas.klein@example.de",       bio: "Elektriker und Heimwerker. Kleine Reparaturen schnell und günstig erledigt.", skills: ["Elektrik", "Heimwerken", "Installationen"] },
  { name: "Maria Schmidt",    email: "maria.schmidt@example.de",     bio: "Friseurin mit eigenem Salon-Erfahrung. Ich komme auch nach Hause zu dir.", skills: ["Friseur", "Beauty", "Styling"] },
  { name: "Paul Richter",     email: "paul.richter@example.de",      bio: "Umzugshelfer mit LKW-Führerschein. Schnell, stark und zuverlässig.", skills: ["Umzüge", "Transport", "Möbelaufbau"] },
  { name: "Emma Fischer",     email: "emma.fischer@example.de",      bio: "Yogalehrerin und Ernährungsberaterin. Gesundheit ist meine Leidenschaft.", skills: ["Yoga", "Ernährung", "Fitness"] },
  { name: "Leon Weber",       email: "leon.weber@example.de",        bio: "Grafiker und Webdesigner. Ich erstelle professionelle Designs für kleine Unternehmen.", skills: ["Grafikdesign", "Webdesign", "Logo"] },
  { name: "Mia Braun",        email: "mia.braun@example.de",         bio: "Tierpflegerin mit viel Liebe zu Tieren. Ich passe gern auf Hunde und Katzen auf.", skills: ["Tierpflege", "Hundebetreuung", "Tierliebe"] },
  { name: "Noah Zimmermann",  email: "noah.zimmermann@example.de",   bio: "Klempner mit Gesellenbrief. Wasserprobleme werden schnell gelöst.", skills: ["Klempner", "Sanitär", "Heizung"] },
  { name: "Lena Krause",      email: "lena.krause@example.de",       bio: "Musikerin und Musiklehrerin. Gitarre, Klavier und Gesang für alle Altersgruppen.", skills: ["Gitarre", "Klavier", "Gesangsunterricht"] },
  { name: "Tim Schulz",       email: "tim.schulz@example.de",        bio: "Fotograf mit eigenem Studio. Portraits, Events und Produktfotos.", skills: ["Fotografie", "Portraits", "Events"] },
  { name: "Sara König",       email: "sara.koenig@example.de",       bio: "Schneiderin und Näherin. Ich ändere Kleidung und nähe auf Maß.", skills: ["Schneiderei", "Nähen", "Änderungen"] },
  { name: "Finn Meyer",       email: "finn.meyer@example.de",        bio: "Programmierer und App-Entwickler. Websites und Apps zu fairen Preisen.", skills: ["Programmierung", "App-Entwicklung", "Python"] },
  { name: "Clara Wolf",       email: "clara.wolf@example.de",        bio: "Übersetzerin für Deutsch, Englisch und Französisch. Dokumente und Briefe.", skills: ["Übersetzen", "Englisch", "Französisch"] },
  { name: "Ben Lange",        email: "ben.lange@example.de",         bio: "Möbeltischler und Schreiner. Ich baue und repariere Möbel aus Holz.", skills: ["Tischlerei", "Holzarbeit", "Möbelbau"] },
  { name: "Hanna Schwarz",    email: "hanna.schwarz@example.de",     bio: "Buchhalterin und Steuerberaterin. Ich helfe bei Steuererklärungen und Buchhaltung.", skills: ["Buchhaltung", "Steuern", "Finanzen"] },
  { name: "Lukas Becker",     email: "lukas.becker@example.de",      bio: "Fahrradmechaniker und Outdoor-Fan. Fahrradreparatur und -wartung schnell erledigt.", skills: ["Fahrradreparatur", "Outdoor", "Montage"] },
];

// 10 ilan şablonu her kategori için
const LISTING_TEMPLATES: Record<string, Array<{ title: string; description: string; priceType: string; priceAmount?: number; tags: string[] }>> = {
  "home-repair": [
    { title: "Türschloss reparieren & öffnen", description: "Ich öffne Türen bei Schlüsselverlust und tausche Schlösser aus. Schnell und diskret. Auch abends erreichbar.", priceType: "fixed", priceAmount: 60, tags: ["Schlüsseldienst", "Schloss", "Notfall"] },
    { title: "Wände streichen & tapezieren", description: "Professionelles Streichen von Wänden und Decken. Tapezieren nach Wunsch. Saubere Arbeit mit eigenen Materialien.", priceType: "hourly", priceAmount: 25, tags: ["Malen", "Tapezieren", "Renovierung"] },
    { title: "IKEA-Möbel aufbauen", description: "Ich baue alle IKEA-Möbel schnell und korrekt auf. Kein Stress mit Anleitungen – ich mache das für dich.", priceType: "fixed", priceAmount: 40, tags: ["IKEA", "Möbelaufbau", "Heimwerken"] },
    { title: "Kleine Elektroreparaturen", description: "Steckdosen, Lichtschalter, Lampen installieren. Alles nach VDE-Norm. Sichere und saubere Arbeit.", priceType: "hourly", priceAmount: 35, tags: ["Elektrik", "Lampe", "Steckdose"] },
    { title: "Badezimmer-Fliesen verlegen", description: "Fachgerechtes Verlegen von Fliesen im Bad und in der Küche. Saubere Fugen garantiert.", priceType: "negotiable", tags: ["Fliesen", "Bad", "Renovierung"] },
    { title: "Wasserhahn & Spüle reparieren", description: "Tropfende Wasserhähne, undichte Spülen – ich repariere alles schnell und günstig.", priceType: "fixed", priceAmount: 45, tags: ["Klempner", "Wasserhahn", "Sanitär"] },
    { title: "Gartenhaus aufbauen", description: "Aufbau von Gartenhäusern, Pergolen und Carports. Auch Montage von Sichtschutzzäunen.", priceType: "negotiable", tags: ["Gartenhaus", "Holzbau", "Montage"] },
    { title: "Laminat & Parkett verlegen", description: "Verlegen von Laminat, Parkett und Vinylböden. Schnelle und saubere Arbeit. Untergrund inklusive.", priceType: "hourly", priceAmount: 30, tags: ["Boden", "Laminat", "Parkett"] },
    { title: "Fenster & Türen abdichten", description: "Zugluft und Wärmeverlust durch undichte Fenster und Türen vermeiden. Ich dichte alles fachgerecht ab.", priceType: "fixed", priceAmount: 50, tags: ["Fenster", "Dichten", "Energiesparen"] },
    { title: "Rolladen & Jalousien reparieren", description: "Kaputte Rolladen, klemmenede Jalousien – ich repariere und tausche aus. Alle Typen.", priceType: "fixed", priceAmount: 55, tags: ["Rolladen", "Jalousie", "Reparatur"] },
  ],
  "cleaning": [
    { title: "Wohnungsreinigung – gründlich & zuverlässig", description: "Komplette Wohnungsreinigung inkl. Küche, Bad und Böden. Eigene Reinigungsmittel. Regelmäßig oder einmalig.", priceType: "hourly", priceAmount: 18, tags: ["Reinigung", "Haushalt", "Putzen"] },
    { title: "Fenster putzen innen & außen", description: "Saubere Fenster für mehr Licht. Ich putze Fenster in Wohnungen und Büros. Auch Hochparterre.", priceType: "fixed", priceAmount: 35, tags: ["Fenster", "Reinigung", "Glanz"] },
    { title: "Umzugsreinigung mit Übergabegarantie", description: "Professionelle End- und Einzugsreinigung für Mietkautionsrückgabe. Mit Endreinigungsgarantie.", priceType: "negotiable", tags: ["Umzug", "Endreinigung", "Kaution"] },
    { title: "Teppich- und Polsterreinigung", description: "Tiefenreinigung von Teppichen, Sofas und Autositzen. Mit Profi-Gerät. Flecken und Gerüche werden entfernt.", priceType: "hourly", priceAmount: 20, tags: ["Teppich", "Polster", "Tiefenreinigung"] },
    { title: "Büroreinigung – täglich oder wöchentlich", description: "Zuverlässige Büroreinigung auf Vertragsbasis. Frühmorgens oder abends, damit der Betrieb nicht gestört wird.", priceType: "negotiable", tags: ["Büro", "Reinigung", "Gewerbe"] },
    { title: "Backofen & Kühlschrank reinigen", description: "Hartnaäckiger Schmutz im Backofen oder Kühlschrank? Ich reinige gründlich mit umweltfreundlichen Mitteln.", priceType: "fixed", priceAmount: 30, tags: ["Küche", "Backofen", "Reinigung"] },
    { title: "Keller & Dachboden entrümpeln", description: "Ich helfe beim Sortieren und Entrümpeln von Keller, Dachboden oder Garage. Entsorgung auf Wunsch möglich.", priceType: "hourly", priceAmount: 15, tags: ["Entrümpeln", "Keller", "Aufräumen"] },
    { title: "Wäsche waschen & bügeln", description: "Du hast keine Zeit zum Waschen und Bügeln? Ich übernehme das gerne. Abholung und Lieferung möglich.", priceType: "hourly", priceAmount: 12, tags: ["Wäsche", "Bügeln", "Haushalt"] },
    { title: "Frühjahrsputz komplett", description: "Kompletter Frühjahrsputz: Schränke ausräumen, Böden wischen, Fenster putzen, Bad schrubben. Alles sauber.", priceType: "negotiable", tags: ["Frühjahrsputz", "Reinigung", "Komplett"] },
    { title: "Küche entkalken & desinfizieren", description: "Kalk an Armaturen, Fliesen und Geräten entfernen. Hygienische Desinfektion der gesamten Küche.", priceType: "fixed", priceAmount: 40, tags: ["Küche", "Entkalken", "Desinfektion"] },
  ],
  "it-help": [
    { title: "PC & Laptop reparieren", description: "Langsamer Rechner, Viren, Abstürze – ich diagnose und repariere. Windows, Mac und Linux.", priceType: "hourly", priceAmount: 30, tags: ["Computer", "Reparatur", "Windows"] },
    { title: "WLAN einrichten & optimieren", description: "Kein Internet oder schlechtes Signal? Ich richte deinen Router ein und optimiere die WLAN-Abdeckung.", priceType: "fixed", priceAmount: 40, tags: ["WLAN", "Router", "Internet"] },
    { title: "Smartphone-Bildschirm austauschen", description: "Gebrochenes Display? Ich tausche Bildschirme bei den meisten Smartphone-Modellen aus. Schnell und günstig.", priceType: "fixed", priceAmount: 50, tags: ["Handy", "Display", "Reparatur"] },
    { title: "Drucker einrichten & Probleme lösen", description: "Drucker will nicht drucken? Ich richte ihn ein, installiere Treiber und löse Verbindungsprobleme.", priceType: "fixed", priceAmount: 25, tags: ["Drucker", "Setup", "Netzwerk"] },
    { title: "Daten retten & Backup einrichten", description: "Daten verloren? Ich versuche sie zu retten. Ich richte auch automatische Backups ein – damit es nicht wieder passiert.", priceType: "hourly", priceAmount: 35, tags: ["Datenrettung", "Backup", "Sicherheit"] },
    { title: "Virus & Malware entfernen", description: "Viren, Trojaner, Adware – ich reinige deinen PC gründlich und schütze ihn für die Zukunft.", priceType: "fixed", priceAmount: 45, tags: ["Virus", "Malware", "Sicherheit"] },
    { title: "Website erstellen (WordPress)", description: "Einfache und professionelle WordPress-Websites für kleine Unternehmen und Selbstständige.", priceType: "negotiable", tags: ["Website", "WordPress", "Online"] },
    { title: "E-Mail-Konto einrichten", description: "Gmail, Outlook, Apple Mail – ich richte deine E-Mail-Konten auf allen Geräten ein.", priceType: "fixed", priceAmount: 20, tags: ["E-Mail", "Setup", "Outlook"] },
    { title: "Smart Home einrichten", description: "Alexa, Google Home, smarte Lampen und Steckdosen – ich richte dein Smart Home ein und erkläre alles.", priceType: "hourly", priceAmount: 30, tags: ["Smart Home", "Alexa", "IoT"] },
    { title: "Altes Laptop beschleunigen", description: "SSD einbauen, RAM erweitern, Windows neu installieren – dein alter Laptop wird wieder schnell.", priceType: "negotiable", tags: ["Laptop", "Optimierung", "SSD"] },
  ],
  "tutoring": [
    { title: "Mathe-Nachhilfe (Klasse 5–13)", description: "Erfahrene Lehrerin gibt Nachhilfe in Mathematik. Vom Bruchrechnen bis zur Analysis. Online oder in Pankow.", priceType: "hourly", priceAmount: 20, tags: ["Mathe", "Nachhilfe", "Schule"] },
    { title: "Englisch für Alltag & Beruf", description: "Englischunterricht für Erwachsene. Konversation, Grammatik, Business-Englisch. Flexibel und individuell.", priceType: "hourly", priceAmount: 25, tags: ["Englisch", "Sprachkurs", "Erwachsene"] },
    { title: "Deutsch als Fremdsprache (DAF)", description: "Deutschkurs für Ausländer. Anfänger bis Fortgeschrittene. Geduldig und methodisch.", priceType: "hourly", priceAmount: 22, tags: ["Deutsch", "DAF", "Integration"] },
    { title: "Abiturvorbereitung – alle Fächer", description: "Intensivkurse zur Abiturvorbereitung in Mathe, Physik, Chemie und Deutsch. Kleine Gruppen möglich.", priceType: "hourly", priceAmount: 28, tags: ["Abitur", "Nachhilfe", "Prüfung"] },
    { title: "Gitarrenunterricht für Anfänger", description: "Ich bringe dir Gitarre bei – von den ersten Akkorden bis zu deinen Lieblingssongs. Alle Altersstufen.", priceType: "hourly", priceAmount: 20, tags: ["Gitarre", "Musik", "Unterricht"] },
    { title: "Französisch für Schule & Reise", description: "Nachhilfe und Konversationskurs in Französisch. Schüler und Erwachsene. Bei mir oder bei dir.", priceType: "hourly", priceAmount: 22, tags: ["Französisch", "Sprache", "Nachhilfe"] },
    { title: "Programmieren lernen (Python & Webdev)", description: "Ich bringe dir Python und Webentwicklung bei. Für Anfänger und Quereinsteiger. Praxisorientiert.", priceType: "hourly", priceAmount: 30, tags: ["Programmieren", "Python", "Coding"] },
    { title: "Klavier & Keyboard Unterricht", description: "Klavierunterricht für Kinder und Erwachsene. Alle Niveaustufen. Mit oder ohne Vorkenntnisse.", priceType: "hourly", priceAmount: 22, tags: ["Klavier", "Keyboard", "Musik"] },
    { title: "Hausaufgabenhilfe für Grundschüler", description: "Tägliche Hausaufgabenhilfe für Kinder der 1.–4. Klasse. Geduldig, liebevoll und strukturiert.", priceType: "hourly", priceAmount: 15, tags: ["Grundschule", "Hausaufgaben", "Kinder"] },
    { title: "BWL & VWL für Studenten", description: "Nachhilfe in Betriebswirtschaft und Volkswirtschaft. Klausurvorbereitung und Verständnishilfe.", priceType: "hourly", priceAmount: 25, tags: ["BWL", "Studium", "Nachhilfe"] },
  ],
  "babysitting": [
    { title: "Babysitting abends & am Wochenende", description: "Zuverlässige Babysitterin mit Erfahrung. Ich komme zu euch nach Hause. Auch kurzfristig möglich.", priceType: "hourly", priceAmount: 12, tags: ["Babysitting", "Kinder", "Abend"] },
    { title: "Kinderbetreuung ganztags", description: "Ganztagesbetreuung für Kinder von 1–10 Jahren. Spielen, Essen, Schlafen – liebevoll und strukturiert.", priceType: "hourly", priceAmount: 10, tags: ["Kinderbetreuung", "Ganztag", "Spielen"] },
    { title: "Ferienbetreuung für Schulkinder", description: "Ich betreue eure Kinder in den Ferien. Ausflüge, Basteln, Spielen – kreatives Ferienprogramm.", priceType: "hourly", priceAmount: 11, tags: ["Ferien", "Schulkind", "Betreuung"] },
    { title: "Kita-Ergänzung & Abholdienst", description: "Ich hole Kinder von der Kita oder Schule ab und betreue sie bis zum Feierabend der Eltern.", priceType: "monthly", priceAmount: 300, tags: ["Kita", "Abholen", "Nachmittag"] },
    { title: "Erfahrene Tagesmutter", description: "Tagesmutter mit 8 Jahren Erfahrung und pädagogischer Ausbildung. Liebevolle Betreuung in meiner Wohnung.", priceType: "hourly", priceAmount: 9, tags: ["Tagesmutter", "Kleinkind", "Erziehung"] },
    { title: "Babysitten für Säuglinge (0–12 Monate)", description: "Spezialisiert auf Säuglingspflege. Ich betreue Babys liebevoll und erfahren. Auch Nachts.", priceType: "hourly", priceAmount: 14, tags: ["Säugling", "Baby", "Nacht"] },
    { title: "Kinder abholen & Hausaufgaben betreuen", description: "Nachmittagsbetreuung: Schule abholen, Hausaufgaben, Spielen und Snack. Montag bis Freitag.", priceType: "monthly", priceAmount: 250, tags: ["Hausaufgaben", "Nachmittag", "Schule"] },
    { title: "Geburtstagsfeiern für Kinder organisieren", description: "Ich organisiere und begleite Kindergeburtstage. Spiele, Bastelideen und viel Spaß für die Kleinen.", priceType: "fixed", priceAmount: 80, tags: ["Geburtstag", "Party", "Kinder"] },
    { title: "Wochenend-Babysitting", description: "Ihr habt Pläne am Wochenende? Ich passe auf eure Kinder auf. Mit Erfahrung und viel Geduld.", priceType: "hourly", priceAmount: 13, tags: ["Wochenende", "Babysitting", "Eltern"] },
    { title: "Zweisprachige Kinderbetreuung (DE/EN)", description: "Ich betreue Kinder auf Deutsch und Englisch. Ideal für internationale Familien oder zum Sprachenlernen.", priceType: "hourly", priceAmount: 14, tags: ["Zweisprachig", "Englisch", "Kinder"] },
  ],
  "moving": [
    { title: "Umzugshelfer mit LKW", description: "Ich helfe beim Umzug mit einem 7,5t-LKW. Auch Möbeltransporte innerhalb Berlins. Inkl. Be- und Entladen.", priceType: "hourly", priceAmount: 45, tags: ["Umzug", "LKW", "Transport"] },
    { title: "Möbel auf- und abbauen", description: "Ich baue Möbel sicher ab und wieder auf. Küchen, Schränke, Betten, Regale. Mit Werkzeug.", priceType: "hourly", priceAmount: 25, tags: ["Möbel", "Aufbau", "Abbau"] },
    { title: "Umzugskartons packen & transportieren", description: "Professionelles Einpacken und Transportieren. Bücher, Geschirr, Elektronik – alles sicher verpackt.", priceType: "hourly", priceAmount: 20, tags: ["Kartons", "Packen", "Transport"] },
    { title: "Sperrmüll entsorgen & Transport", description: "Ich entsorge Sperrmüll, alte Möbel und Elektrogeräte. Auch große Mengen kein Problem.", priceType: "fixed", priceAmount: 80, tags: ["Sperrmüll", "Entsorgung", "Transport"] },
    { title: "Piano & Klavier transportieren", description: "Spezialtransport für Klaviere und Flügel. Mit Fachkenntnissen und dem richtigen Equipment.", priceType: "negotiable", tags: ["Klavier", "Spezialtransport", "Umzug"] },
    { title: "Studentenumzug günstig", description: "Günstiger Umzugsservice für Studenten. Schnell, zuverlässig und ohne unnötige Extras.", priceType: "fixed", priceAmount: 150, tags: ["Student", "Umzug", "Günstig"] },
    { title: "Kellerräumung & Entrümpelung", description: "Keller oder Dachboden muss geräumt werden? Ich helfe beim Sortieren, Tragen und Entsorgen.", priceType: "hourly", priceAmount: 18, tags: ["Keller", "Entrümpelung", "Räumung"] },
    { title: "IKEA-Abholung & Lieferung", description: "Kein Auto für IKEA? Ich hole deine Bestellung ab und liefere direkt zu dir nach Hause.", priceType: "fixed", priceAmount: 50, tags: ["IKEA", "Abholung", "Lieferung"] },
    { title: "Möbel lagern & einlagern", description: "Du brauchst temporären Stauraum? Ich biete Einlagerung von Möbeln und Kartons für kurze Zeit.", priceType: "monthly", priceAmount: 60, tags: ["Lager", "Einlagern", "Möbel"] },
    { title: "Umzug im Haus (Etagen)", description: "Möbel innerhalb eines Gebäudes von Etage zu Etage tragen. Auch ohne Aufzug schnell erledigt.", priceType: "hourly", priceAmount: 20, tags: ["Etagen", "intern", "Möbel"] },
  ],
  "gardening": [
    { title: "Rasen mähen & Unkraut jäten", description: "Regelmäßige Rasenpflege: Mähen, Kanten schneiden, Unkraut entfernen. Mit eigenem Mäher.", priceType: "hourly", priceAmount: 18, tags: ["Rasen", "Garten", "Pflege"] },
    { title: "Heckenschnitt professionell", description: "Ich schneide Hecken, Sträucher und Büsche in Form. Ordentlich und sauber. Schnittgut wird entsorgt.", priceType: "fixed", priceAmount: 50, tags: ["Hecke", "Schnitt", "Garten"] },
    { title: "Gartenbeet anlegen & bepflanzen", description: "Ich lege Beete an, bereite den Boden vor und bepflanze nach deinen Wünschen. Gemüse oder Blumen.", priceType: "hourly", priceAmount: 20, tags: ["Beet", "Pflanzen", "Garten"] },
    { title: "Baum fällen & Äste entfernen", description: "Kleinere Bäume und störende Äste werden fachgerecht entfernt. Sicherheit steht an erster Stelle.", priceType: "negotiable", tags: ["Baum", "Fällen", "Äste"] },
    { title: "Gartengestaltung & Beratung", description: "Ich plane deinen Traumgarten und setze ihn mit dir um. Naturnahe und pflegeleichte Gärten.", priceType: "hourly", priceAmount: 30, tags: ["Gestaltung", "Planung", "Garten"] },
    { title: "Herbstlaub & Gartenabfälle entsorgen", description: "Laub, Äste, Grasschnitt – ich entsorge alle Gartenabfälle sauber und schnell.", priceType: "hourly", priceAmount: 15, tags: ["Laub", "Herbst", "Entsorgung"] },
    { title: "Balkon bepflanzen & gestalten", description: "Ich bepflanze und gestalte deinen Balkon oder deine Terrasse. Saisonal oder ganzjährig.", priceType: "fixed", priceAmount: 60, tags: ["Balkon", "Pflanzen", "Gestaltung"] },
    { title: "Bewässerungssystem installieren", description: "Automatische Bewässerung für Garten und Balkon. Tröpfchensysteme und Zeitschaltuhren.", priceType: "negotiable", tags: ["Bewässerung", "Installation", "Automatisch"] },
    { title: "Kompost anlegen & Erde verbessern", description: "Ich lege einen Kompost an und verbessere die Gartenerde mit organischem Material.", priceType: "fixed", priceAmount: 40, tags: ["Kompost", "Boden", "Ökologisch"] },
    { title: "Wintergarten vorbereiten & Pflanzen einwintern", description: "Pflanzen fachgerecht einwintern, Beete abdecken, Gartenmöbel reinigen und einlagern.", priceType: "hourly", priceAmount: 18, tags: ["Wintergarten", "Einwintern", "Herbst"] },
  ],
  "cooking": [
    { title: "Kochen für Partys & Feiern", description: "Ich koche für euer Event bis zu 30 Personen. Deutsche, mediterrane oder internationale Küche.", priceType: "negotiable", tags: ["Party", "Kochen", "Catering"] },
    { title: "Kochkurs für Anfänger", description: "Lerne kochen von Grund auf. Ich bringe dir Grundtechniken und leckere Alltagsrezepte bei.", priceType: "fixed", priceAmount: 40, tags: ["Kochkurs", "Anfänger", "Lernen"] },
    { title: "Meal Prep – gesund für die Woche vorkochen", description: "Ich koche gesunde Mahlzeiten für deine ganze Woche vor. Portioniert und fertig zum Aufwärmen.", priceType: "fixed", priceAmount: 80, tags: ["Meal Prep", "Gesund", "Vorkochen"] },
    { title: "Geburtstagstorten & Motivtorten backen", description: "Individuelle Torten nach Wunsch: Motivtorten, Naked Cakes, Cupcakes. Mit Bestellung im Voraus.", priceType: "fixed", priceAmount: 60, tags: ["Torte", "Geburtstag", "Backen"] },
    { title: "Vegane & vegetarische Küche", description: "Leckeres veganes und vegetarisches Essen zum Bestellen oder als Kochkurs. Nachhaltig und gesund.", priceType: "hourly", priceAmount: 25, tags: ["Vegan", "Vegetarisch", "Kochen"] },
    { title: "Türkische & orientalische Küche", description: "Ich koche authentisches türkisches und orientalisches Essen für euch. Kebab, Meze, Baklava & mehr.", priceType: "fixed", priceAmount: 50, tags: ["Türkisch", "Orientalisch", "Catering"] },
    { title: "Sushi & asiatische Küche", description: "Professionelle Sushi-Zubereitung für Partys und Events. Auch Sushi-Kurs für Gruppen möglich.", priceType: "fixed", priceAmount: 65, tags: ["Sushi", "Asiatisch", "Kurs"] },
    { title: "Babybrei selbst kochen – Kochkurs", description: "Ich zeige jungen Eltern, wie man frischen, gesunden Babybrei zubereitet. Schonend und lecker.", priceType: "fixed", priceAmount: 30, tags: ["Baby", "Babybrei", "Gesund"] },
    { title: "Brot & Gebäck selber backen", description: "Kochkurs: Sauerteigbrot, Brötchen und Gebäck backen. Kein Bäcker nötig – einfacher als du denkst!", priceType: "fixed", priceAmount: 35, tags: ["Brot", "Backen", "Kurs"] },
    { title: "Dinner-Party planen & kochen", description: "Ich plane und koche für euer Dinner zu Hause. Menü nach Absprache, Einkauf inklusive.", priceType: "negotiable", tags: ["Dinner", "Party", "Kochen"] },
  ],
  "beauty": [
    { title: "Haarschnitt & Styling zu Hause", description: "Mobile Friseurin kommt zu dir. Haarschnitt, Färben, Strähnen. Für Damen und Herren.", priceType: "fixed", priceAmount: 35, tags: ["Friseur", "Haarschnitt", "Mobil"] },
    { title: "Maniküre & Gelnägel", description: "Professionelle Maniküre, Gelnägel, Nageldesign. Ich komme zu dir oder du kommst zu mir.", priceType: "fixed", priceAmount: 40, tags: ["Nägel", "Maniküre", "Gel"] },
    { title: "Wimpernverlängerung & -lifting", description: "Voluminöse Wimpern durch Lifting oder Verlängerung. Lang anhaltend und natürlich wirkend.", priceType: "fixed", priceAmount: 55, tags: ["Wimpern", "Lifting", "Beauty"] },
    { title: "Make-up für Hochzeiten & Events", description: "Professionelles Make-up für deinen besonderen Tag. Brautmake-up, Abendmake-up, langhaltend.", priceType: "fixed", priceAmount: 70, tags: ["Make-up", "Hochzeit", "Event"] },
    { title: "Augenbrauen formen & färben", description: "Augenbrauen zupfen, waxen, fadentechnisch formen und bei Bedarf färben. Schnell und präzise.", priceType: "fixed", priceAmount: 20, tags: ["Augenbrauen", "Formen", "Beauty"] },
    { title: "Pediküre & Fußpflege", description: "Verwöhne deine Füße mit professioneller Pediküre. Hornhaut, Nagelpflege, Lackieren.", priceType: "fixed", priceAmount: 35, tags: ["Pediküre", "Füße", "Pflege"] },
    { title: "Massage – Rücken & Ganzkörper", description: "Entspannungsmassage für zuhause. Rücken-, Nacken- und Ganzkörpermassage. Mit eigenem Öl.", priceType: "hourly", priceAmount: 40, tags: ["Massage", "Entspannung", "Wellness"] },
    { title: "Haare färben & Strähnen", description: "Haare neu färben, Balayage, Highlights oder Strähnen. Mobile Friseurin mit Profi-Produkten.", priceType: "negotiable", tags: ["Färben", "Strähnen", "Balayage"] },
    { title: "Kosmetik & Gesichtsbehandlung", description: "Reinigung, Peeling, Maske und Pflege für dein Gesicht. Entspannt und verwöhnt in einer Stunde.", priceType: "fixed", priceAmount: 50, tags: ["Kosmetik", "Gesicht", "Peeling"] },
    { title: "Brautfrisur & Hochzeit-Styling", description: "Komplettes Hochzeit-Styling: Haare, Make-up, Brautjungfern auf Wunsch. Termin frühzeitig buchen.", priceType: "negotiable", tags: ["Brautfrisur", "Hochzeit", "Styling"] },
  ],
  "other": [
    { title: "Einkaufen & Erledigungen für Senioren", description: "Ich erledige Einkäufe, Behördengänge und Arztbesuche für ältere Menschen. Geduldig und zuverlässig.", priceType: "hourly", priceAmount: 12, tags: ["Senioren", "Einkauf", "Hilfe"] },
    { title: "Hund ausführen & Tiersitting", description: "Ich führe deinen Hund aus und passe auf Haustiere auf, wenn du weg bist. Mit viel Liebe.", priceType: "hourly", priceAmount: 10, tags: ["Hund", "Tiersitting", "Gassi"] },
    { title: "Übersetzungen DE / EN / TR", description: "Übersetzungen von Dokumenten, Briefen und Formularen. Deutsch, Englisch und Türkisch.", priceType: "fixed", priceAmount: 30, tags: ["Übersetzen", "Dokumente", "Mehrsprachig"] },
    { title: "Fahrdienst & Begleitung", description: "Ich fahre dich zu Arztbesuchen, zum Flughafen oder bei Erledigungen. Zuverlässig und pünktlich.", priceType: "hourly", priceAmount: 15, tags: ["Fahrdienst", "Transport", "Begleitung"] },
    { title: "Buchhaltung & Steuererklärung", description: "Ich helfe bei der jährlichen Steuererklärung und einfacher Buchführung für Selbstständige.", priceType: "hourly", priceAmount: 35, tags: ["Steuern", "Buchhaltung", "Finanzen"] },
    { title: "Fotoshooting für Bewerbung & LinkedIn", description: "Professionelle Bewerbungsfotos und LinkedIn-Portraits. Studio oder outdoor. Schnelle Lieferung.", priceType: "fixed", priceAmount: 60, tags: ["Foto", "Bewerbung", "Portrait"] },
    { title: "Aufgaben am Computer – Hilfe für Senioren", description: "E-Mails schreiben, Video-Telefon einrichten, Online-Banking – ich erkläre alles geduldig.", priceType: "hourly", priceAmount: 15, tags: ["Computer", "Senioren", "Erklärung"] },
    { title: "Party & Event dekorieren", description: "Ich dekoriere Geburtstage, Hochzeiten und Feiern. Luftballons, Tische, Beleuchtung – alles dabei.", priceType: "negotiable", tags: ["Deko", "Party", "Event"] },
    { title: "Schlange stehen & Termine wahrnehmen", description: "Keine Zeit für Behörden, Arzt oder lange Warteschlangen? Ich erledige das für dich.", priceType: "hourly", priceAmount: 12, tags: ["Warten", "Termine", "Behörden"] },
    { title: "Lernhilfe & Studienorganisation", description: "Ich helfe beim Organisieren des Lernstoffs, erstelle Zusammenfassungen und Lernpläne.", priceType: "hourly", priceAmount: 18, tags: ["Lernen", "Organisation", "Studium"] },
  ],
};

const CATEGORY_SLUGS = Object.keys(LISTING_TEMPLATES);

async function main() {
  console.log("🚀 20 Benutzer + 200 Angebote werden erstellt...\n");

  const passwordHash = await bcrypt.hash("test1234", 10);

  // Kategorileri çek
  const categories = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  if (categories.length === 0) {
    throw new Error("Kategoriler bulunamadı! Önce prisma db seed çalıştır.");
  }

  for (let i = 0; i < USERS.length; i++) {
    const userData = USERS[i];
    const district = BERLIN_DISTRICTS[i % BERLIN_DISTRICTS.length];
    const coords = COORDS[district];

    // Kullanıcı oluştur
    const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });
    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      console.log(`⚠️  Benutzer existiert bereits: ${userData.name}`);
    } else {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          passwordHash,
          name: userData.name,
          profile: {
            create: {
              bio: userData.bio,
              district,
              latitude: coords.lat + (Math.random() - 0.5) * 0.02,
              longitude: coords.lng + (Math.random() - 0.5) * 0.02,
              skillTags: userData.skills,
              preferredLocale: "de",
            },
          },
        },
      });
      userId = user.id;
      console.log(`✅ Benutzer erstellt: ${userData.name} (${userData.email})`);
    }

    // Bu kullanıcı için zaten ilan var mı kontrol et
    const existingListings = await prisma.listing.count({ where: { userId } });
    if (existingListings >= 10) {
      console.log(`   ⏭️  Angebote bereits vorhanden, übersprungen.\n`);
      continue;
    }

    // 10 ilan oluştur – farklı kategorilerden seç
    let listingCount = 0;
    const usedCategories: string[] = [];

    for (const slug of CATEGORY_SLUGS) {
      if (listingCount >= 10) break;
      const templates = LISTING_TEMPLATES[slug];
      const categoryId = categoryMap[slug];
      if (!categoryId) continue;

      // Her kategoriden 1 ilan al, sırayı kullanıcıya göre kaydır
      const templateIndex = i % templates.length;
      const tmpl = templates[templateIndex];

      // Eğer aynı kategoriyi zaten kullandıysak sonrakine geç
      if (usedCategories.includes(slug)) continue;
      usedCategories.push(slug);

      await prisma.listing.create({
        data: {
          userId,
          categoryId,
          title: tmpl.title,
          description: tmpl.description,
          priceType: tmpl.priceType,
          priceAmount: tmpl.priceAmount ?? null,
          district,
          latitude: coords.lat + (Math.random() - 0.5) * 0.02,
          longitude: coords.lng + (Math.random() - 0.5) * 0.02,
          tags: tmpl.tags,
          status: "ACTIVE",
        },
      });
      listingCount++;
    }

    console.log(`   📋 ${listingCount} Angebote für ${userData.name} erstellt.\n`);
  }

  const totalUsers = await prisma.user.count();
  const totalListings = await prisma.listing.count();
  console.log("─".repeat(50));
  console.log(`✅ Fertig! Gesamt: ${totalUsers} Benutzer, ${totalListings} Angebote`);
  console.log("\n🔑 Passwort für alle Testbenutzer: test1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
