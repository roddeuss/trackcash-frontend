"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";

import { useAuth } from "@/hooks/useAuth";
import { useBudget, Budget } from "@/hooks/useBudget";
import { useCategories } from "@/hooks/useCategories";

import BudgetTable from "./BudgetTable";
import BudgetForm from "./BudgetForm";
import UnauthorizedPage from "@/app/unauthorized/page";


export default function BudgetPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { budgets, loading, error, fetchBudgets, createBudget, updateBudget, deleteBudget } = useBudget();
  const { categories } = useCategories();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);

  useEffect(() => {
    fetchBudgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenChange = (v: boolean) => {
    if (!v) setEditing(null);
    setOpen(v);
  };

  const handleSave = async (payload: any) => {
    try {
      if (editing) {
        await updateBudget(editing.id, payload);
        Swal.fire("Success", "Budget berhasil diperbarui ✅", "success");
      } else {
        await createBudget(payload);
        Swal.fire("Success", "Budget berhasil dibuat ✅", "success");
      }
      setOpen(false);
      setEditing(null);
      fetchBudgets();
    } catch (e: any) {
      Swal.fire("Error", typeof e?.message === "string" ? e.message : "Gagal menyimpan budget", "error");
    }
  };

  const handleDelete = async (id: number) => {
    const ok = await Swal.fire({
      title: "Hapus budget?",
      text: "Data akan dihapus (soft delete).",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });
    if (!ok.isConfirmed) return;

    try {
      await deleteBudget(id);
      Swal.fire("Success", "Budget dihapus ✅", "success");
      fetchBudgets();
    } catch (e: any) {
      Swal.fire("Error", typeof e?.message === "string" ? e.message : "Gagal menghapus budget", "error");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <UnauthorizedPage />;
  }


  return (
    <AdminLayout username={user.name} onLogout={logout}>
      {/* Biarkan AdminLayout yang memasang ml-64 & min-h-screen */}
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Budgets</h1>
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Tambah Budget
          </Button>
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>}

        <BudgetTable
          budgets={budgets}
          onEdit={(b) => {
            setEditing(b);
            setOpen(true);
          }}
          onDelete={handleDelete}
        />

        <BudgetForm
          open={open || !!editing}
          onOpenChange={handleOpenChange}
          onSave={handleSave}
          categories={categories}
          editing={editing}
        />
      </div>
    </AdminLayout>
  );
}
