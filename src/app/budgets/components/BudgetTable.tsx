"use client";

import { useMemo, useState } from "react";
import { Budget } from "@/hooks/useBudget";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { Progress } from "@/components/ui/progress"; // shadcn/ui progress

export default function BudgetTable({
  budgets,
  onEdit,
  onDelete,
}: {
  budgets: Budget[];
  onEdit: (b: Budget) => void;
  onDelete: (id: number) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return budgets;
    const q = query.toLowerCase();
    return budgets.filter(b =>
      (b.name || "").toLowerCase().includes(q) ||
      (b.category?.name || "").toLowerCase().includes(q) ||
      (b.period || "").toLowerCase().includes(q)
    );
  }, [budgets, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama/kategori/period…"
          className="border rounded px-3 py-2 w-80"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">Kategori</th>
              <th className="p-3 border">Period</th>
              <th className="p-3 border">Window</th>
              <th className="p-3 border">Budget</th>
              <th className="p-3 border">Spent</th>
              <th className="p-3 border">Remaining</th>
              <th className="p-3 border">Progress</th>
              <th className="p-3 border w-[120px]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => {
              const progress = Math.min(100, Math.max(0, Number(b.progress ?? 0)));
              const windowText = b.window
                ? `${b.window.start} → ${b.window.end}`
                : "-";
              return (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{b.name || "-"}</td>
                  <td className="p-3 border">{b.category?.name || "-"}</td>
                  <td className="p-3 border capitalize">{b.period}</td>
                  <td className="p-3 border text-xs text-gray-600">{windowText}</td>
                  <td className="p-3 border">{formatCurrency(b.amount)}</td>
                  <td className="p-3 border text-red-600">{formatCurrency(b.spent ?? 0)}</td>
                  <td className="p-3 border text-green-700">{formatCurrency(b.remaining ?? 0)}</td>
                  <td className="p-3 border">
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="w-40" />
                      <span className="text-xs">{progress}%</span>
                    </div>
                  </td>
                  <td className="p-3 border">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onEdit(b)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(b.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-500">
                  Belum ada budget.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
