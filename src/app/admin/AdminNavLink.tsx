"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminNavLink({ href, icon, children }: Props) {
  const pathname = usePathname();
  const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
        isActive
          ? "bg-brand-500/15 text-brand-400"
          : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
      }`}
    >
      <span className={`shrink-0 transition-colors ${isActive ? "text-brand-400" : "text-slate-500 group-hover:text-slate-300"}`}>
        {icon}
      </span>
      <span className="flex-1">{children}</span>
      {isActive && (
        <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" />
      )}
    </Link>
  );
}
