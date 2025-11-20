"use client";

import Link from "next/link";
import {
  Home,
  Database,
  Landmark,
  Tags,
  DollarSign,
  PieChart,
  User,
  Settings,
  LogOut,
  Wallet,
  Smartphone,
  WifiOff,
  Repeat,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const menuGroups = [
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

export default function Sidebar({ onLogout }: { onLogout: () => void }) {
  const router = useRouter();

  // --- PWA Install handling ---
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setCanInstall(false);
  };

  // --- Offline indicator ---
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // --- Logout confirm dialog state ---
  const [openConfirm, setOpenConfirm] = useState(false);

  const confirmLogout = async () => {
    try {
      await onLogout();
    } finally {
      router.replace("/login");
    }
  };

  return (
    <>
      <aside
        className={`
          hidden md:flex md:flex-col   /* ⬅️ hide di mobile, flex di md+ */
          w-64
          fixed left-0 top-0
          bg-white dark:bg-neutral-900
          border-r border-neutral-200 dark:border-neutral-800
          shadow-sm
          pt-[env(safe-area-inset-top)]
          pb-[env(safe-area-inset-bottom)]
          h-[100dvh]
        `}
      >
        {/* Brand */}
        <div className="px-6 py-4 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          TrackCash 💰
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.title} className="mb-4">
              <p className="px-2 text-[11px] tracking-wide font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                {group.title}
              </p>
              <div className="flex flex-col space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg
                               text-gray-700 dark:text-gray-200
                               hover:bg-indigo-100 hover:text-indigo-700
                               dark:hover:bg-neutral-800 dark:hover:text-white
                               transition"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer (Install + Offline + Logout) */}
        <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
          {!online && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 px-3 py-2 rounded-md">
              <WifiOff className="w-4 h-4" />
              <span>Kamu sedang offline</span>
            </div>
          )}

          {canInstall && (
            <Button onClick={handleInstall} variant="secondary" className="w-full justify-center">
              <Smartphone className="w-4 h-4 mr-2" />
              Install App
            </Button>
          )}

          <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full justify-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Keluar dari akun?</AlertDialogTitle>
                <AlertDialogDescription>
                  Kamu akan keluar dari aplikasi. Lanjutkan?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={confirmLogout}>
                  Ya, Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>
    </>
  );
}
