// components/layout/AdminLayout.tsx
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

/**
 * Admin shell yang PWA-friendly:
 * - Menangkap event beforeinstallprompt (A2HS) -> tombol "Install App"
 * - Banner status offline/online
 * - Safe-area padding (iOS)
 * - Responsive: content dipush oleh sidebar fixed (ml-64)
 */
export default function AdminLayout({
  children,
  username,
  onLogout,
  profilePictureUrl, // optional: kalau Navbar kamu sudah support foto profil
}: {
  children: React.ReactNode;
  username: string;
  onLogout: () => void;
  profilePictureUrl?: string | null;
}) {
  // --- PWA: Add-to-Home-Screen (A2HS) ---
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // cegah mini-infobar Chrome
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
    try {
      await deferredPrompt.userChoice; // { outcome: "accepted" | "dismissed" }
    } finally {
      setDeferredPrompt(null);
      setCanInstall(false);
    }
  };

  // --- PWA: Online/Offline indicator ---
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
      {/* Sidebar fixed kiri (16rem) */}
      <Sidebar onLogout={onLogout} />

      {/* Shell konten: digeser ml-64 agar tidak tertutup sidebar */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Navbar (bisa melewatkan profilePictureUrl kalau ada) */}
        <Navbar username={username} onLogout={onLogout} profilePictureUrl={profilePictureUrl ?? undefined} />

        {/* Banner Offline (muncul hanya saat offline) */}
        {!online && (
          <div className="px-4 py-2 bg-amber-100 text-amber-800 text-sm border-y border-amber-200">
            Kamu sedang offline. Perubahan akan tersinkron ketika kembali online.
          </div>
        )}

        {/* Konten utama */}
        <main
          className="
            flex-1
            pb-4
            sm:pb-6
            md:pb-8
            /* Safe-area padding untuk iOS PWA */
            [padding-bottom:env(safe-area-inset-bottom)]
            supports-[padding:constant(safe-area-inset-bottom)]:[padding-bottom:constant(safe-area-inset-bottom)]
          "
        >
          {children}
        </main>
      </div>

      {/* Tombol Install App (floating) – tampil jika belum diinstall & event tersedia */}
      {canInstall && (
        <button
          onClick={handleInstall}
          className="
            fixed bottom-4 right-4 z-50
            rounded-full px-4 py-2
            bg-indigo-600 text-white shadow-lg
            hover:bg-indigo-700 active:scale-[0.98] transition
            [margin-bottom:env(safe-area-inset-bottom)]
            supports-[margin:constant(safe-area-inset-bottom)]:[margin-bottom:constant(safe-area-inset-bottom)]
          "
          aria-label="Install TrackCash"
        >
          Install App
        </button>
      )}
    </div>
  );
}
