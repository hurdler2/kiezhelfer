"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Profile } from "@prisma/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { BERLIN_DISTRICTS } from "@/types";
import { Upload } from "lucide-react";

interface Props {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    profile: Profile | null;
  };
}

interface FormValues {
  name: string;
  bio: string;
  phone: string;
  district: string;
  skillTags: string;
}

export default function ProfileEditForm({ user }: Props) {
  const tp = useTranslations("profile");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.profile?.avatarUrl ?? user.image ?? "");
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      name: user.name ?? "",
      bio: user.profile?.bio ?? "",
      phone: user.profile?.phone ?? "",
      district: user.profile?.district ?? "",
      skillTags: (user.profile?.skillTags ?? []).join(", "),
    },
  });

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setAvatarUrl(data.url);
    } catch {
      setError(tp("uploadError"));
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: FormValues) {
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          bio: data.bio,
          phone: data.phone,
          district: data.district || null,
          avatarUrl: avatarUrl || null,
          skillTags: data.skillTags
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) {
        const result = await res.json();
        setError(result.error);
        return;
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError(tp("networkError"));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <Avatar src={avatarUrl || null} name={user.name} size="xl" />
        <div>
          <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload className="h-4 w-4" />
            {uploading ? tp("uploading") : tp("uploadAvatar")}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
          </label>
          <p className="text-xs text-gray-400 mt-1">{tp("avatarHint")}</p>
        </div>
      </div>

      <Input
        id="name"
        label={tp("name")}
        {...register("name")}
      />

      <Input
        id="email"
        label={tp("email")}
        value={user.email}
        disabled
        className="bg-gray-50"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{tp("bio")}</label>
        <textarea
          rows={4}
          placeholder={tp("bioPlaceholder")}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          {...register("bio")}
        />
      </div>

      <Input
        id="phone"
        label={tp("phone")}
        type="tel"
        placeholder="+49 ..."
        {...register("phone")}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{tp("district")}</label>
        <select
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-brand-500 focus:outline-none"
          {...register("district")}
        >
          <option value="">{tp("selectDistrict")}</option>
          {BERLIN_DISTRICTS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      <Input
        id="skillTags"
        label={tp("skillsLabel")}
        placeholder={tp("skillsPlaceholder")}
        {...register("skillTags")}
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          {tp("saveSuccess")}
        </div>
      )}

      <Button type="submit" loading={isSubmitting}>
        {tp("saveChanges")}
      </Button>
    </form>
  );
}
