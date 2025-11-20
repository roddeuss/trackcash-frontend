"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { RecurringTransaction } from "@/hooks/useRecurringTransactions";
import Pagination from "@/components/common/Pagination";

export default function RecurringTable({
  items,
  onEdit,
  onDelete,
}: {
  items: RecurringTransaction[];
  onEdit: (item: RecurringTransaction) => void;
  onDelete: (id: number) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(items.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentItems = items.slice(startIndex, startIndex + rowsPerPage);

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    const d = new Date(value);
    return d.toLocaleDateString("id-ID");
  };

  return (
    <div>
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">#</th>
            <th className="text-left p-3">Nama</th>
            <th className="text-left p-3">Tipe</th>
            <th className="text-right p-3">Amount</th>
            <th className="text-left p-3">Frekuensi</th>
            <th className="text-left p-3">Next Run</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{startIndex + index + 1}</td>
              <td className="p-3">{item.name}</td>
              <td className="p-3 capitalize">{item.type}</td>
              <td className="p-3 text-right">
                {item.amount.toLocaleString("id-ID")}
              </td>
              <td className="p-3 capitalize">{item.frequency}</td>
              <td className="p-3">{formatDate(item.next_run_at)}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.is_active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {item.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(item)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="p-4 text-center text-gray-500"
              >
                Belum ada recurring transactions.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {items.length > rowsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
