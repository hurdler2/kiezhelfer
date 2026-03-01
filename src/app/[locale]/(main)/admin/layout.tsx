import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, List, Star, LogOut, Wifi, Flag, MessageSquare } from "lucide-react";
import AdminNavLink from "./AdminNavLink";
import AdminLogoutButton from "@/app/admin/AdminLogoutButton";
import Image from "next/image";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";

export default async function AdminLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect(`/${params.locale}`);
  }

  const navItems = [
    { href: `/${params.locale}/admin`, label: "Dashboard", icon: LayoutDashboard },
    { href: `/${params.locale}/admin/users`, label: "Users", icon: Users },
    { href: `/${params.locale}/admin/listings`, label: "Listings", icon: List },
    { href: `/${params.locale}/admin/reviews`,  label: "Reviews",  icon: Star },
    { href: `/${params.locale}/admin/messages`, label: "Mesajlar", icon: MessageSquare },
    { href: `/${params.locale}/admin/activity`, label: "Aktivite", icon: Wifi },
    { href: `/${params.locale}/admin/reports`, label: "Şikayetler", icon: Flag },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <Image src="/logo.png" alt="KiezHelfer" width={36} height={36} className="rounded-lg mix-blend-multiply brightness-200" />
          <div>
            <p className="font-bold text-sm">KiezHelfer</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <AdminNavLink key={item.href} href={item.href}>
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
            </AdminNavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          <Link
            href={`/${params.locale}`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Siteye Dön
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
          <p className="text-sm text-gray-500">
            Logged in as: <span className="font-medium text-gray-900">{session.user.email}</span>
          </p>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full border border-brand-100">
              ADMIN
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
