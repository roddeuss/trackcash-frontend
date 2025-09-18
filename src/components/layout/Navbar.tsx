"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogOut, Moon, Sun, User, Download } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NotificationBell from "@/components/notifications/NotificationBell";

type Props = {
  username: string;
  profilePictureUrl?: string | null; // URL dari backend (profile_picture_url)
  onLogout: () => void;
};

export default function Navbar({ username, profilePictureUrl, onLogout }: Props) {
  // theme
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // initial avatar
  const initials = useMemo(() => {
    const parts = (username ?? "").trim().split(/\s+/);
    const head = (s: string) => (s ? s[0] : "");
    return (head(parts[0]) + head(parts[1] || "")).toUpperCase() || "U";
  }, [username]);

  const isDark = (mounted ? (resolvedTheme ?? theme) : "light") === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  // preview modal
  const [openPreview, setOpenPreview] = useState(false);
  const hasPicture = !!profilePictureUrl;

  // klik avatar: kalau ada foto ➜ buka preview; kalau tidak ➜ ke /profile
  const handleAvatarClick = () => {
    if (hasPicture) setOpenPreview(true);
    else window.location.href = "/profile";
  };

  // helper unduh file
  const handleDownload = () => {
    if (!profilePictureUrl) return;
    const a = document.createElement("a");
    a.href = profilePictureUrl;
    a.download = "profile-picture.jpg";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-white/80 dark:bg-neutral-900/70 backdrop-blur shadow-sm flex items-center justify-between px-6">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Welcome, {username} 🎉
        </h1>

        <div className="flex items-center gap-4">
          {/* Power Switch */}
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="group relative inline-flex items-center"
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className="w-14 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 shadow-inner relative"
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  background: isDark
                    ? "radial-gradient(16px 16px at 70% 50%, rgba(59,130,246,0.35), rgba(59,130,246,0) 70%)"
                    : "radial-gradient(16px 16px at 30% 50%, rgba(250,204,21,0.45), rgba(250,204,21,0) 70%)",
                }}
                transition={{ duration: 0.35 }}
              />
              <motion.div
                layout
                className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white dark:bg-neutral-900 shadow"
                animate={{ x: isDark ? 28 : 0, rotate: isDark ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <Sun
                  className={`w-4 h-4 ${isDark ? "opacity-40" : "opacity-100"} text-yellow-500 transition-opacity`}
                />
                <Moon
                  className={`w-4 h-4 ${isDark ? "opacity-100" : "opacity-40"} text-blue-400 transition-opacity`}
                />
              </div>
            </motion.div>
          </button>

          {/* Notification bell */}
          <NotificationBell />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-3 rounded-full pl-2 pr-3 py-1 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                onClick={handleAvatarClick}
                type="button"
              >
                <Avatar className="h-8 w-8">
                  {/* pakai URL backend langsung */}
                  {mounted && hasPicture ? (
                    <AvatarImage src={profilePictureUrl!} alt={username} />
                  ) : (
                    <AvatarImage src="" alt={username} />
                  )}
                  <AvatarFallback className="text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium text-neutral-800 dark:text-neutral-100">
                  {username}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="w-full cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Modal preview foto profil */}
      <Dialog open={openPreview} onOpenChange={setOpenPreview}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Foto Profil</DialogTitle>
          </DialogHeader>

          {hasPicture ? (
            <div className="space-y-4">
              <img
                src={profilePictureUrl!}
                alt="Foto Profil"
                className="w-full h-auto rounded-lg border dark:border-neutral-800"
              />

              <div className="flex justify-between">
                <Link href="/profile">
                  <Button variant="outline">Lihat / Ganti di Profile</Button>
                </Link>
                <Button onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Unduh
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-6 text-sm text-neutral-600 dark:text-neutral-300">
              Kamu belum mengunggah foto profil.{" "}
              <Link href="/profile" className="underline">
                Upload sekarang →
              </Link>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
