"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BankTable from "./BankTable";
import BankForm from "./BankForm";
import Sidebar from "@/components/layout/Sidebar";
import Swal from "sweetalert2";
import { useBank, Bank } from "@/hooks/useBank";
import { motion } from "framer-motion";

export default function BankPage() {
    const { banks, loading, createBank, updateBank, deleteBank, fetchBanks } = useBank();
    const [open, setOpen] = useState(false);
    const [editingBank, setEditingBank] = useState<Bank | null>(null);

    // 🔹 Tambah / update bank
    const handleSave = async (data: Omit<Bank, "id">) => {
        try {
            if (editingBank) {
                await updateBank(editingBank.id, data);
                Swal.fire("Berhasil", "Bank berhasil diperbarui ✅", "success");
            } else {
                await createBank(data);
                Swal.fire("Berhasil", "Bank berhasil ditambahkan ✅", "success");
            }

            // ✅ Refresh data biar langsung muncul
            await fetchBanks();
        } catch (err) {
            console.error("Save bank error:", err);
            Swal.fire("Error", "Terjadi kesalahan saat menyimpan bank", "error");
        } finally {
            setEditingBank(null);
            setOpen(false);
        }
    };

    // 🔹 Hapus bank
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
            await fetchBanks(); // ✅ Refresh setelah hapus
        } catch (err) {
            console.error("Delete bank error:", err);
            Swal.fire("Error", "Gagal menghapus bank", "error");
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
            {/* Sidebar */}
            <Sidebar onLogout={() => console.log("logout")} />

            {/* Main Content */}
            <main className="flex-1 p-6 ml-64">
                <div className="flex justify-between items-center mb-6">
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

                {/* Table */}
                <BankTable
                    banks={banks}
                    onEdit={(bank) => {
                        setEditingBank(bank);
                        setOpen(true);
                    }}
                    onDelete={handleDelete}
                />

                {/* Form */}
                <BankForm
                    open={open || !!editingBank}
                    onOpenChange={setOpen}
                    onSave={handleSave}
                    editingBank={editingBank}
                />
            </main>
        </div>
    );
}
