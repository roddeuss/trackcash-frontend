"use client";

import { Bell, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/useNotification";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils"; // kalau kamu punya helper cn, kalau tidak hapus dan pakai className biasa

export default function NotificationBell() {
  const router = useRouter();
  const {
    items,
    unreadCount,
    loading,
    error,
    open,
    onOpenChange,
    markAsRead,
    markAllAsRead,
  } = useNotification();

  const handleItemClick = async (id: number, actionUrl?: string | null) => {
    try {
      await markAsRead(id);
    } catch {}
    if (actionUrl) {
      // bisa pakai router.push agar SPA
      router.push(actionUrl);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
          type="button"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[380px] p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-1" />
              Mark all read
            </Button>
          </div>
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {loading && (
            <div className="p-4 text-sm text-neutral-500">Loading…</div>
          )}
          {error && (
            <div className="p-4 text-sm text-red-600">Error: {error}</div>
          )}
          {!loading && !error && items.length === 0 && (
            <div className="p-6 text-sm text-neutral-500 text-center">
              No notifications
            </div>
          )}

          {!loading && !error && items.map((n) => {
            const sev =
              n.severity === "error"
                ? "border-red-200/60 bg-red-50 dark:border-red-900/40 dark:bg-red-950/30"
                : n.severity === "warning"
                ? "border-amber-200/70 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/30"
                : n.severity === "success"
                ? "border-emerald-200/60 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/30"
                : "border-neutral-200/60 bg-white dark:border-neutral-800 dark:bg-neutral-900";

            return (
              <button
                key={n.id}
                onClick={() => handleItemClick(n.id, n.action_url ?? undefined)}
                className={cn(
                  "w-full text-left px-4 py-3 border-b dark:border-neutral-800 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/70 transition",
                  !n.is_read ? "opacity-100" : "opacity-80"
                )}
                type="button"
              >
                <div className={cn("p-3 rounded-lg border", sev)}>
                  <div className="flex items-start gap-2">
                    {!n.is_read && (
                      <span className="mt-1 inline-block w-2 h-2 rounded-full bg-blue-500" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{n.title}</div>
                      {n.message && (
                        <div className="text-xs mt-1 text-neutral-600 dark:text-neutral-300">
                          {n.message}
                        </div>
                      )}
                      {n.action_url && (
                        <div className="mt-2 inline-flex items-center text-xs text-indigo-600 hover:underline">
                          <ExternalLink className="w-3.5 h-3.5 mr-1" />
                          Open detail
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-4 py-2 border-t dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-right">
          <Link href="/notifications" className="text-xs text-indigo-600 hover:underline">
            View all notifications →
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
