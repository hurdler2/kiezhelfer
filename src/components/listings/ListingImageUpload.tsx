"use client";

import { useState, useRef } from "react";
import { Camera, X, Loader2, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  listingId: string;
  currentImages: string[];
}

export default function ListingImageUpload({ listingId, currentImages }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>(currentImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        setError(uploadData.error ?? "Upload fehlgeschlagen.");
        return;
      }

      const newImages = [...images, uploadData.url];
      setImages(newImages);

      await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrls: newImages }),
      });

      router.refresh();
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function removeImage(url: string) {
    const newImages = images.filter((img) => img !== url);
    setImages(newImages);
    await fetch(`/api/listings/${listingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrls: newImages }),
    });
    router.refresh();
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2 mb-2">
        {images.map((url) => (
          <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="Foto" className="w-full h-full object-cover" />
            <button
              onClick={() => removeImage(url)}
              className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {images.length < 5 && (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-400 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-brand-500 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <ImagePlus className="h-5 w-5" />
                <span className="text-xs">Foto</span>
              </>
            )}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <p className="text-xs text-gray-400">
        <Camera className="h-3 w-3 inline mr-1" />
        Max. 5 Fotos · JPEG, PNG, WebP · max. 5 MB
      </p>
    </div>
  );
}
