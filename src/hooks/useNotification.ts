"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { API_URL } from "@/lib/api";

export type Severity = "info" | "success" | "warning" | "error";

export interface AppNotification {
  id: number;
  type: string;                       // e.g. "transaction_created", "budget_threshold"
  severity: Severity;
  title: string;
  message?: string | null;
  action_url?: string | null;
  data?: Record<string, any> | null;
  read_at?: string | null;
  created_at?: string;
  updated_at?: string;
  is_read?: boolean;                  // accessor dari backend
}

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  } as HeadersInit;
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export function useNotification() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);       // dropdown open state (opsional, dipakai di bell)
  const mounted = useRef(false);

  const unreadCount = useMemo(
    () => items.reduce((acc, n) => acc + (n.is_read ? 0 : 1), 0),
    [items]
  );

  // GET /notifications (opsi only=unread|all)
  const fetchNotifications = async (only: "all" | "unread" = "all") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/notifications?only=${only}`, {
        headers: getAuthHeaders(),
        cache: "no-store",
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to fetch notifications");
      }
      const json = await res.json();
      const data = Array.isArray(json) ? json : json?.data;
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch notifications error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // PATCH /notifications/{id}/read
  const markAsRead = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to mark as read");
      }
      setItems(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      );
    } catch (err) {
      console.error("Mark as read error:", err);
      throw err;
    }
  };

  // POST /notifications/mark-all-read
  const markAllAsRead = async () => {
    try {
      const res = await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to mark all as read");
      }
      setItems(prev => prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
    } catch (err) {
      console.error("Mark all as read error:", err);
      throw err;
    }
  };

  // optional: polling ringan saat dropdown kebuka
  useEffect(() => {
    mounted.current = true;
    fetchNotifications("all");
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // optional: refresh ketika dropdown dibuka
  const onOpenChange = (v: boolean) => {
    setOpen(v);
    if (v) fetchNotifications("all");
  };

  return {
    items,
    unreadCount,
    loading,
    error,
    open,
    onOpenChange,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    setItems, // exposed kalau mau local optimistik opsional
  };
}
