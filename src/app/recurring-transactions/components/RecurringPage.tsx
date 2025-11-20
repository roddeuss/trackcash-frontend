"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import UnauthorizedPage from "@/app/unauthorized/page";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";

import {
  useRecurringTransactions,
  RecurringTransaction,
} from "@/hooks/useRecurringTransactions";
import { useCategories } from "@/hooks/useCategories";
import { useBank } from "@/hooks/useBank";

import RecurringForm from "./RecurringForm";
import RecurringTable from "./RecurringTable";

export default function RecurringPage() {
  const { user, loading: authLoading, logout } = useAuth();

  const {
    items,
    loading: recurringLoading,
    error,
    createRecurring,
    updateRecurring,
    deleteRecurring,
    fetchRecurring,
  } = useRecurringTransactions();

  const { categories } = useCategories();
  const { banks, loading: bankLoading } = useBank();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringTransaction | null>(null);

  const handleDialogOpenChange = (v: boolean) => {
    if (!v) {
      setEditing(null);
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const handleSave = async (data: Partial<RecurringTransaction>) => {
    try {
      if (editing) {
        await updateRecurring(editing.id, data);
        Swal.fire("Berhasil", "Recurring transaction berhasil diperbarui ✅", "success");
      } else {
        await createRecurring(data);
        Swal.fire("Berhasil", "Recurring transaction berhasil ditambahkan ✅", "success");
      }
      await fetchRecurring();
    } catch (err: any) {
      Swal.fire(
        "Error",
        err?.message || "Gagal menyimpan recurring transaction",
        "error"
      );
    } finally {
      setEditing(null);
      setOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Recurring transaction ini akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteRecurring(id);
      Swal.fire("Berhasil", "Recurring transaction berhasil dihapus ✅", "success");
      await fetchRecurring();
    } catch (err: any) {
      Swal.fire(
        "Error",
        err?.message || "Gagal menghapus recurring transaction",
        "error"
      );
    }
  };

  const isLoading = authLoading || recurringLoading || bankLoading;

  if (isLoading) {
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
    return <UnauthorizedPage />;
  }

  return (
    <AdminLayout username={user.name} onLogout={logout}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Recurring Transactions</h1>
            <p className="text-sm text-muted-foreground">
              Kelola transaksi rutin seperti gaji, kontrakan, tagihan bulanan, dll.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Recurring
          </Button>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded">
            {error}
          </p>
        )}

        {/* Table */}
        <RecurringTable
          items={items}
          onEdit={(item) => {
            setEditing(item);
            setOpen(true);
          }}
          onDelete={handleDelete}
        />

        {/* Form Dialog */}
        <RecurringForm
          open={open || !!editing}
          onOpenChange={handleDialogOpenChange}
          onSave={handleSave}
          editing={editing}
          categories={categories}
          banks={banks}
        />
      </div>
    </AdminLayout>
  );
}
