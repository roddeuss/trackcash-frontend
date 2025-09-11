"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export interface Asset {
  id: number;
  type_id: number;
  asset_code: string;
  asset_name: string;
  quantity: number;
  type?: { id: number; name: string }; // relasi optional
}

export function useAsset() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Helper untuk ambil pesan error
  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) return err.message;
    return String(err);
  };

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

      const data: unknown = await res.json();

      let assetsData: Asset[] = [];

      if (Array.isArray(data)) {
        assetsData = data as Asset[];
      } else if (typeof data === "object" && data !== null && "data" in data) {
        assetsData = (data as { data: Asset[] }).data;
      }

      setAssets(assetsData);
    } catch (err: unknown) {
      console.error("Fetch assets error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create asset
  const createAsset = async (payload: Omit<Asset, "id" | "type">) => {
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

      const newAsset: Asset = await res.json();
      setAssets((prev) => [...prev, newAsset]);
      return newAsset;
    } catch (err: unknown) {
      console.error("Create asset error:", err);
      throw err;
    }
  };

  // 🔹 Update asset
  const updateAsset = async (
    id: number,
    payload: Partial<Omit<Asset, "id" | "type">>
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

      const updatedAsset: Asset = await res.json();
      setAssets((prev) => prev.map((a) => (a.id === id ? updatedAsset : a)));
      return updatedAsset;
    } catch (err: unknown) {
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
    } catch (err: unknown) {
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
