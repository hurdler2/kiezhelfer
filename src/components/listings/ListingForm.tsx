"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import type { Category } from "@prisma/client";
import { listingSchema, type ListingFormValues } from "@/lib/validations/listing";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { BERLIN_DISTRICTS } from "@/types";

const categoryNames: Record<string, Record<string, string>> = {
  de: {
    "home-repair": "Hausreparatur",
    cleaning: "Reinigung",
    "it-help": "IT-Hilfe",
    tutoring: "Nachhilfe",
    babysitting: "Kinderbetreuung",
    moving: "Umzug",
    gardening: "Garten",
    cooking: "Kochen",
    beauty: "Schönheit",
    other: "Sonstiges",
  },
  en: {
    "home-repair": "Home Repair",
    cleaning: "Cleaning",
    "it-help": "IT Help",
    tutoring: "Tutoring",
    babysitting: "Babysitting",
    moving: "Moving",
    gardening: "Gardening",
    cooking: "Cooking",
    beauty: "Beauty",
    other: "Other",
  },
};

interface Props {
  categories: Category[];
}

export default function ListingForm({ categories }: Props) {
  const t = useTranslations("listingForm");
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: { priceType: "negotiable" },
  });

  const priceType = watch("priceType");

  async function onSubmit(data: ListingFormValues) {
    setError(null);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error ?? t("errorCreating"));
        return;
      }

      router.push(`/${locale}/listings/${result.id}`);
    } catch (err) {
      setError(t("networkError"));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <Input
        label={t("titleLabel")}
        placeholder={t("titlePlaceholder")}
        error={errors.title?.message}
        {...register("title")}
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("descriptionLabel")}
        </label>
        <textarea
          rows={5}
          placeholder={t("descriptionPlaceholder")}
          className={`block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 ${
            errors.description ? "border-red-500" : ""
          }`}
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("categoryLabel")}
        </label>
        <select
          className={`block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 ${
            errors.categoryId ? "border-red-500" : ""
          }`}
          {...register("categoryId")}
        >
          <option value="">{t("selectCategory")}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {categoryNames[locale]?.[cat.slug] ?? cat.slug}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>
        )}
      </div>

      {/* District */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("districtLabel")}
        </label>
        <select
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          {...register("district")}
        >
          <option value="">{t("selectDistrict")}</option>
          {BERLIN_DISTRICTS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("priceTypeLabel")}
          </label>
          <select
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-brand-500 focus:outline-none"
            {...register("priceType")}
          >
            <option value="free">{t("priceTypes.free")}</option>
            <option value="hourly">{t("priceTypes.hourly")}</option>
            <option value="fixed">{t("priceTypes.fixed")}</option>
            <option value="negotiable">{t("priceTypes.negotiable")}</option>
          </select>
        </div>

        {(priceType === "hourly" || priceType === "fixed") && (
          <Input
            label={`${t("priceAmountLabel")} (€)`}
            type="number"
            min="0"
            step="0.50"
            error={errors.priceAmount?.message}
            {...register("priceAmount", { valueAsNumber: true })}
          />
        )}
      </div>

      {/* Tags */}
      <Input
        label={t("tagsLabel")}
        placeholder={t("tagsPlaceholder")}
        {...register("tags")}
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
        {t("submit")}
      </Button>
    </form>
  );
}
