"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import Pagination from "@/components/common/Pagination";

interface Bank {
    id: number;
    bank_name: string;
    account_number: string;
    account_name: string;
    balance: number;
    final_saldo?: number;
}

export default function BankTable({
    banks,
    onEdit,
    onDelete,
}: {
    banks: Bank[];
    onEdit: (bank: Bank) => void;
    onDelete: (id: number) => void;
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const totalPages = Math.ceil(banks.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentBanks = banks.slice(startIndex, startIndex + rowsPerPage);

    // 🔹 Hitung total saldo semua bank
    const totalBalance = useMemo(
        () => banks.reduce((sum, bank) => sum + (bank.final_saldo ?? 0), 0),
        [banks]
    );

    return (
        <div className="space-y-4">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                    <tr className="text-sm font-medium text-gray-600">
                        <th className="text-left p-3">#</th>
                        <th className="text-left p-3">Nama Bank</th>
                        <th className="text-left p-3">Nomor Rekening</th>
                        <th className="text-left p-3">Nama Pemilik</th>
                        <th className="text-left p-3">Saldo Awal</th>
                        <th className="text-left p-3">Balance</th>
                        <th className="text-left p-3">Aksi</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {currentBanks.map((bank, index) => (
                        <tr
                            key={bank.id}
                            className="border-t hover:bg-gray-50 transition-colors"
                        >
                            <td className="p-3">{startIndex + index + 1}</td>
                            <td className="p-3 font-medium">{bank.bank_name}</td>
                            <td className="p-3">{bank.account_number}</td>
                            <td className="p-3">{bank.account_name}</td>
                            <td className="p-3 font-semibold text-indigo-600">
                                {formatCurrency(bank.balance)}
                            </td>
                            <td className="p-3 font-semibold text-indigo-600">
                                {formatCurrency(bank.final_saldo ?? bank.balance)}
                            </td>

                            <td className="p-3 flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(bank)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onDelete(bank.id)}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {banks.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-4 text-center text-gray-500">
                                Tidak ada data bank.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 🔹 Total saldo */}
            {banks.length > 0 && (
                <div className="flex justify-end">
                    <div className="px-4 py-2 bg-gray-50 border rounded-lg text-sm font-semibold">
                        Total Saldo:{" "}
                        <span className="text-indigo-600">{formatCurrency(totalBalance)}</span>
                    </div>
                </div>
            )}

            {/* Reusable Pagination */}
            {banks.length > rowsPerPage && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}
