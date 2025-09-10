"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BankTable from "./BankTable";
import BankForm from "./BankForm";
import Sidebar from "@/components/layout/Sidebar";
import { API_URL } from "@/lib/api";
import Swal from "sweetalert2";


interface Bank {
    id: number;
    account_number: string;
    bank_name: string;
    account_name: string;
    balance: number;
}

export default function BankPage() {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingBank, setEditingBank] = useState<Bank | null>(null);

    // 🔹 Fetch data bank dari API
    const fetchBanks = async () => {
        try {
            const res = await fetch(`${API_URL}/banks`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
            });

            if (!res.ok) throw new Error("Gagal mengambil data bank");

            const data = await res.json();
            setBanks(Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []));
        } catch (err) {
            console.error("Error fetch banks:", err);
            Swal.fire("Error", "Gagal memuat data bank", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanks();
    }, []);

    // 🔹 Tambah atau update bank
    const handleSave = async (data: { bank_name: string; account_number: string; account_name: string; balance: number }) => {
        try {
            if (editingBank) {
                // Update bank
                const res = await fetch(`${API_URL}/banks/${editingBank.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        Accept: "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (!res.ok) throw new Error("Gagal update bank");

                Swal.fire("Berhasil", "Bank berhasil diperbarui ✅", "success");
                await fetchBanks();
            } else {
                // Add new bank
                const res = await fetch(`${API_URL}/banks`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        Accept: "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (!res.ok) throw new Error("Gagal tambah bank");

                Swal.fire("Berhasil", "Bank berhasil ditambahkan ✅", "success");
                await fetchBanks();
            }
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
            const res = await fetch(`${API_URL}/banks/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
            });

            if (!res.ok) throw new Error("Gagal menghapus bank");

            Swal.fire("Berhasil", "Bank berhasil dihapus ✅", "success");
            await fetchBanks();
        } catch (err) {
            console.error("Delete bank error:", err);
            Swal.fire("Error", "Gagal menghapus bank", "error");
        }
    };

    if (loading) return <p className="p-6">Loading...</p>;

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
