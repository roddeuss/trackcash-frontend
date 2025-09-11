"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

interface Category {
  id: number;
  type: string; // income | expense | investment
  name: string;
}

// helper untuk ambil pesan error yang valid
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch categories");

      const data = await res.json();

      // validasi response supaya sesuai tipe
      if (Array.isArray(data)) {
        setCategories(data as Category[]);
      } else if (Array.isArray(data.data)) {
        setCategories(data.data as Category[]);
      } else {
        setCategories([]);
      }
    } catch (err: unknown) {
      console.error("Fetch categories error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Create category
  const createCategory = async (payload: { type: string; name: string }) => {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create category");

      const json = await res.json();
      const newCategory: Category = json.data; // ✅ ambil data dari response
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (err: unknown) {
      console.error("Create category error:", err);
      throw new Error(getErrorMessage(err));
    }
  };

  // Update category
  const updateCategory = async (
    id: number,
    payload: { type: string; name: string }
  ) => {
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update category");

      const json = await res.json();
      const updatedCategory: Category = json.data; // ✅ ambil data dari response
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? updatedCategory : c))
      );
      return updatedCategory;
    } catch (err: unknown) {
      console.error("Update category error:", err);
      throw new Error(getErrorMessage(err));
    }
  };

  // 🔹 Delete category
  const deleteCategory = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete category");

      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      console.error("Delete category error:", err);
      throw new Error(getErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
