// components/layout/AdminLayout.tsx
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

import {
  Home,
  DollarSign,
  PieChart,
  User,
  Menu as MenuIcon,
  Database,
  Landmark,
  Tags,
  Wallet,
  Repeat,
  Settings,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// 👉 Master menu untuk mobile drawer
const mobileMenuGroups = [
  {
    title: "Home",
    items: [{ name: "Dashboard", href: "/dashboard", icon: Home }],
  },
  {
    title: "Master Data",
    items: [
      { name: "Asset", href: "/assets", icon: Database },
      { name: "Bank", href: "/banks", icon: Landmark },
      { name: "Category", href: "/categories", icon: Tags },
      { name: "Type", href: "/types", icon: Tags },
    ],
  },
  {
    title: "Transactions",
    items: [
      { name: "Transaction", href: "/transactions", icon: DollarSign },
      { name: "Investment", href: "/investments", icon: PieChart },
      { name: "Recurring", href: "/recurring-transactions", icon: Repeat },
    ],
  },
  {
    title: "Budgeting",
    items: [{ name: "Budgets", href: "/budgets", icon: Wallet }],
  },
  {
    title: "Reports",
    items: [{ name: "Laporan", href: "/reports", icon: PieChart }],
  },
  {
    title: "Profile",
    items: [{ name: "Profile", href: "/profile", icon: User }],
  },
  {
    title: "Settings",
    items: [{ name: "Settings", href: "/settings", icon: Settings }],
  },
];

export default function AdminLayout({
  children,
  username,
  onLogout,
  profilePictureUrl,
}: {
  children: React.ReactNode;
  username: string;
  onLogout: () => void;
  profilePictureUrl?: string | null;
}) {
  // Optional: status online, kalau mau bikin banner
  const [online, setOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* Sidebar desktop */}
      <Sidebar onLogout={onLogout} />

      {/* Konten utama: di desktop geser karena ada sidebar, di mobile full width */}
      <div className="ml-0 md:ml-64 flex flex-col min-h-screen">
        <Navbar
          username={username}
          onLogout={onLogout}
          profilePictureUrl={profilePictureUrl ?? undefined}
        />

        {!online && (
          <div className="px-4 py-2 bg-amber-100 text-amber-800 text-sm border-y border-amber-200">
            Kamu sedang offline. Perubahan akan tersinkron ketika kembali online.
          </div>
        )}

        <main
          className="
            flex-1
            px-4 sm:px-6
            pt-4 sm:pt-6
            pb-20 md:pb-8
            [padding-bottom:env(safe-area-inset-bottom)]
            supports-[padding:constant(safe-area-inset-bottom)]:[padding-bottom:constant(safe-area-inset-bottom)]
          "
        >
          {children}
        </main>

        {/* ⬇️ Bottom nav mobile + Menu drawer */}
        <nav
          className="
            md:hidden
            fixed bottom-0 left-0 right-0 z-40
            h-14
            border-t border-neutral-200 dark:border-neutral-800
            bg-white/90 dark:bg-neutral-950/90
            backdrop-blur
            flex items-center justify-around
            [padding-bottom:env(safe-area-inset-bottom)]
            supports-[padding:constant(safe-area-inset-bottom)]:[padding-bottom:constant(safe-area-inset-bottom)]
          "
        >
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center text-xs text-neutral-600 dark:text-neutral-300"
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>Home</span>
          </Link>

          <Link
            href="/transactions"
            className="flex flex-col items-center justify-center text-xs text-neutral-600 dark:text-neutral-300"
          >
            <DollarSign className="w-5 h-5 mb-0.5" />
            <span>Transaksi</span>
          </Link>

          <Link
            href="/reports"
            className="flex flex-col items-center justify-center text-xs text-neutral-600 dark:text-neutral-300"
          >
            <PieChart className="w-5 h-5 mb-0.5" />
            <span>Laporan</span>
          </Link>

          <Link
            href="/profile"
            className="flex flex-col items-center justify-center text-xs text-neutral-600 dark:text-neutral-300"
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>Profile</span>
          </Link>

          {/* 🔥 Tombol Menu (drawer) */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center text-xs text-neutral-600 dark:text-neutral-300">
                <MenuIcon className="w-5 h-5 mb-0.5" />
                <span>Menu</span>
              </button>
            </SheetTrigger>

            <SheetContent side="bottom" className="h-[70vh] p-4">
              <SheetHeader>
                <SheetTitle className="text-left">Menu TrackCash</SheetTitle>
              </SheetHeader>

              <div className="mt-4 space-y-4 overflow-y-auto max-h-[calc(70vh-3rem)]">
                {mobileMenuGroups.map((group) => (
                  <div key={group.title}>
                    <p className="text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                      {group.title}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {group.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </div>
  );
}
