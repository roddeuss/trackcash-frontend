"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogIn, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
    return (
        <div className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-950">
            {/* Decorative blobs */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-500/20"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.5, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/20"
            />

            <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-14">
                {/* Card */}
                <motion.div
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/80 shadow-xl backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/70"
                >
                    <div className="grid gap-0 md:grid-cols-2">
                        {/* Illustration (SVG inline, no extra file needed) */}
                        <div className="relative hidden md:block">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <LockIllustration />
                            </div>
                            <div className="aspect-[4/3] w-full opacity-0" />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col justify-center p-8 md:p-12">
                            <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/70 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:border-amber-400/30 dark:bg-amber-900/20 dark:text-amber-300">
                                🚫 Akses dibatasi
                            </span>

                            <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                                Anda belum login
                            </h1>
                            <p className="mb-6 text-neutral-600 dark:text-neutral-300">
                                Untuk mengakses halaman ini, silakan login terlebih dahulu dengan akun
                                TrackCash Anda. Jika belum punya akun, Anda dapat mendaftar secara gratis.
                            </p>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link href="/login">
                                    <Button className="w-full sm:w-auto">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Login Sekarang
                                    </Button>
                                </Link>
                                <Link href="/">
                                    <Button variant="outline" className="w-full sm:w-auto">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Kembali ke Beranda
                                    </Button>
                                </Link>
                            </div>

                            {/* Tips */}
                            <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-300">
                                Tips: Jika Anda sering menggunakan TrackCash di HP, tambahkan sebagai
                                aplikasi (PWA) melalui menu “Add to Home Screen”.
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer small print */}
                <p className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
                    Perlu bantuan? Hubungi support kami.
                </p>
            </div>
        </div>
    );
}

/** Simple lock illustration (inline SVG) — no external asset needed */
function LockIllustration() {
    return (
        <svg
            width="440"
            height="330"
            viewBox="0 0 440 330"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-2xl"
        >
            <defs>
                <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
                <linearGradient id="g2" x1="0" x2="1">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
            </defs>
            {/* background circle */}
            <circle cx="220" cy="165" r="140" fill="url(#g2)" opacity="0.15" />
            {/* lock body */}
            <rect x="135" y="150" rx="18" width="170" height="120" fill="url(#g1)" opacity="0.9" />
            {/* keyhole */}
            <circle cx="220" cy="210" r="16" fill="#fff" opacity="0.9" />
            <rect x="214" y="210" width="12" height="30" rx="6" fill="#fff" opacity="0.9" />
            {/* shackle */}
            <path
                d="M165 150v-22c0-32 25-58 55-58s55 26 55 58v22"
                fill="none"
                stroke="url(#g1)"
                strokeWidth="18"
                strokeLinecap="round"
                opacity="0.9"
            />
        </svg>
    );
}
