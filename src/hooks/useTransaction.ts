"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export interface Transaction {
  id: number;
  user_id: number;
  bank_id?: number | null;
  category_id?: number | null;
  asset_id?: number | null;
  amount: number;
  description?: string | null;
  transaction_date: string;
  bank?: { id: number; bank_name: string };
  category?: { id: number; name: string; type: string };
  asset?: { id: number; asset_name: string };
}


export function useTransaction() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Helper untuk error message
  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) return err.message;
    return String(err);
  };

  // 🔹 Fetch transactions
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch transactions");

      const data: unknown = await res.json();

      let transactionsData: Transaction[] = [];

      if (Array.isArray(data)) {
        transactionsData = data as Transaction[];
      } else if (typeof data === "object" && data !== null && "data" in data) {
        transactionsData = (data as { data: Transaction[] }).data;
      }

      setTransactions(transactionsData);
    } catch (err: unknown) {
      console.error("Fetch transactions error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create transaction
  const createTransaction = async (
    payload: Omit<Transaction, "id" | "user_id" | "bank" | "asset" | "category">
  ) => {
    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create transaction");

      const newTransaction: Transaction = await res.json();
      setTransactions((prev) => [...prev, newTransaction]);
      return newTransaction;
    } catch (err: unknown) {
      console.error("Create transaction error:", err);
      throw err;
    }
  };

  // 🔹 Update transaction
  const updateTransaction = async (
    id: number,
    payload: Partial<
      Omit<Transaction, "id" | "user_id" | "bank" | "asset" | "category">
    >
  ) => {
    try {
      const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update transaction");

      const updatedTransaction: Transaction = await res.json();
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? updatedTransaction : t))
      );
      return updatedTransaction;
    } catch (err: unknown) {
      console.error("Update transaction error:", err);
      throw err;
    }
  };

  // 🔹 Delete transaction
  const deleteTransaction = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete transaction");

      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      console.error("Delete transaction error:", err);
      throw err;
    }
  };

  // 🔹 Auto fetch saat hook dipakai
  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
