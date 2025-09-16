"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import TypeTable from "./TypeTable";
import TypeForm from "./TypeForm";
import Swal from "sweetalert2";
import { useTypes } from "@/hooks/useType";
import { motion } from "framer-motion";

interface Type {
  id: number;
  name: string;
}

export default function TypePage() {
  const {
    types,
    loading,
    fetchTypes,
    createType,
    updateType,
    deleteType,
  } = useTypes();

  const [open, setOpen] = useState(false);
  const [editingType, setEditingType] = useState<Type | null>(null);

  // Tutup modal = reset editing + setOpen(false)
  const handleDialogOpenChange = (v: boolean) => {
    if (!v) {
      setEditingType(null);
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const handleSave = async (data: { name: string }) => {
    try {
      if (editingType) {
        await updateType(editingType.id, data);
        Swal.fire("Berhasil", "Tipe berhasil diperbarui ✅", "success");
      } else {
        await createType(data);
        Swal.fire("Berhasil", "Tipe berhasil ditambahkan ✅", "success");
      }
      await fetchTypes();
    } catch (err) {
      Swal.fire("Error", "Terjadi kesalahan saat menyimpan tipe", "error");
    } finally {
      setEditingType(null);
      setOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar onLogout={() => console.log("logout")} />
      <main className="flex-1 p-6 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Master Data - Types</h1>
          <Button
            onClick={() => {
              setEditingType(null);
              setOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Tipe
          </Button>
        </div>

        <TypeTable
          types={types}
          onEdit={(type) => {
            setEditingType(type);
            setOpen(true);
          }}
          onDelete={async (id) => {
            const result = await Swal.fire({
              title: "Yakin hapus?",
              text: "Data tipe akan dihapus permanen",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Ya, hapus",
              cancelButtonText: "Batal",
            });
            if (!result.isConfirmed) return;

            try {
              await deleteType(id);
              Swal.fire("Berhasil", "Tipe berhasil dihapus ✅", "success");
              await fetchTypes();
            } catch {
              Swal.fire("Error", "Gagal menghapus tipe", "error");
            }
          }}
        />

        <TypeForm
          open={open || !!editingType}
          onOpenChange={handleDialogOpenChange}  // <- penting
          onSave={handleSave}
          editingType={editingType}
        />
      </main>
    </div>
  );
}
