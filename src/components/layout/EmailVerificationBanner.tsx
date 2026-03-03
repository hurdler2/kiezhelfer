"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { MailWarning, X } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function EmailVerificationBanner() {
  const { data: session } = useSession();
  const [dismissed, setDismissed] = useState(false);

  if (!session?.user) return null;
  // Sadece açıkça null ise göster (undefined = eski token, doğrulanmış kullanıcı)
  if ((session.user as any).emailVerifiedAt !== null) return null;
  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-amber-800 text-sm">
          <MailWarning className="h-4 w-4 text-amber-500 shrink-0" />
          <span>
            E-Mail-Adresse noch nicht bestätigt.{" "}
            <Link href="/profile" className="underline hover:text-amber-900 font-medium">
              Profil öffnen
            </Link>{" "}
            oder wende dich an den Support.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-500 hover:text-amber-700 transition-colors shrink-0"
          aria-label="Schließen"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
