"use client";

import { Button } from "@/components/ui/button";
import { Transaction } from "@/hooks/useTransaction";
import { formatCurrency } from "@/utils/format";

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[];
  onEdit: (trx: Transaction) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm">
            <th className="p-3">Tanggal</th>
            <th className="p-3">Kategori</th>
            <th className="p-3">Bank</th>
            <th className="p-3">Jumlah</th>
            <th className="p-3">Deskripsi</th>
            <th className="p-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                Tidak ada transaksi
              </td>
            </tr>
          ) : (
            transactions.map((trx) => (
              <tr key={trx.id} className="border-t">
                <td className="p-3">{trx.transaction_date}</td>
                <td className="p-3">{trx.category?.name || "-"}</td>
                <td className="p-3">{trx.bank?.bank_name || "-"}</td>
                <td
                  className={`p-3 font-bold ${
                    trx.category?.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {trx.amount?.toLocaleString("id-ID", { style: "currency", currency: "IDR" }) ?? "-"}
                </td>
                <td className="p-3">{trx.description || "-"}</td>
                <td className="p-3 text-right space-x-2">
                  <Button size="sm" onClick={() => onEdit(trx)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(trx.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

