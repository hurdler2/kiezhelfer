"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function AdminNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group ${
        isActive
          ? "bg-gray-800 text-white"
          : "text-gray-300 hover:text-white hover:bg-gray-800"
      }`}
    >
      {children}
      <ChevronRight
        className={`h-3 w-3 ml-auto transition-opacity ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      />
    </Link>
  );
}
