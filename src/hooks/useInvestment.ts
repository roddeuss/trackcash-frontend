"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export interface InvestmentTransaction {
  id: number;
  type: "buy" | "sell";
  units: number;
  price_per_unit: number;
  transaction_date: string;
}

export interface Investment {
  id: number;
  user_id: number;
  asset_id: number;
  units: number;
  average_buy_price: number;
  deleted: boolean;
  asset?: { id: number; asset_code: string; asset_name: string };
  transactions?: InvestmentTransaction[]; // 👈 tambahan
}


export interface BuyPayload {
  asset_id: number;
  units: number;
  price_per_unit: number;
  transaction_date: string; // ISO
  bank_id: number;
  category_id: number;
}

export interface SellPayload {
  units: number;
  price_per_unit: number;
  transaction_date: string; // ISO
  bank_id: number;
  category_id: number;
}

function getAuthHeaders() {
  // aman untuk SSR
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  } as HeadersInit;
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export function useInvestment() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch list investments
  const fetchInvestments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/investments`, {
        headers: getAuthHeaders(),
        cache: "no-store",
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to fetch investments");
      }
      const json = await res.json();
      const data = Array.isArray(json) ? json : json?.data;
      setInvestments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch investments error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // BUY
  const buyInvestment = async (payload: BuyPayload) => {
    debugger;
    try {
      const res = await fetch(`${API_URL}/investments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to buy investment");
      }
      const json = await res.json();
      const inv: Investment = json?.data ?? json;

      setInvestments((prev) => {
        const idx = prev.findIndex((p) => p.id === inv.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = inv;
          return next;
        }
        return [...prev, inv];
      });

      return inv;
    } catch (err) {
      console.error("Buy investment error:", err);
      throw err;
    }
  };

  // SELL
  const sellInvestment = async (id: number, payload: SellPayload) => {
    try {
      const res = await fetch(`${API_URL}/investments/${id}/sell`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to sell investment");
      }
      const json = await res.json();
      const inv: Investment = json?.data ?? json;

      setInvestments((prev) => prev.map((p) => (p.id === inv.id ? inv : p)));

      // backend kamu mungkin juga return { profit_loss }
      return json;
    } catch (err) {
      console.error("Sell investment error:", err);
      throw err;
    }
  };

  // UPDATE
  const updateInvestment = async (id: number, payload: Partial<Investment>) => {
    try {
      const res = await fetch(`${API_URL}/investments/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to update investment");
      }
      const json = await res.json();
      const inv: Investment = json?.data ?? json;

      setInvestments((prev) => prev.map((p) => (p.id === id ? inv : p)));

      return inv;
    } catch (err) {
      console.error("Update investment error:", err);
      throw err;
    }
  };

  // DELETE
  const deleteInvestment = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/investments/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to delete investment");
      }
      setInvestments((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete investment error:", err);
      throw err;
    }
  };

  useEffect(() => {
    // dijalankan di client, aman untuk fetch
    fetchInvestments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    investments,
    loading,
    error,
    fetchInvestments,
    buyInvestment,
    sellInvestment,
    updateInvestment,
    deleteInvestment,
  };
}
