"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";
import Swal from "sweetalert2";
import { useCategories } from "@/hooks/useCategories";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function CategoryPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    { id: number; type: string; name: string } | null
  >(null);

  const handleDialogOpenChange = (v: boolean) => {
    if (!v) {
      setEditingCategory(null);
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const handleSave = async (data: { type: string; name: string }) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        Swal.fire("Berhasil", "Category berhasil diperbarui ✅", "success");
      } else {
        await createCategory(data);
        Swal.fire("Berhasil", "Category berhasil ditambahkan ✅", "success");
      }
      await fetchCategories();
    } catch (err: any) {
      Swal.fire("Error", err?.message || "Gagal menyimpan category", "error");
    } finally {
      setEditingCategory(null);
      setOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Data category akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteCategory(id);
      Swal.fire("Berhasil", "Category berhasil dihapus ✅", "success");
      await fetchCategories();
    } catch (err: any) {
      Swal.fire("Error", err?.message || "Gagal menghapus category", "error");
    }
  };

  if (authLoading || loading) {
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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Silakan login dulu
      </div>
    );
  }

  return (
    <AdminLayout username={user.name} onLogout={logout}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Master Data - Categories</h1>
          <Button
            onClick={() => {
              setEditingCategory(null);
              setOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Category
          </Button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded">
            {error}
          </p>
        )}

        <CategoryTable
          categories={categories}
          onEdit={(category) => {
            setEditingCategory(category);
            setOpen(true);
          }}
          onDelete={handleDelete}
        />

        <CategoryForm
          open={open || !!editingCategory}
          onOpenChange={handleDialogOpenChange}
          onSave={handleSave}
          editingCategory={editingCategory}
        />
      </div>
    </AdminLayout>
  );
}
