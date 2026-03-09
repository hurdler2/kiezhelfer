"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X, MessageCircle, Plus, LayoutDashboard, User, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import Avatar from "@/components/ui/Avatar";
import LocaleSwitcher from "./LocaleSwitcher";
import EmailVerificationBanner from "./EmailVerificationBanner";

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
  const t = useTranslations("nav");
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!transparent) return;
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparent]);

  const glass = transparent && !scrolled;

  const navLinks = [
    { href: "/listings" as const, label: t("listings") },
    { href: "/map" as const, label: t("map") },
    { href: "/about" as const, label: t("about") },
  ];

  return (
    <nav className={`${transparent ? "fixed" : "sticky"} top-0 left-0 right-0 z-50 transition-all duration-300 ${
      glass
        ? "bg-transparent border-transparent shadow-none"
        : "bg-white border-b border-gray-200 shadow-sm"
    }`}>
      <EmailVerificationBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Image
              src="/logolast2.png"
              alt="KiezHelfer"
              width={220}
              height={220}
              className="object-contain h-20 w-auto"
            />
            <div className="flex flex-col leading-none">
              <span className={`text-xl font-extrabold tracking-tight ${glass ? "text-white" : "text-gray-900"}`}>
                Kiez<span className="text-brand-500">Helfer</span>
              </span>
              <span className={`text-[10px] font-medium tracking-widest uppercase mt-0.5 ${glass ? "text-white/60" : "text-gray-400"}`}>
                Berlin
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors pb-0.5 ${
                  pathname.startsWith("/" + link.href.replace("/", ""))
                    ? glass
                      ? "text-white border-b-2 border-white"
                      : "text-brand-500 border-b-2 border-brand-500"
                    : glass
                      ? "text-white/80 hover:text-white"
                      : "text-gray-700 hover:text-brand-500"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <LocaleSwitcher />

            {session?.user ? (
              <>
                {/* Yeni ilan butonu */}
                <Link
                  href="/listings/new"
                  className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  {t("newListing")}
                </Link>

                {/* Mesajlar */}
                <Link
                  href="/messages"
                  className={`p-2 transition-colors rounded-lg ${
                    glass
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-gray-500 hover:text-brand-500 hover:bg-gray-50"
                  }`}
                >
                  <MessageCircle className="h-5 w-5" />
                </Link>

                {/* Kullanıcı menüsü */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                      glass
                        ? "border-white/30 hover:border-white/60 bg-white/10 hover:bg-white/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <Avatar src={session.user.image} name={session.user.name} size="sm" />
                    <span className={`hidden sm:block text-sm font-medium max-w-[100px] truncate ${glass ? "text-white" : "text-gray-700"}`}>
                      {session.user.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${userMenuOpen ? "rotate-180" : ""} ${glass ? "text-white/70" : "text-gray-400"}`} />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                        <div className="px-4 py-2.5 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900 truncate">{session.user.name}</p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">{session.user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-gray-400" />
                          {t("dashboard")}
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-colors"
                        >
                          <User className="h-4 w-4 text-gray-400" />
                          {t("profile")}
                        </Link>
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={async () => { await signOut({ redirect: false }); window.location.href = "/"; }}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            {t("logout")}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={`text-sm font-semibold transition-colors px-3 py-2 ${
                    glass ? "text-white/80 hover:text-white" : "text-gray-700 hover:text-brand-500"
                  }`}
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors shadow-sm"
                >
                  {t("register")}
                </Link>
              </div>
            )}

            {/* Mobil menü butonu */}
            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${
                glass
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menü */}
      {mobileOpen && (
        <div className={`md:hidden border-t ${
          glass
            ? "border-white/10 bg-slate-900/90 backdrop-blur-sm"
            : "border-gray-100 bg-white"
        }`}>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  glass
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-gray-700 hover:text-brand-500 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {session?.user ? (
              <Link
                href="/listings/new"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-white bg-brand-500 rounded-lg"
              >
                <Plus className="h-4 w-4" />
                {t("newListing")}
              </Link>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className={`flex-1 text-center py-2.5 text-sm font-medium border rounded-lg ${
                    glass ? "border-white/30 text-white" : "border-gray-200 text-gray-700"
                  }`}
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 text-sm font-semibold bg-brand-500 text-white rounded-lg"
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
