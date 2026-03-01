"use client";

export type DailyDataPoint = {
  day: string;
  users: number;
  listings: number;
};

const BAR_MAX_H = 120;

export default function DailyChart({ data }: { data: DailyDataPoint[] }) {
  const maxVal = Math.max(...data.flatMap((d) => [d.users, d.listings]), 1);

  return (
    <div>
      <div className="flex items-center gap-4 mb-4 px-1">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-blue-400" />
          <span className="text-xs text-gray-500">Kullanıcı</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-brand-400" />
          <span className="text-xs text-gray-500">İlan</span>
        </div>
      </div>
      <div className="flex items-end gap-2" style={{ height: BAR_MAX_H + 36 }}>
        {data.map((d, i) => {
          const uH = Math.max(Math.round((d.users / maxVal) * BAR_MAX_H), d.users > 0 ? 4 : 0);
          const lH = Math.max(Math.round((d.listings / maxVal) * BAR_MAX_H), d.listings > 0 ? 4 : 0);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="flex items-end gap-0.5 w-full" style={{ height: BAR_MAX_H }}>
                <div className="flex-1 relative group">
                  <div className="w-full bg-blue-400 rounded-t transition-all" style={{ height: uH }} />
                  {d.users > 0 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                      {d.users} kullanıcı
                    </div>
                  )}
                </div>
                <div className="flex-1 relative group">
                  <div className="w-full bg-brand-400 rounded-t transition-all" style={{ height: lH }} />
                  {d.listings > 0 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                      {d.listings} ilan
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-gray-400 leading-none">{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
