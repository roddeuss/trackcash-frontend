"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export interface Bank {
  id: number;
  account_number: string;
  bank_name: string;
  account_name: string;
  balance: number;
}

// 🔹 Helper untuk ambil pesan error dengan aman
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function useBank() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch bank data
  const fetchBanks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/banks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch banks");

      const data = await res.json();

      if (Array.isArray(data)) {
        setBanks(data as Bank[]);
      } else if (Array.isArray(data.data)) {
        setBanks(data.data as Bank[]);
      } else {
        setBanks([]);
      }
    } catch (err: unknown) {
      console.error("Fetch banks error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create bank
  const createBank = async (payload: Omit<Bank, "id">) => {
    try {
      const res = await fetch(`${API_URL}/banks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create bank");

      const newBank: Bank = await res.json();
      setBanks((prev) => [...prev, newBank]);
      return newBank;
    } catch (err: unknown) {
      console.error("Create bank error:", err);
      throw new Error(getErrorMessage(err));
    }
  };

  // 🔹 Update bank
  const updateBank = async (id: number, payload: Omit<Bank, "id">) => {
    try {
      const res = await fetch(`${API_URL}/banks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update bank");

      const updatedBank: Bank = await res.json();
      setBanks((prev) => prev.map((b) => (b.id === id ? updatedBank : b)));
      return updatedBank;
    } catch (err: unknown) {
      console.error("Update bank error:", err);
      throw new Error(getErrorMessage(err));
    }
  };

  // 🔹 Delete bank
  const deleteBank = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/banks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete bank");

      setBanks((prev) => prev.filter((b) => b.id !== id));
    } catch (err: unknown) {
      console.error("Delete bank error:", err);
      throw new Error(getErrorMessage(err));
    }
  };

  // 🔹 Auto-fetch on mount
  useEffect(() => {
    fetchBanks();
  }, []);

  return {
    banks,
    loading,
    error,
    fetchBanks,
    createBank,
    updateBank,
    deleteBank,
  };
}
