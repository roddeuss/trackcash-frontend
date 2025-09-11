"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

interface Type {
  id: number;
  name: string;
}

export function useTypes() {
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch types data
  const fetchTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/types`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch types");

      const data = await res.json();
      setTypes(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      console.error("Fetch types error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create type
  const createType = async (payload: { name: string }) => {
    try {
      const res = await fetch(`${API_URL}/types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create type");

      const newType = await res.json();
      setTypes((prev) => [...prev, newType]);
      return newType;
    } catch (err: any) {
      console.error("Create type error:", err);
      throw err;
    }
  };

  // 🔹 Update type
  const updateType = async (id: number, payload: { name: string }) => {
    try {
      const res = await fetch(`${API_URL}/types/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update type");

      const updatedType = await res.json();
      setTypes((prev) => prev.map((t) => (t.id === id ? updatedType : t)));
      return updatedType;
    } catch (err: any) {
      console.error("Update type error:", err);
      throw err;
    }
  };

  // 🔹 Delete type
  const deleteType = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/types/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete type");

      setTypes((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      console.error("Delete type error:", err);
      throw err;
    }
  };

  // 🔹 Auto-fetch on mount
  useEffect(() => {
    fetchTypes();
  }, []);

  return {
    types,
    loading,
    error,
    fetchTypes,
    createType,
    updateType,
    deleteType,
  };
}
