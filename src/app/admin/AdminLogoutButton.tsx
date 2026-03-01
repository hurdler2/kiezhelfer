"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function AdminLogoutButton() {
  return (
    <button
      onClick={async () => { await signOut({ redirect: false }); window.location.href = "/de"; }}
      className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
    >
      <LogOut className="h-4 w-4" />
      Çıkış Yap
    </button>
  );
}
