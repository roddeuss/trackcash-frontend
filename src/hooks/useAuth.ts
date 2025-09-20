// hooks/useAuth.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  // ...tambahkan field lain sesuai /user
}

export function useAuth() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true); // ⬅️ penting untuk cegah flicker
  const [loading, setLoading] = useState(false);

  const safeGetToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const parseUser = async (res: Response): Promise<User | null> => {
    try {
      const json = await res.json();
      // backend kamu sering return { data: {...} }
      if (json && typeof json === "object") {
        if ("data" in json) return json.data as User;
        return json as User;
      }
    } catch (_) {}
    return null;
  };

  const fetchUser = useCallback(async () => {
    const token = safeGetToken();
    if (!token) {
      setUser(null);
      setInitializing(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Unauthorized");

      const u = await parseUser(res);
      if (!u) throw new Error("Invalid user payload");
      setUser(u);
    } catch {
      // token invalid/expired
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    const token = safeGetToken();
    try {
      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        }).catch(() => {});
      }
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      // langsung redirect supaya tidak sempat render Unauthorized
      router.replace("/login");
    }
  }, [router]);

  const isAuthenticated = !!user;

  return {
    user,
    loading,        // loading request /user
    initializing,   // inisialisasi awal (cek token) — gunakan ini untuk cegah flicker
    isAuthenticated,
    fetchUser,      // opsional: panggil ulang setelah update profil
    logout,
  };
}
