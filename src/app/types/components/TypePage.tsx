"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import TypeTable from "./TypeTable";
import TypeForm from "./TypeForm";
import Swal from "sweetalert2";
import { useTypes } from "@/hooks/useType";

interface Type {
  id: number;
  name: string;
}

export default function TypePage() {
  const {
    types,
    loading,
    createType,
    updateType,
    deleteType,
  } = useTypes();

  const [open, setOpen] = useState(false);
  const [editingType, setEditingType] = useState<Type | null>(null);

  const handleSave = async (data: { name: string }) => {
    try {
      if (editingType) {
        await updateType(editingType.id, data);
        Swal.fire("Berhasil", "Tipe berhasil diperbarui ✅", "success");
      } else {
        await createType(data);
        Swal.fire("Berhasil", "Tipe berhasil ditambahkan ✅", "success");
      }
    } catch (err) {
      Swal.fire("Error", "Terjadi kesalahan saat menyimpan tipe", "error");
    } finally {
      setEditingType(null);
      setOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
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
    } catch (err) {
      Swal.fire("Error", "Gagal menghapus tipe", "error");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

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
          onDelete={handleDelete}
        />

        <TypeForm
          open={open || !!editingType}
          onOpenChange={setOpen}
          onSave={handleSave}
          editingType={editingType}
        />
      </main>
    </div>
  );
}
