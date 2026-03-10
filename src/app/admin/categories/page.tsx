import { prisma } from "@/lib/prisma";
import AdminAddCategoryForm from "./AdminAddCategoryForm";
import AdminCategoryRow from "./AdminCategoryRow";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { listings: true } } },
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Kategoriler</h1>
          <p className="text-sm text-slate-500 mt-0.5">{categories.length} kategori</p>
        </div>
        <AdminAddCategoryForm />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Slug</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">İsim / Key</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Icon</th>
              <th className="text-center px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Sıra</th>
              <th className="text-center px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">İlan</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <AdminCategoryRow key={cat.id} cat={cat} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
