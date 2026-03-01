"use client";

import { useEffect, useState, useCallback } from "react";
import { Wifi, RefreshCw, MapPin, Globe, Clock, User, LogIn, Calendar, TrendingUp } from "lucide-react";

interface OnlineUser {
  userId: string; name: string; email: string; role: string;
  district: string; ip: string; pathname: string; lastSeen: string;
}
interface LoginStats {
  daily: number; monthly: number; yearly: number;
  last30Days: { day: string; count: number }[];
}

function timeAgo(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return `${secs}s önce`;
  return `${Math.floor(secs / 60)}dk önce`;
}

export default function AdminActivityPage() {
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [total, setTotal] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<LoginStats | null>(null);

  const fetchOnline = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/online");
      if (res.ok) { const data = await res.json(); setUsers(data.users); setTotal(data.total); setLastRefresh(new Date()); }
    } finally { setLoading(false); }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/login-stats");
      if (res.ok) setStats(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    fetchOnline(); fetchStats();
    const i1 = setInterval(fetchOnline, 10_000);
    const i2 = setInterval(fetchStats, 60_000);
    return () => { clearInterval(i1); clearInterval(i2); };
  }, [fetchOnline, fetchStats]);

  const maxDay = stats ? Math.max(...stats.last30Days.map((d) => d.count), 1) : 1;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Canlı Aktivite</h1>
          <p className="text-sm text-gray-500 mt-1">Anlık kullanıcı takibi ve giriş istatistikleri</p>
        </div>
        <button onClick={() => { fetchOnline(); fetchStats(); }} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Yenile
        </button>
      </div>

      {/* Giriş İstatistikleri */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <LogIn className="h-4 w-4" /> Giriş İstatistikleri
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-brand-100 p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <LogIn className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats?.daily ?? "—"}</p>
              <p className="text-xs text-gray-500 mt-0.5">Bugün</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-blue-100 p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats?.monthly ?? "—"}</p>
              <p className="text-xs text-gray-500 mt-0.5">Bu Ay</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-purple-100 p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats?.yearly ?? "—"}</p>
              <p className="text-xs text-gray-500 mt-0.5">Bu Yıl</p>
            </div>
          </div>
        </div>
      </div>

      {/* Son 30 Gün Grafiği */}
      {stats && stats.last30Days.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Son 30 Gün — Günlük Girişler</h2>
          <div className="flex items-end gap-1 h-24">
            {stats.last30Days.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="w-full bg-brand-500 hover:bg-brand-600 rounded-sm transition-all cursor-default" style={{ height: `${Math.max((d.count / maxDay) * 80, 4)}px` }} />
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {d.day}: {d.count}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-gray-400">{stats.last30Days[0]?.day}</span>
            <span className="text-[10px] text-gray-400">{stats.last30Days[stats.last30Days.length - 1]?.day}</span>
          </div>
        </div>
      )}

      {/* Çevrimiçi Kullanıcılar */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Wifi className="h-4 w-4" /> Çevrimiçi Kullanıcılar
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl border border-green-100 p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <Wifi className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{total}</p>
              <p className="text-xs text-gray-500 mt-0.5">Çevrimiçi Kullanıcı</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{lastRefresh ? lastRefresh.toLocaleTimeString("tr-TR") : "—"}</p>
              <p className="text-xs text-gray-500 mt-0.5">Son güncelleme · 10s otomatik</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {users.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">{loading ? "Yükleniyor..." : "Şu an aktif kullanıcı yok"}</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium"><User className="h-3.5 w-3.5 inline mr-1" />Kullanıcı</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium"><MapPin className="h-3.5 w-3.5 inline mr-1" />İlçe</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium"><Globe className="h-3.5 w-3.5 inline mr-1" />IP Adresi</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Sayfa</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium"><Clock className="h-3.5 w-3.5 inline mr-1" />Son Görülme</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.userId} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                      {u.role === "ADMIN" && <span className="text-[10px] px-1.5 py-0.5 bg-brand-100 text-brand-700 rounded font-medium">ADMIN</span>}
                    </td>
                    <td className="px-5 py-3 text-gray-600 text-xs">{u.district}</td>
                    <td className="px-5 py-3"><code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-mono">{u.ip}</code></td>
                    <td className="px-5 py-3 text-gray-500 text-xs max-w-[200px] truncate font-mono">{u.pathname}</td>
                    <td className="px-5 py-3"><span className="inline-flex items-center gap-1 text-xs text-green-700"><span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />{timeAgo(u.lastSeen)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
