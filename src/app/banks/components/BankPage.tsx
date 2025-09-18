// app/banks/components/BankPage.tsx
"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BankTable, { BankRow } from "./BankTable";
import BankForm from "./BankForm";
import Swal from "sweetalert2";
import { useBank } from "@/hooks/useBank";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function BankPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const {
    banks = [],
    loading,
    createBank,
    updateBank,
    deleteBank,
    fetchBanks,
    error,
  } = useBank();

  const [open, setOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankRow | null>(null);

  const handleDialogOpenChange = (v: boolean) => {
    if (!v) {
      setEditingBank(null);
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const handleSave = async (data: Omit<BankRow, "id" | "computed_balance">) => {
    try {
      if (editingBank) {
        await updateBank(editingBank.id, data as any);
        Swal.fire("Berhasil", "Bank berhasil diperbarui ✅", "success");
      } else {
        await createBank(data as any);
        Swal.fire("Berhasil", "Bank berhasil ditambahkan ✅", "success");
      }
      await fetchBanks();
    } catch (err) {
      console.error("Save bank error:", err);
      Swal.fire("Error", "Terjadi kesalahan saat menyimpan bank", "error");
    } finally {
      setEditingBank(null);
      setOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Data bank akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteBank(id);
      Swal.fire("Berhasil", "Bank berhasil dihapus ✅", "success");
      await fetchBanks();
    } catch (err) {
      console.error("Delete bank error:", err);
      Swal.fire("Error", "Gagal menghapus bank", "error");
    }
  };

  if (authLoading || loading) {
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
          <h1 className="text-2xl font-bold">Master Data - Banks</h1>
          <Button
            onClick={() => {
              setEditingBank(null);
              setOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Bank
          </Button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded">
            {error}
          </p>
        )}

        <BankTable
          banks={banks || []}
          onEdit={(bank) => {
            setEditingBank(bank);
            setOpen(true);
          }}
          onDelete={handleDelete}
        />

        <BankForm
          open={open || !!editingBank}
          onOpenChange={handleDialogOpenChange}
          onSave={handleSave}
          editingBank={editingBank as any}
        />
      </div>
    </AdminLayout>
  );
}
