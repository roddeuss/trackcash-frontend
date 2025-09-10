"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

interface Bank {
  id: number;
  name: string;
  account_number: string;
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
      setBanks(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      console.error("Fetch banks error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create bank
  const createBank = async (payload: {
    name: string;
    account_number: string;
  }) => {
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

      const newBank = await res.json();
      setBanks((prev) => [...prev, newBank]);
      return newBank;
    } catch (err: any) {
      console.error("Create bank error:", err);
      throw err;
    }
  };

  // 🔹 Update bank
  const updateBank = async (
    id: number,
    payload: { name: string; account_number: string }
  ) => {
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

      const updatedBank = await res.json();
      setBanks((prev) => prev.map((b) => (b.id === id ? updatedBank : b)));
      return updatedBank;
    } catch (err: any) {
      console.error("Update bank error:", err);
      throw err;
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
    } catch (err: any) {
      console.error("Delete bank error:", err);
      throw err;
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
