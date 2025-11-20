"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export interface RecurringTransaction {
  id: number;
  user_id: number;
  name: string;
  type: "income" | "expense";
  amount: number;
  category_id: number | null;
  bank_id: number | null;
  asset_id: number | null;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  day_of_month?: number | null;
  day_of_week?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  next_run_at?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// helper untuk ambil pesan error yang valid
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function useRecurringTransactions() {
  const [items, setItems] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecurring = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/recurring-transactions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch recurring transactions");

      const json = await res.json();

      const data = Array.isArray(json) ? json : json.data ?? [];
      setItems(data as RecurringTransaction[]);
    } catch (err) {
      console.error("Fetch recurring error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const createRecurring = async (payload: Partial<RecurringTransaction>) => {
    try {
      const res = await fetch(`${API_URL}/recurring-transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to create recurring transaction");
      }

      const newData: RecurringTransaction = json.data;
      setItems((prev) => [newData, ...prev]);
      return newData;
    } catch (err) {
      console.error("Create recurring error:", err);
      throw new Error(getErrorMessage(err));
    }
  };

  const updateRecurring = async (id: number, payload: Partial<RecurringTransaction>) => {
    try {
      const res = await fetch(`${API_URL}/recurring-transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update recurring transaction");
      }

      const updated: RecurringTransaction = json.data;
      setItems((prev) => prev.map((r) => (r.id === id ? updated : r)));
      return updated;
    } catch (err) {
      console.error("Update recurring error:", err);
      throw new Error(getErrorMessage(err));
    }
  };

  const deleteRecurring = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/recurring-transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to delete recurring transaction");
      }

      setItems((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Delete recurring error:", err);
      throw new Error(getErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchRecurring();
  }, []);

  return {
    items,
    loading,
    error,
    fetchRecurring,
    createRecurring,
    updateRecurring,
    deleteRecurring,
  };
}
