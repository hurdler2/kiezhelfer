# KiezHelfer – Nachbarschaftshilfe in Berlin

Eine Plattform, auf der Berliner ihre Fähigkeiten anbieten und gegenseitig helfen können.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Datenbank**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5
- **Karte**: Google Maps API
- **Echtzeit-Chat**: Socket.io
- **Styling**: Tailwind CSS
- **Mehrsprachigkeit**: next-intl (Deutsch + Englisch)

## Setup

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Umgebungsvariablen konfigurieren

Bearbeite `.env.local` mit deinen Werten:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/kiezhelfer"
AUTH_SECRET="generieren mit: openssl rand -hex 32"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIza..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
```

### 3. Datenbank einrichten

```bash
npm run db:generate   # Prisma Client generieren
npm run db:migrate    # Datenbank-Schema anwenden
npm run db:seed       # Kategorien einfügen
```

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Öffne **http://localhost:3000** im Browser.

## URLs

| Seite | Deutsch | Englisch |
|-------|---------|----------|
| Startseite | /de | /en |
| Angebote | /de/angebote | /en/listings |
| Karte | /de/karte | /en/map |
| Nachrichten | /de/nachrichten | /en/messages |
| Profil | /de/profil | /en/profile |
| Anmelden | /de/anmelden | /en/login |
| Registrieren | /de/registrieren | /en/register |
| Dashboard | /de/uebersicht | /en/dashboard |

## Deployment

Für Produktion: **Railway**, **Render**, oder ein VPS (wegen Socket.io):

```bash
npm run build
npm start
```
