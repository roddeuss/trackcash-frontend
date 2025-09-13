"use client";

import { Transaction } from "@/hooks/useTransaction";
import { formatDateTime, formatCurrency } from "@/utils/format";

interface Props {
  transactions: Transaction[];
  onEdit: (trx: Transaction) => void;
  onDelete: (id: number) => void;
}

export default function TransactionTable({ transactions, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg shadow border">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">Tanggal</th>
            <th className="p-3 border">Kategori</th>
            <th className="p-3 border">Bank</th>
            <th className="p-3 border">Deskripsi</th>
            <th className="p-3 border">Jumlah</th>
            <th className="p-3 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((trx) => (
            <tr key={trx.id} className="hover:bg-gray-50">
              <td className="p-3 border">{formatDateTime(trx.transaction_date)}</td>
              <td className="p-3 border">{trx.category?.name || "-"}</td>
              <td className="p-3 border">{trx.bank?.bank_name || "-"}</td>
              <td className="p-3 border">{trx.description || "-"}</td>
              <td
                className={`p-3 font-bold ${
                  trx.category?.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(trx.amount)}
              </td>
              <td className="p-3 border">
                <button
                  onClick={() => onEdit(trx)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(trx.id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                Tidak ada transaksi
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
