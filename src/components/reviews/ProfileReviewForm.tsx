"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import StarRating from "@/components/ui/StarRating";

interface ProfileReviewFormProps {
  targetUserId: string;
  alreadyReviewed: boolean;
  translations: {
    title: string;
    ratingLabel: string;
    commentLabel: string;
    commentPlaceholder: string;
    submit: string;
    submitting: string;
    alreadyReviewed: string;
    success: string;
    loginRequired: string;
  };
}

export default function ProfileReviewForm({
  targetUserId,
  alreadyReviewed,
  translations: t,
}: ProfileReviewFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!session) {
    return (
      <p className="text-sm text-gray-400 italic">{t.loginRequired}</p>
    );
  }

  if (alreadyReviewed || submitted) {
    return (
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-center">
        <div className="text-2xl mb-1">✅</div>
        <p className="text-sm font-medium text-brand-700">
          {submitted ? t.success : t.alreadyReviewed}
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Lütfen bir yıldız seçin.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId, rating, comment }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Bir hata oluştu.");
        return;
      }
      setSubmitted(true);
      router.refresh();
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{t.title}</h3>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1.5">{t.ratingLabel}</p>
        <StarRating
          rating={rating}
          interactive
          onRate={setRating}
          size="lg"
        />
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-1.5">{t.commentLabel}</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t.commentPlaceholder}
          rows={3}
          maxLength={500}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 mb-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium py-2 rounded-lg transition-colors"
      >
        {submitting ? t.submitting : t.submit}
      </button>
    </form>
  );
}
