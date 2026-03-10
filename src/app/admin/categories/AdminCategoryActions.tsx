"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X, Check } from "lucide-react";

interface Category {
  id: string;
  slug: string;
  nameKey: string;
  iconName: string | null;
  sortOrder: number;
  listingCount: number;
}

export default function AdminCategoryActions({ cat }: { cat: Category }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    slug: cat.slug,
    nameKey: cat.nameKey,
    iconName: cat.iconName ?? "",
    sortOrder: cat.sortOrder,
  });

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sortOrder: Number(form.sortOrder),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Hata"); return; }
      setEditing(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`"${cat.slug}" kategorisini silmek istediğinize emin misiniz?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { alert(data.error ?? "Silinemedi"); return; }
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <td colSpan={5} className="px-5 py-3.5 bg-slate-50">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-brand-400"
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[200px]">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Name Key</label>
            <input
              value={form.nameKey}
              onChange={(e) => setForm((p) => ({ ...p, nameKey: e.target.value }))}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-brand-400"
            />
          </div>
          <div className="flex flex-col gap-1 w-[120px]">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Icon Name</label>
            <input
              value={form.iconName}
              onChange={(e) => setForm((p) => ({ ...p, iconName: e.target.value }))}
              placeholder="Wrench, Monitor…"
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-brand-400"
            />
          </div>
          <div className="flex flex-col gap-1 w-[80px]">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Sıra</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-brand-400"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg disabled:opacity-60"
            >
              <Check className="h-3 w-3" />
              {loading ? "Kaydediliyor…" : "Kaydet"}
            </button>
            <button
              onClick={() => { setEditing(false); setError(""); }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg"
            >
              <X className="h-3 w-3" />
              İptal
            </button>
          </div>
        </div>
      </td>
    );
  }

  return (
    <td className="px-5 py-3.5">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Pencil className="h-3 w-3" />
          Düzenle
        </button>
        <button
          onClick={handleDelete}
          disabled={cat.listingCount > 0 || loading}
          title={cat.listingCount > 0 ? `${cat.listingCount} ilan var, silinemez` : "Sil"}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-3 w-3" />
          Sil
        </button>
      </div>
    </td>
  );
}
