// app/banks/components/BankTable.tsx
"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import Pagination from "@/components/common/Pagination";

export interface BankRow {
  id: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  balance: number;             // saldo awal
  computed_balance?: number;   // saldo akhir (hasil perhitungan transaksi)
}

type Props = {
  banks?: BankRow[]; // <- optional, biar aman
  onEdit: (bank: BankRow) => void;
  onDelete: (id: number) => void;
};

export default function BankTable({ banks = [], onEdit, onDelete }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // aman walau banks kosong
  const totalPages = Math.max(1, Math.ceil(banks.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentBanks = banks.slice(startIndex, startIndex + rowsPerPage);

  // Total saldo pakai computed_balance jika ada
  const totalBalance = useMemo(
    () =>
      banks.reduce((sum, b) => {
        const final =
          typeof b.computed_balance === "number" ? b.computed_balance : b.balance ?? 0;
        return sum + Number(final || 0);
      }, 0),
    [banks]
  );

  return (
    <div className="space-y-4">
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white">
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
          {currentBanks.map((b, i) => {
            const final =
              typeof b.computed_balance === "number" ? b.computed_balance : b.balance;
            return (
              <tr key={b.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="p-3">{startIndex + i + 1}</td>
                <td className="p-3 font-medium">{b.bank_name}</td>
                <td className="p-3">{b.account_number}</td>
                <td className="p-3">{b.account_name}</td>
                <td className="p-3 font-semibold text-indigo-600">
                  {formatCurrency(b.balance)}
                </td>
                <td className="p-3 font-semibold text-indigo-600">
                  {formatCurrency(final)}
                </td>
                <td className="p-3 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(b)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(b.id)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            );
          })}

          {banks.length === 0 && (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">
                Tidak ada data bank.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {banks.length > 0 && (
        <div className="flex justify-end">
          <div className="px-4 py-2 bg-gray-50 border rounded-lg text-sm font-semibold">
            Total Saldo:{" "}
            <span className="text-indigo-600">{formatCurrency(totalBalance)}</span>
          </div>
        </div>
      )}

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
