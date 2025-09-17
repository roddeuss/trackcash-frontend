"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export type BudgetPeriod = "monthly" | "weekly" | "yearly" | "custom";

export interface Budget {
  id: number;
  user_id: number;
  category_id: number;
  name?: string | null;
  amount: number;
  period: BudgetPeriod;
  start_date?: string | null; // ISO or null if non-custom
  end_date?: string | null;
  deleted: boolean;
  category?: { id: number; name: string; type: string };

  // computed fields from backend index/show
  spent?: number;
  remaining?: number;
  progress?: number; // 0..100
  window?: { start: string; end: string };
}

type CreatePayload = {
  category_id: number;
  name?: string;
  amount: number;
  period: BudgetPeriod;
  start_date?: string | null;
  end_date?: string | null;
};

type UpdatePayload = Partial<CreatePayload>;

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function useBudget() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  const fetchBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/budgets`, {
        headers: authHeaders(),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      const data = Array.isArray(json) ? json : json?.data;
      setBudgets(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error("Fetch budgets error:", e);
      setError(typeof e?.message === "string" ? e.message : "Failed to fetch budgets");
    } finally {
      setLoading(false);
    }
  };

  const createBudget = async (payload: CreatePayload) => {
    const res = await fetch(`${API_URL}/budgets`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    const json = await res.json();
    const b: Budget = json?.data ?? json;
    setBudgets(prev => [b, ...prev]);
    return b;
  };

  const updateBudget = async (id: number, payload: UpdatePayload) => {
    const res = await fetch(`${API_URL}/budgets/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    const json = await res.json();
    const b: Budget = json?.data ?? json;
    setBudgets(prev => prev.map(x => (x.id === id ? b : x)));
    return b;
  };

  const deleteBudget = async (id: number) => {
    const res = await fetch(`${API_URL}/budgets/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    setBudgets(prev => prev.filter(x => x.id !== id));
  };

  useEffect(() => {
    fetchBudgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { budgets, loading, error, fetchBudgets, createBudget, updateBudget, deleteBudget };
}
