"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";

interface Props {
  listingId: string;
  alreadyReviewed: boolean;
}

export default function ReviewForm({ listingId, alreadyReviewed }: Props) {
  const t = useTranslations("reviews");
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (alreadyReviewed) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
        {t("alreadyReviewed")}
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 text-center">
        <div className="text-2xl mb-1">⭐</div>
        {t("reviewSubmitted")}
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Bitte wähle eine Bewertung (1–5 Sterne).");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, rating, comment: comment.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Fehler beim Speichern.");
        return;
      }
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-3">{t("writeReview")}</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Star selection */}
        <div>
          <p className="text-sm text-gray-600 mb-1.5">{t("rating")}</p>
          <StarRating
            rating={rating}
            interactive
            onRate={setRating}
            size="lg"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t("comment")}</label>
          <textarea
            rows={3}
            placeholder={t("commentPlaceholder")}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}

        <Button type="submit" loading={loading}>
          {t("submit")}
        </Button>
      </form>
    </div>
  );
}
