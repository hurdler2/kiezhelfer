"use client";

import AdminCategoryActions from "./AdminCategoryActions";

interface Category {
  id: string;
  slug: string;
  nameKey: string;
  iconName: string | null;
  sortOrder: number;
  _count: { listings: number };
}

const LABEL_MAP: Record<string, string> = {
  "reparaturen-montage": "Kleine Reparaturen & Montageservice",
  "technik-computer": "Technik & Computerhilfe",
  "alltag-nachbarschaft": "Alltags & Nachbarschaftshilfe",
  "garten-outdoor": "Garten & Outdoor-Hilfe",
  "transport-kurier": "Transport & Kurierhilfe",
};

export default function AdminCategoryRow({ cat }: { cat: Category }) {
  const displayName = LABEL_MAP[cat.slug] ?? cat.nameKey.replace("categories.", "");
  const flatCat = { ...cat, listingCount: cat._count.listings };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-5 py-3.5">
        <span className="font-mono text-[12px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{cat.slug}</span>
      </td>
      <td className="px-5 py-3.5">
        <p className="text-[13px] font-medium text-slate-800">{displayName}</p>
        <p className="text-[11px] text-slate-400 font-mono">{cat.nameKey}</p>
      </td>
      <td className="px-5 py-3.5">
        <span className="text-[12px] text-slate-500">{cat.iconName ?? "—"}</span>
      </td>
      <td className="px-5 py-3.5 text-center">
        <span className="text-[13px] font-semibold text-slate-600">{cat.sortOrder}</span>
      </td>
      <td className="px-5 py-3.5 text-center">
        <span className={`text-[13px] font-semibold ${cat._count.listings > 0 ? "text-brand-600" : "text-slate-400"}`}>
          {cat._count.listings}
        </span>
      </td>
      <AdminCategoryActions cat={flatCat} />
    </tr>
  );
}
