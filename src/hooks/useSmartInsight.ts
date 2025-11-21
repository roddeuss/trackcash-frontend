// src/hooks/useSmartInsight.ts
"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export interface SmartInsight {
  has_change: boolean;
  current: number;
  previous: number;
  percent_change: number;
  direction: "up" | "down" | "flat";
  message: string | null;
}

function getErr(e: unknown) {
  return e instanceof Error ? e.message : String(e);
}

export function useSmartInsight() {
  const [insight, setInsight] = useState<SmartInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchInsight = async () => {
      setLoading(true);
      setError(null);

      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          throw new Error("Token tidak ditemukan. Silakan login lagi.");
        }

        const res = await fetch(`${API_URL}/dashboard/smart-insight`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(
            (await res.text()) || "Failed to fetch smart insight"
          );
        }

        const json = await res.json();
        if (!cancelled) {
          setInsight(json as SmartInsight);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("Smart insight error:", e);
          setError(getErr(e));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchInsight();

    return () => {
      cancelled = true;
    };
  }, []);

  return { insight, loading, error };
}
