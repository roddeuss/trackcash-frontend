"use client";

import { useMemo, useState } from "react";
import { Budget } from "@/hooks/useBudget";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { Progress } from "@/components/ui/progress";

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
    return budgets.filter(
      (b) =>
        (b.name || "").toLowerCase().includes(q) ||
        (b.category?.name || "").toLowerCase().includes(q) ||
        (b.period || "").toLowerCase().includes(q)
    );
  }, [budgets, query]);

  const windowLabel = (b: Budget) =>
    b.window ? `${b.window.start} → ${b.window.end}` : "-";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama/kategori/period…"
          className="border rounded px-3 py-2 w-80 bg-white"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-gray-50/80 text-left text-gray-600 text-sm">
              <th className="p-3 border w-[18%]">Nama</th>
              <th className="p-3 border w-[14%]">Kategori</th>
              <th className="p-3 border w-[10%]">Period</th>
              <th className="p-3 border w-[22%]">Window</th>
              <th className="p-3 border w-[10%] text-right">Budget</th>
              <th className="p-3 border w-[10%] text-right">Spent</th>
              <th className="p-3 border w-[10%] text-right">Remaining</th>
              <th className="p-3 border w-[12%]">Progress</th>
              <th className="p-3 border w-[10%] text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {filtered.map((b, idx) => {
              const progress = Math.min(100, Math.max(0, Number(b.progress ?? 0)));
              return (
                <tr
                  key={b.id}
                  className={`align-middle ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                    } hover:bg-gray-50`}
                >
                  <td className="p-3 border">{b.name || "-"}</td>
                  <td className="p-3 border">{b.category?.name || "-"}</td>
                  <td className="p-3 border capitalize">{b.period}</td>

                  <td className="p-3 border">
                    <div
                      title={windowLabel(b)}
                      className="truncate whitespace-nowrap text-gray-700"
                    >
                      {windowLabel(b)}
                    </div>
                  </td>

                  <td className="p-3 border text-right font-medium">
                    {formatCurrency(b.amount)}
                  </td>
                  <td className="p-3 border text-right font-medium text-red-600">
                    {formatCurrency(b.spent ?? 0)}
                  </td>
                  <td className="p-3 border text-right font-medium text-green-700">
                    {formatCurrency(b.remaining ?? 0)}
                  </td>

                  <td className="p-3 border">
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="w-full" />
                      <span className="text-xs text-gray-600 min-w-[2.5rem] text-right">
                        {progress}%
                      </span>
                    </div>
                  </td>

                  <td className="p-3 border">
                    <div className="flex items-center justify-center gap-2">
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
                <td colSpan={9} className="p-6 text-center text-gray-500">
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
