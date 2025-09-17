"use client";

import { useEffect, useMemo, useState } from "react";
import { Budget, BudgetPeriod } from "@/hooks/useBudget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Category = { id: number; name: string; type: string };

export default function BudgetForm({
  open,
  onOpenChange,
  onSave,
  categories,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (payload: {
    category_id: number;
    name?: string;
    amount: number;
    period: BudgetPeriod;
    start_date?: string | null;
    end_date?: string | null;
  }) => void;
  categories: Category[];
  editing: Budget | null;
}) {
  const [form, setForm] = useState({
    category_id: "" as string | number,
    name: "",
    amount: "",
    period: "monthly" as BudgetPeriod,
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        category_id: editing.category_id,
        name: editing.name || "",
        amount: String(editing.amount ?? ""),
        period: editing.period,
        start_date: editing.start_date || "",
        end_date: editing.end_date || "",
      });
    } else {
      setForm({
        category_id: "",
        name: "",
        amount: "",
        period: "monthly",
        start_date: "",
        end_date: "",
      });
    }
  }, [editing, open]);

  const isCustom = form.period === "custom";

  const validCategories = useMemo(
    () => categories.filter(c => (c.type || "").toLowerCase() === "expense"),
    [categories]
  );

  const handleSubmit = () => {
    const payload = {
      category_id: Number(form.category_id),
      name: form.name.trim() || undefined,
      amount: Number(form.amount || 0),
      period: form.period,
      start_date: isCustom && form.start_date ? new Date(form.start_date).toISOString() : undefined,
      end_date: isCustom && form.end_date ? new Date(form.end_date).toISOString() : undefined,
    };
    onSave(payload);
  };

  const title = editing ? "Edit Budget" : "Tambah Budget";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Category (expense only) */}
          <Select
            value={form.category_id ? String(form.category_id) : ""}
            onValueChange={(v) => setForm({ ...form, category_id: v })}
          >
            <SelectTrigger><SelectValue placeholder="Pilih kategori (expense)" /></SelectTrigger>
            <SelectContent>
              {validCategories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Optional name */}
          <Input
            placeholder="Nama budget (opsional)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* Amount */}
          <Input
            type="number"
            placeholder="Jumlah budget"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          {/* Period */}
          <Select
            value={form.period}
            onValueChange={(v) => setForm({ ...form, period: v as BudgetPeriod })}
          >
            <SelectTrigger><SelectValue placeholder="Period" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {/* Custom dates */}
          {isCustom && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Start date</label>
                <Input
                  type="datetime-local"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">End date</label>
                <Input
                  type="datetime-local"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                />
              </div>
            </div>
          )}

          <Button onClick={handleSubmit} className="w-full">
            {editing ? "Simpan Perubahan" : "Simpan Budget"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
