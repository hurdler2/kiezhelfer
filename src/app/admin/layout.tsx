import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Users, List, Star, LogOut,
  Wifi, Flag, MessageSquare, ArrowUpRight,
} from "lucide-react";
import AdminNavLink from "./AdminNavLink";
import AdminLogoutButton from "./AdminLogoutButton";
import Image from "next/image";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/admin-login");
  }

  const navItems = [
    { href: "/admin",          label: "Dashboard",  icon: LayoutDashboard },
    { href: "/admin/users",    label: "Kullanıcılar", icon: Users },
    { href: "/admin/listings", label: "İlanlar",    icon: List },
    { href: "/admin/reviews",  label: "Yorumlar",   icon: Star },
    { href: "/admin/messages", label: "Mesajlar",   icon: MessageSquare },
    { href: "/admin/activity", label: "Aktivite",   icon: Wifi },
    { href: "/admin/reports",  label: "Şikayetler", icon: Flag },
  ];

  const userEmail = session.user.email ?? "";
  const initials = session.user.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : userEmail[0]?.toUpperCase() ?? "A";

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── Sidebar ── */}
      <aside className="w-[240px] shrink-0 flex flex-col bg-[#0f1623] border-r border-white/5">

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/5">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500 shadow-lg shadow-brand-500/30">
            <Image src="/logo.png" alt="KiezHelfer" width={24} height={24} className="rounded-md brightness-200" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white tracking-tight truncate">KiezHelfer</p>
            <p className="text-[11px] text-slate-500 font-medium">Admin Paneli</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Yönetim
          </p>
          {navItems.map((item) => (
            <AdminNavLink key={item.href} href={item.href} icon={<item.icon className="h-4 w-4" />}>
              {item.label}
            </AdminNavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 border-t border-white/5 pt-3 space-y-0.5">
          <Link
            href="/de"
            className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
          >
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            Siteye Dön
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
          <div />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-slate-800">{session.user.name ?? userEmail}</p>
              <p className="text-[11px] text-slate-400">{userEmail}</p>
            </div>
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-bold rounded-md border border-brand-100 uppercase tracking-wide">
              Admin
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
