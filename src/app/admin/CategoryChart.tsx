"use client";

export type CategoryDataPoint = {
  name: string;
  count: number;
};

const COLORS = [
  "bg-brand-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-indigo-500",
];

export default function CategoryChart({ data }: { data: CategoryDataPoint[] }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;

  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const pct = Math.round((d.count / total) * 100);
        return (
          <div key={d.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-700 font-medium capitalize">{d.name}</span>
              <span className="text-xs text-gray-400">{d.count} ilan ({pct}%)</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${COLORS[i % COLORS.length]} rounded-full transition-all`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
      {data.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">Veri yok</p>
      )}
    </div>
  );
}
