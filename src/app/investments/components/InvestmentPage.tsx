"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { formatCurrency } from "@/utils/format";
import { useInvestment, Investment } from "@/hooks/useInvestment";
import InvestmentTable from "./InvestmentTable";
import InvestmentForm from "./InvestmentForm";
import { useAuth } from "@/hooks/useAuth";

export default function InvestmentPage() {
    const { user, loading: authLoading, logout } = useAuth();
    const {
        investments,
        loading,
        error,
        fetchInvestments,
        buyInvestment,
        sellInvestment,
        deleteInvestment,
    } = useInvestment();

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"buy" | "sell">("buy");
    const [editing, setEditing] = useState<Investment | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchInvestments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = useMemo(() => {
        let data = investments;
        if (search) {
            const s = search.toLowerCase();
            data = data.filter(
                (i) =>
                    (i.asset?.asset_name ?? "").toLowerCase().includes(s) ||
                    (i.asset?.asset_code ?? "").toLowerCase().includes(s)
            );
        }
        return data;
    }, [investments, search]);

    // Export
    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            filtered.map((i) => ({
                Aset: `${i.asset?.asset_code ?? ""} - ${i.asset?.asset_name ?? ""}`,
                "Unit Dimiliki": i.units,
                "Avg Buy Price": i.average_buy_price,
                "Total Cost": i.units * i.average_buy_price,
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Investments");
        XLSX.writeFile(wb, "investments.xlsx");
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        (doc as any).autoTable({
            head: [["Aset", "Unit", "Avg Buy", "Total Cost"]],
            body: filtered.map((i) => [
                `${i.asset?.asset_code ?? ""} - ${i.asset?.asset_name ?? ""}`,
                i.units,
                formatCurrency(i.average_buy_price),
                formatCurrency(i.units * i.average_buy_price),
            ]),
        });
        doc.save("investments.pdf");
    };

    // Submit BUY/SELL
    const handleSubmit = async (form: {
        mode: "buy" | "sell";
        asset_id?: number;
        investment_id?: number;
        bank_id: number;
        category_id: number;
        units: number;
        price_per_unit: number;
        transaction_date: string; // harus ISO/parsable backend (YYYY-MM-DD HH:mm:ss)
    }) => {
        try {
            if (form.mode === "buy") {
                await buyInvestment({
                    asset_id: form.asset_id!,
                    bank_id: form.bank_id,
                    category_id: form.category_id,
                    units: form.units,
                    price_per_unit: form.price_per_unit,
                    transaction_date: form.transaction_date,
                });
                Swal.fire("Berhasil", "Pembelian investasi tercatat ✅", "success");
            } else {
                const id = form.investment_id ?? editing?.id;
                if (!id) throw new Error("Investment ID tidak ditemukan");
                const res = await sellInvestment(id, {
                    bank_id: form.bank_id,
                    category_id: form.category_id,
                    units: form.units,
                    price_per_unit: form.price_per_unit,
                    transaction_date: form.transaction_date,
                });
                const pl = (res as any)?.profit_loss;
                Swal.fire(
                    "Berhasil",
                    `Penjualan investasi tercatat ✅${typeof pl === "number" ? `\nP/L: ${formatCurrency(pl)}` : ""
                    }`,
                    "success"
                );
            }
            fetchInvestments();
            setEditing(null);
            setOpen(false);
        } catch (e) {
            Swal.fire("Error", e instanceof Error ? e.message : "Gagal menyimpan");
        }
    };

    const handleDelete = async (id: number) => {
        const ok = await Swal.fire({
            title: "Hapus investasi?",
            text: "Data akan dihapus (soft delete).",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
        });
        if (!ok.isConfirmed) return;
        try {
            await deleteInvestment(id);
            Swal.fire("Berhasil", "Investasi dihapus ✅", "success");
        } catch {
            Swal.fire("Error", "Gagal menghapus investasi", "error");
        }
    };

    const handleDialogOpenChange = (v: boolean) => {
        if (!v) {
            setEditing(null);
            setOpen(false);
        } else {
            setOpen(true);
        }
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
                <span className="mt-4 text-gray-700 font-medium">Loading investasi...</span>
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
                    <h1 className="text-2xl font-bold">Manajemen Investasi</h1>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                setMode("buy");
                                setEditing(null);
                                setOpen(true);
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Beli Investasi
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setMode("sell");
                                setOpen(true);
                            }}
                        >
                            Jual Investasi
                        </Button>
                    </div>
                </div>

                {/* Filter & Export */}
                <div className="flex flex-wrap gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Cari aset (kode/nama)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded px-3 py-2"
                    />
                    <div className="ml-auto flex gap-2">
                        <Button onClick={exportExcel}>Excel</Button>
                        <Button onClick={exportPDF}>PDF</Button>
                    </div>
                </div>

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

                <InvestmentTable
                    investments={filtered}
                    onSell={(inv) => {
                        setMode("sell");
                        setEditing(inv);
                        setOpen(true);
                    }}
                    onDelete={handleDelete}
                />

                <InvestmentForm
                    mode={mode}
                    open={open}
                    onOpenChange={handleDialogOpenChange}
                    onSubmit={handleSubmit}
                    editing={editing}
                />
            </div>
        </AdminLayout>
    );
}
