"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { RecurringTransaction } from "@/hooks/useRecurringTransactions";
import type { Bank } from "@/hooks/useBank";

interface CategoryOption {
  id: number;
  name: string;
}

interface FormState {
  name: string;
  type: "income" | "expense" | "";
  amount: string;
  category_id: string;
  bank_id: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly" | "";
  day_of_month: string;
  day_of_week: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (data: Partial<RecurringTransaction>) => void;
  editing: RecurringTransaction | null;
  categories: CategoryOption[];
  banks: Bank[];
};

export default function RecurringForm({
  open,
  onOpenChange,
  onSave,
  editing,
  categories,
  banks,
}: Props) {
  const [form, setForm] = useState<FormState>({
    name: "",
    type: "",
    amount: "",
    category_id: "",
    bank_id: "",
    frequency: "monthly",
    day_of_month: "",
    day_of_week: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        type: editing.type,
        amount: editing.amount.toString(),
        category_id: editing.category_id ? String(editing.category_id) : "",
        bank_id: editing.bank_id ? String(editing.bank_id) : "",
        frequency: editing.frequency,
        day_of_month: editing.day_of_month ? String(editing.day_of_month) : "",
        day_of_week: editing.day_of_week ? String(editing.day_of_week) : "",
        start_date: editing.start_date ?? "",
        end_date: editing.end_date ?? "",
        is_active: editing.is_active,
      });
    } else {
      setForm({
        name: "",
        type: "",
        amount: "",
        category_id: "",
        bank_id: "",
        frequency: "monthly",
        day_of_month: "",
        day_of_week: "",
        start_date: "",
        end_date: "",
        is_active: true,
      });
    }
  }, [editing]);

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.type || !form.amount || !form.frequency) return;

    const payload: Partial<RecurringTransaction> = {
      name: form.name,
      type: form.type as "income" | "expense",
      amount: parseFloat(form.amount),
      category_id: form.category_id ? Number(form.category_id) : null,
      bank_id: form.bank_id ? Number(form.bank_id) : null,
      frequency: form.frequency as any,
      is_active: form.is_active,
    };

    if (form.frequency === "monthly" && form.day_of_month) {
      payload.day_of_month = Number(form.day_of_month);
    }
    if (form.frequency === "weekly" && form.day_of_week) {
      payload.day_of_week = Number(form.day_of_week);
    }
    if (form.start_date) payload.start_date = form.start_date;
    if (form.end_date) payload.end_date = form.end_date;

    onSave(payload);
  };

  const showDayOfMonth = form.frequency === "monthly";
  const showDayOfWeek = form.frequency === "weekly";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Recurring Transaction" : "Tambah Recurring Transaction"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Nama (contoh: Gaji Bulanan)"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="border rounded p-2 w-full text-sm"
            >
              <option value="">-- Tipe --</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <Input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.category_id}
              onChange={(e) => handleChange("category_id", e.target.value)}
              className="border rounded p-2 w-full text-sm"
            >
              <option value="">-- Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={form.bank_id}
              onChange={(e) => handleChange("bank_id", e.target.value)}
              className="border rounded p-2 w-full text-sm"
            >
              <option value="">-- Bank (opsional) --</option>
              {banks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bank_name} - {b.account_number}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.frequency}
              onChange={(e) =>
                handleChange("frequency", e.target.value as FormState["frequency"])
              }
              className="border rounded p-2 w-full text-sm"
            >
              <option value="">-- Frekuensi --</option>
              <option value="daily">Harian</option>
              <option value="weekly">Mingguan</option>
              <option value="monthly">Bulanan</option>
              <option value="yearly">Tahunan</option>
            </select>

            {showDayOfMonth && (
              <Input
                type="number"
                min={1}
                max={31}
                placeholder="Tanggal (1-31)"
                value={form.day_of_month}
                onChange={(e) => handleChange("day_of_month", e.target.value)}
              />
            )}

            {showDayOfWeek && (
              <select
                value={form.day_of_week}
                onChange={(e) => handleChange("day_of_week", e.target.value)}
                className="border rounded p-2 w-full text-sm"
              >
                <option value="">-- Hari --</option>
                <option value="1">Senin</option>
                <option value="2">Selasa</option>
                <option value="3">Rabu</option>
                <option value="4">Kamis</option>
                <option value="5">Jumat</option>
                <option value="6">Sabtu</option>
                <option value="0">Minggu</option>
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 text-xs">
              <label className="text-muted-foreground">Start Date</label>
              <Input
                type="date"
                value={form.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
              />
            </div>
            <div className="space-y-1 text-xs">
              <label className="text-muted-foreground">End Date (opsional)</label>
              <Input
                type="date"
                value={form.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => handleChange("is_active", e.target.checked)}
            />
            <span>Aktif</span>
          </label>

          <Button onClick={handleSubmit} className="w-full">
            {editing ? "Update" : "Simpan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
