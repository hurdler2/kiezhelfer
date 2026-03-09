"use client";

import { useState, useRef } from "react";
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
import { ImagePlus, X, Camera, Loader2 } from "lucide-react";
import LocationPicker from "@/components/listings/LocationPicker";

interface Props {
  categories: Category[];
  listingId?: string;
  defaultValues?: Partial<ListingFormValues>;
}

export default function ListingForm({ categories, listingId, defaultValues }: Props) {
  const t = useTranslations("listingForm");
  const tCat = useTranslations("categories");
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5 - selectedFiles.length);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  }

  function removeFile(index: number) {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: defaultValues ?? { priceType: "negotiable" },
  });

  const priceType = watch("priceType");
  const district = watch("district");
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  async function onSubmit(data: ListingFormValues) {
    setError(null);
    try {
      const isEdit = !!listingId;

      // 1. İlanı oluştur / güncelle
      const res = await fetch(isEdit ? `/api/listings/${listingId}` : "/api/listings", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error ?? t("errorCreating"));
        return;
      }

      const targetId = isEdit ? listingId : result.id;

      // 2. Seçili fotoğrafları yükle
      if (selectedFiles.length > 0) {
        setUploading(true);
        const uploadedUrls: string[] = [];
        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append("file", file);
          const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
          const uploadData = await uploadRes.json();
          if (uploadRes.ok && uploadData.url) {
            uploadedUrls.push(uploadData.url);
          } else {
            console.error("Upload failed:", uploadData);
            setError(uploadData.error ?? t("photoUploadError"));
            setUploading(false);
            return;
          }
        }

        if (uploadedUrls.length > 0) {
          const patchRes = await fetch(`/api/listings/${targetId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrls: uploadedUrls }),
          });
          if (!patchRes.ok) {
            const patchData = await patchRes.json();
            console.error("Image PATCH failed:", patchData);
          }
        }
        setUploading(false);
      }

      router.push(`/${locale}/listings/${targetId}`);
    } catch {
      setUploading(false);
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
          rows={3}
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
              {tCat((cat.nameKey?.replace("categories.", "") ?? cat.slug) as any)}
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

      {/* Location Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {t("locationLabel")} <span className="text-gray-400 font-normal text-xs">{t("locationOptional")}</span>
        </label>
        <LocationPicker
          lat={latitude}
          lng={longitude}
          districtSlug={district}
          onChange={(lat, lng) => {
            setValue("latitude", lat);
            setValue("longitude", lng);
          }}
        />
      </div>

      {/* Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Fotos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("photosLabel")} <span className="text-gray-400 font-normal">{t("photosOptional")}</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {previews.map((src, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {previews.length < 5 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-400 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-brand-500 transition-colors"
            >
              <ImagePlus className="h-5 w-5" />
              <span className="text-xs">{t("photoAdd")}</span>
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400">
          <Camera className="h-3 w-3 inline mr-1" />
          {t("photoHint")}
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-brand-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("photosUploading")}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
        {listingId ? t("submitEdit") : t("submit")}
      </Button>
    </form>
  );
}
