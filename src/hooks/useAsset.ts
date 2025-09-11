"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

interface Asset {
  id: number;
  type_id: number;
  asset_code: string;
  asset_name: string;
  quantity: number;
}

export function useAsset() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch assets
  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/assets`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch assets");

      const data = await res.json();
      setAssets(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      console.error("Fetch assets error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create asset
  const createAsset = async (payload: {
    type_id: number;
    asset_code: string;
    asset_name: string;
    quantity: number;
  }) => {
    try {
      const res = await fetch(`${API_URL}/assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create asset");

      const newAsset = await res.json();
      setAssets((prev) => [...prev, newAsset]);
      return newAsset;
    } catch (err: any) {
      console.error("Create asset error:", err);
      throw err;
    }
  };

  // 🔹 Update asset
  const updateAsset = async (
    id: number,
    payload: { type_id?: number; asset_code?: string; asset_name?: string; quantity?: number }
  ) => {
    try {
      const res = await fetch(`${API_URL}/assets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update asset");

      const updatedAsset = await res.json();
      setAssets((prev) => prev.map((a) => (a.id === id ? updatedAsset : a)));
      return updatedAsset;
    } catch (err: any) {
      console.error("Update asset error:", err);
      throw err;
    }
  };

  // 🔹 Delete asset
  const deleteAsset = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/assets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete asset");

      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      console.error("Delete asset error:", err);
      throw err;
    }
  };

  // 🔹 Auto fetch
  useEffect(() => {
    fetchAssets();
  }, []);

  return {
    assets,
    loading,
    error,
    fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
  };
}
