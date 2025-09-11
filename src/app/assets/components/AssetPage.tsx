"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import AssetTable from "./AssetTable";
import AssetForm from "./AssetForm";
import { API_URL } from "@/lib/api";
import Swal from "sweetalert2";

interface Asset {
  id: number;
  type_id: number;
  asset_code: string;
  asset_name: string;
  quantity: number;
  type?: { id: number; name: string }; // relasi
}

interface Type {
  id: number;
  name: string;
}

export default function AssetPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const fetchAssets = async () => {
    try {
      const res = await fetch(`${API_URL}/assets`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("Gagal mengambil data aset");
      const data = await res.json();
      setAssets(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Fetch assets error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await fetch(`${API_URL}/types`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("Gagal mengambil data type");
      const data = await res.json();
      setTypes(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Fetch types error:", err);
    }
  };

  useEffect(() => {
    fetchAssets();
    fetchTypes();
  }, []);

  const handleSave = async (data: {
    type_id: number;
    asset_code: string;
    asset_name: string;
    quantity: number;
  }) => {
    try {
      if (editingAsset) {
        const res = await fetch(`${API_URL}/assets/${editingAsset.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Gagal update aset");
        Swal.fire("Berhasil", "Aset berhasil diperbarui", "success");
      } else {
        const res = await fetch(`${API_URL}/assets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Gagal tambah aset");
        Swal.fire("Berhasil", "Aset berhasil ditambahkan", "success");
      }
      await fetchAssets();
    } catch (err) {
      Swal.fire("Error", "Terjadi kesalahan saat menyimpan data aset", "error");
    } finally {
      setEditingAsset(null);
      setOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus aset ini?")) return;
    try {
      const res = await fetch(`${API_URL}/assets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Gagal hapus aset");
      Swal.fire("Berhasil", "Aset berhasil dihapus", "success");
      await fetchAssets();
    } catch (err) {
      Swal.fire("Error", "Terjadi kesalahan saat menghapus aset", "error");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="flex">
      <Sidebar onLogout={() => console.log("logout")} />
      <main className="flex-1 p-6 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Master Data - Assets</h1>
          <Button
            onClick={() => {
              setEditingAsset(null);
              setOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Aset
          </Button>
        </div>

        <AssetTable
          assets={assets}
          onEdit={(asset) => {
            setEditingAsset(asset);
            setOpen(true);
          }}
          onDelete={handleDelete}
        />

        <AssetForm
          open={open || !!editingAsset}
          onOpenChange={setOpen}
          onSave={handleSave}
          editingAsset={editingAsset}
          types={types}
        />
      </main>
    </div>
  );
}
