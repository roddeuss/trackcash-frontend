"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { ensureSecondsDMY } from "@/utils/datetime";

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

  const getErrorMessage = (err: unknown): string =>
    err instanceof Error ? err.message : String(err);

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
      if (!res.ok)
        throw new Error((await res.text()) || "Failed to fetch transactions");

      const json = await res.json();
      const transactionsData: Transaction[] = Array.isArray(json)
        ? json
        : json?.data ?? [];
      setTransactions(transactionsData);
    } catch (err) {
      console.error("Fetch transactions error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const createTransaction = async (
    payload: Omit<Transaction, "id" | "user_id" | "bank" | "asset" | "category">
  ) => {
    try {
      const normalized = {
        ...payload,
        transaction_date: ensureSecondsDMY(
          String(payload.transaction_date || "")
        ),
      };

      const res = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(normalized),
      });

      if (!res.ok)
        throw new Error((await res.text()) || "Failed to create transaction");

      const json = await res.json();
      const newTransaction: Transaction = json?.data ?? json;
      setTransactions((prev) => [...prev, newTransaction]);
      return newTransaction;
    } catch (err) {
      console.error("Create transaction error:", err);
      throw err;
    }
  };

  // UPDATE
  const updateTransaction = async (
    id: number,
    payload: Partial<
      Omit<Transaction, "id" | "user_id" | "bank" | "asset" | "category">
    >
  ) => {
    try {
      const normalized = {
        ...payload,
        ...(payload.transaction_date
          ? {
              transaction_date: ensureSecondsDMY(
                String(payload.transaction_date)
              ),
            }
          : {}),
      };

      const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(normalized),
      });

      if (!res.ok)
        throw new Error((await res.text()) || "Failed to update transaction");

      const json = await res.json();
      const updatedTransaction: Transaction = json?.data ?? json;
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? updatedTransaction : t))
      );
      return updatedTransaction;
    } catch (err) {
      console.error("Update transaction error:", err);
      throw err;
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      if (!res.ok)
        throw new Error((await res.text()) || "Failed to delete transaction");
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete transaction error:", err);
      throw err;
    }
  };

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
