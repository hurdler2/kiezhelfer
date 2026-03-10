"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

export default function AdminAddCategoryForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ slug: "", nameKey: "", iconName: "", sortOrder: "0" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Hata"); return; }
      setForm({ slug: "", nameKey: "", iconName: "", sortOrder: "0" });
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        Yeni Kategori
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">Yeni Kategori Ekle</h3>
        <button type="button" onClick={() => { setOpen(false); setError(""); }}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Slug *</label>
          <input required value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            placeholder="ornek-kategori"
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-brand-400" />
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Name Key *</label>
          <input required value={form.nameKey} onChange={(e) => setForm((p) => ({ ...p, nameKey: e.target.value }))}
            placeholder="categories.ornekKategori"
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-brand-400" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Sıra</label>
          <input type="number" value={form.sortOrder} onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-brand-400" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Icon Name</label>
          <input value={form.iconName} onChange={(e) => setForm((p) => ({ ...p, iconName: e.target.value }))}
            placeholder="Wrench, Monitor…"
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-brand-400" />
        </div>
      </div>

      <p className="text-[11px] text-slate-400 mb-3">
        Name Key formatı: <code className="bg-slate-100 px-1 rounded">categories.camelCase</code> — çeviri dosyalarına da eklemeyi unutmayın.
      </p>

      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

      <button type="submit" disabled={loading}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors">
        <Plus className="h-3.5 w-3.5" />
        {loading ? "Ekleniyor…" : "Kategori Ekle"}
      </button>
    </form>
  );
}
