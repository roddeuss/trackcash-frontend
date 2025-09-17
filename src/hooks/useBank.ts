// src/hooks/useBank.ts
"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export interface Bank {
  id: number;
  account_number: string;
  bank_name: string;
  account_name: string;
  balance: number;              // saldo awal
  computed_balance?: number;    // ← saldo akhir dari backend
}

function getErr(e: unknown) { return e instanceof Error ? e.message : String(e); }

export function useBank() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanks = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_URL}/banks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to fetch banks");
      const json = await res.json();
      const arr = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
      setBanks(arr as Bank[]);
    } catch (e) {
      console.error("Fetch banks error:", e);
      setError(getErr(e));
    } finally {
      setLoading(false);
    }
  };

  const createBank = async (payload: Omit<Bank, "id" | "computed_balance">) => {
    const res = await fetch(`${API_URL}/banks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text() || "Failed to create bank");
    const json = await res.json();
    // backend create tidak mengembalikan computed_balance (belum ada transaksi), aman
    setBanks(prev => [...prev, json?.data ?? json]);
    return json?.data ?? json;
  };

  const updateBank = async (id: number, payload: Omit<Bank, "id" | "computed_balance">) => {
    const res = await fetch(`${API_URL}/banks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text() || "Failed to update bank");
    const json = await res.json();
    setBanks(prev => prev.map(b => (b.id === id ? (json?.data ?? json) : b)));
    return json?.data ?? json;
  };

  const deleteBank = async (id: number) => {
    const res = await fetch(`${API_URL}/banks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) throw new Error(await res.text() || "Failed to delete bank");
    setBanks(prev => prev.filter(b => b.id !== id));
  };

  useEffect(() => { fetchBanks(); }, []);

  return {
    banks: banks ?? [], // fallback aman
    loading,
    error,
    fetchBanks,
    createBank,
    updateBank,
    deleteBank,
  };

}
