import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function EmailVerifiedPage({ params }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-5">
          <div className="bg-brand-50 rounded-full p-4">
            <CheckCircle className="h-12 w-12 text-brand-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          E-Mail erfolgreich bestätigt!
        </h1>

        <p className="text-gray-500 mb-8 leading-relaxed">
          Deine E-Mail-Adresse wurde erfolgreich bestätigt.
          Du kannst jetzt alle Funktionen von KiezHelfer nutzen –
          Angebote erstellen, Nachrichten senden und Bewertungen abgeben.
        </p>

        <Link
          href={`/${params.locale}/login`}
          className="inline-block w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          Jetzt anmelden
        </Link>
      </div>
    </div>
  );
}
