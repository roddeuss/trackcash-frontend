"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import AssetTable from "./AssetTable";
import AssetForm from "./AssetForm";
import Swal from "sweetalert2";
import { useAsset } from "@/hooks/useAsset";
import { API_URL } from "@/lib/api";

interface Type {
  id: number;
  name: string;
}

export default function AssetPage() {
  const { assets, loading, fetchAssets, createAsset, updateAsset, deleteAsset } =
    useAsset();
  const [types, setTypes] = useState<Type[]>([]);
  const [open, setOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<number | null>(null);

  // 🔹 Ambil types untuk relasi asset
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

  // 🔹 Tambah / Update asset
  const handleSave = async (data: {
    type_id: number;
    asset_code: string;
    asset_name: string;
    quantity: number;
  }) => {
    try {
      if (editingAsset) {
        await updateAsset(editingAsset, data);
        Swal.fire("Berhasil", "Aset berhasil diperbarui ✅", "success");
      } else {
        await createAsset(data);
        Swal.fire("Berhasil", "Aset berhasil ditambahkan ✅", "success");
      }
    } catch (err) {
      console.error("Save asset error:", err);
      Swal.fire("Error", "Terjadi kesalahan saat menyimpan data aset", "error");
    } finally {
      setEditingAsset(null);
      setOpen(false);
    }
  };

  // 🔹 Hapus asset
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Data aset akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAsset(id);
      Swal.fire("Berhasil", "Aset berhasil dihapus ✅", "success");
    } catch (err) {
      console.error("Delete asset error:", err);
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
            setEditingAsset(asset.id);
            setOpen(true);
          }}
          onDelete={handleDelete}
        />

        <AssetForm
          open={open || editingAsset !== null}
          onOpenChange={setOpen}
          onSave={handleSave}
          editingAsset={assets.find((a) => a.id === editingAsset) || null}
          types={types}
        />
      </main>
    </div>
  );
}
