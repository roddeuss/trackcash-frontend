"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { formatCurrency } from "@/utils/format"
import Pagination from "@/components/common/Pagination";

interface Bank {
    id: number;
    bank_name: string;
    account_number: string;
    account_name: string;
    balance: number;
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

    return (
        <div>
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-3">#</th>
                        <th className="text-left p-3">Nama Bank</th>
                        <th className="text-left p-3">Nomor Rekening</th>
                        <th className="text-left p-3">Nama Pemilik</th>
                        <th className="text-left p-3">Balance</th>
                        <th className="text-left p-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {currentBanks.map((bank, index) => (
                        <tr key={bank.id} className="border-t hover:bg-gray-50">
                            <td className="p-3">{startIndex + index + 1}</td>
                            <td className="p-3">{bank.bank_name}</td>
                            <td className="p-3">{bank.account_number}</td>
                            <td className="p-3">{bank.account_name}</td>
                            <td className="px-4 py-2">{formatCurrency(bank.balance)}</td>
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
