"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import AssetTable from "./AssetTable";
import AssetForm from "./AssetForm";
import Swal from "sweetalert2";
import { useAsset } from "@/hooks/useAsset";
import { API_URL } from "@/lib/api";
import { motion } from "framer-motion";

interface Type {
  id: number;
  name: string;
}

export default function AssetPage() {
  const {
    assets,
    loading,
    fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
  } = useAsset();

  const [types, setTypes] = useState<Type[]>([]);
  const [open, setOpen] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<number | null>(null);

  // Ambil data type untuk dropdown
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editingAsset = useMemo(
    () => assets.find((a) => a.id === editingAssetId) || null,
    [assets, editingAssetId]
  );

  const isStockType = (typeId: number | null | undefined) => {
    const t = types.find((x) => x.id === typeId);
    return (t?.name ?? "").toLowerCase() === "saham";
  };

  // Tambah / Update asset (pakai lot_size hanya untuk saham)
  const handleSave = async (data: {
    type_id: number;
    asset_code: string;
    asset_name: string;
    lot_size: number; // dari form; untuk non-saham akan dipaksa 1
  }) => {
    try {
      const effectiveLotSize = isStockType(data.type_id) ? Number(data.lot_size || 1) : 1;

      if (editingAssetId) {
        await updateAsset(editingAssetId, { ...data, lot_size: effectiveLotSize });
        Swal.fire("Berhasil", "Aset berhasil diperbarui ✅", "success");
      } else {
        await createAsset({ ...data, lot_size: effectiveLotSize });
        Swal.fire("Berhasil", "Aset berhasil ditambahkan ✅", "success");
      }
      await fetchAssets();
    } catch (err) {
      console.error("Save asset error:", err);
      Swal.fire("Error", "Terjadi kesalahan saat menyimpan data aset", "error");
    } finally {
      setEditingAssetId(null);
      setOpen(false);
    }
  };

  // Hapus asset
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Data aset akan dihapus (soft delete)",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAsset(id);
      Swal.fire("Berhasil", "Aset berhasil dihapus ✅", "success");
      await fetchAssets();
    } catch (err) {
      console.error("Delete asset error:", err);
      Swal.fire("Error", "Terjadi kesalahan saat menghapus aset", "error");
    }
  };

  // Handler open/close modal — reset editing saat close
  const handleDialogOpenChange = (v: boolean) => {
    if (!v) {
      setEditingAssetId(null);
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar onLogout={() => console.log("logout")} />
      <main className="flex-1 p-6 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Master Data - Assets</h1>
          <Button
            onClick={() => {
              setEditingAssetId(null);
              setOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Aset
          </Button>
        </div>

        <AssetTable
          assets={assets}
          onEdit={(asset) => {
            setEditingAssetId(asset.id);
            setOpen(true);
          }}
          onDelete={handleDelete}
        />

        <AssetForm
          open={open || editingAssetId !== null}
          onOpenChange={handleDialogOpenChange}
          onSave={handleSave}
          editingAsset={
            editingAsset
              ? {
                id: editingAsset.id,
                type_id: editingAsset.type_id,
                asset_code: editingAsset.asset_code,
                asset_name: editingAsset.asset_name,
                // backend bisa kirim lot_size; fallback 1 utk non-saham
                lot_size: (editingAsset as any).lot_size ?? 1,
              }
              : null
          }
          types={types}
        />
      </main>
    </div>
  );
}
