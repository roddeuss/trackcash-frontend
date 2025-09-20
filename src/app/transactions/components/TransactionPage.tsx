"use client";

import { useState, useEffect, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TransactionTable from "./TransactionTable";
import TransactionForm from "./TransactionForm";
import Swal from "sweetalert2";
import { useTransaction, Transaction } from "@/hooks/useTransaction";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { formatDateTime, formatCurrency } from "@/utils/format";
import UnauthorizedPage from "@/app/unauthorized/page";


export default function TransactionPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    fetchTransactions,
  } = useTransaction();

  const [open, setOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortByDate, setSortByDate] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (
    data: Omit<Transaction, "id" | "user_id" | "bank" | "asset" | "category">
  ) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, data);
        Swal.fire("Berhasil", "Transaksi berhasil diperbarui ✅", "success");
      } else {
        await createTransaction(data);
        Swal.fire("Berhasil", "Transaksi berhasil ditambahkan ✅", "success");
      }
      fetchTransactions();
    } catch (err) {
      Swal.fire("Error", "Terjadi kesalahan saat menyimpan transaksi", "error");
    } finally {
      setEditingTransaction(null);
      setOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin hapus?",
      text: "Data transaksi akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteTransaction(id);
      Swal.fire("Berhasil", "Transaksi berhasil dihapus ✅", "success");
      fetchTransactions();
    } catch {
      Swal.fire("Error", "Gagal menghapus transaksi", "error");
    }
  };

  // Handler open/close modal — reset editing saat close
  const handleDialogOpenChange = (v: boolean) => {
    if (!v) {
      setEditingTransaction(null);
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const filteredTransactions = useMemo(() => {
    let data = transactions;
    if (search) {
      data = data.filter((trx) =>
        trx.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterCategory) {
      data = data.filter((trx) => trx.category?.name === filterCategory);
    }
    return data.sort((a, b) =>
      sortByDate === "asc"
        ? new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
        : new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
    );
  }, [transactions, search, filterCategory, sortByDate]);

  const exportCSV = () => {
    const csv = [
      ["Tanggal", "Kategori", "Bank", "Deskripsi", "Jumlah"],
      ...filteredTransactions.map((trx) => [
        formatDateTime(trx.transaction_date),
        trx.category?.name || "-",
        trx.bank?.bank_name || "-",
        trx.description || "-",
        formatCurrency(trx.amount),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    link.click();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredTransactions.map((trx) => ({
        Tanggal: formatDateTime(trx.transaction_date),
        Kategori: trx.category?.name || "-",
        Bank: trx.bank?.bank_name || "-",
        Deskripsi: trx.description || "-",
        Jumlah: formatCurrency(trx.amount),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    (doc as any).autoTable({
      head: [["Tanggal", "Kategori", "Bank", "Deskripsi", "Jumlah"]],
      body: filteredTransactions.map((trx) => [
        formatDateTime(trx.transaction_date),
        trx.category?.name || "-",
        trx.bank?.bank_name || "-",
        trx.description || "-",
        formatCurrency(trx.amount),
      ]),
    });
    doc.save("transactions.pdf");
  };

  // Loading gabungan auth + data
  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
        <span className="mt-4 text-gray-700 font-medium">Loading transaksi...</span>
      </div>
    );
  }

  if (!user) {
    return <UnauthorizedPage />;
  }


  return (
    <AdminLayout username={user.name} onLogout={logout}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manajemen Transaksi</h1>
          <Button
            onClick={() => {
              setEditingTransaction(null);
              setOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Transaksi
          </Button>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <select
            value={filterCategory || ""}
            onChange={(e) => setFilterCategory(e.target.value || null)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Categories</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <select
            value={sortByDate}
            onChange={(e) => setSortByDate(e.target.value as "asc" | "desc")}
            className="border rounded px-3 py-2"
          >
            <option value="asc">Tanggal: Terlama → Terbaru</option>
            <option value="desc">Tanggal: Terbaru → Terlama</option>
          </select>
          <div className="ml-auto flex gap-2">
            <Button onClick={exportCSV}>CSV</Button>
            <Button onClick={exportExcel}>Excel</Button>
            <Button onClick={exportPDF}>PDF</Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 text-red-500"
          >
            {error}
          </motion.p>
        )}

        {/* Table */}
        <TransactionTable
          transactions={filteredTransactions}
          onEdit={(trx) => {
            setEditingTransaction(trx);
            setOpen(true);
          }}
          onDelete={handleDelete}
        />

        <TransactionForm
          open={open || !!editingTransaction}
          onOpenChange={handleDialogOpenChange}
          onSave={handleSave}
          editingTransaction={editingTransaction}
        />
      </div>
    </AdminLayout>
  );
}
