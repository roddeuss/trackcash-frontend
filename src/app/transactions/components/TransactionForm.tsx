"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Transaction } from "@/hooks/useTransaction";
import { useBank } from "@/hooks/useBank";
import { useAsset } from "@/hooks/useAsset";
import { useCategories } from "@/hooks/useCategories";
import { DateTimePicker } from "@/components/common/DateTimePicker";

export default function TransactionForm({
  open,
  onOpenChange,
  onSave,
  editingTransaction,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (
    data: Omit<Transaction, "id" | "user_id" | "bank" | "asset" | "category">
  ) => void;
  editingTransaction: Transaction | null;
}) {
  const { banks } = useBank();
  const { assets } = useAsset();
  const { categories } = useCategories();

  const [form, setForm] = useState({
    targetType: "bank", // default Bank
    bank_id: "" as string | number,
    asset_id: "" as string | number,
    category_id: "" as string | number,
    amount: "",
    description: "",
    transaction_date: "",
  });

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        targetType: editingTransaction.asset_id ? "asset" : "bank",
        bank_id: editingTransaction.bank_id || "",
        asset_id: editingTransaction.asset_id || "",
        category_id: editingTransaction.category_id || "",
        amount: editingTransaction.amount.toString(),
        description: editingTransaction.description || "",
        transaction_date: editingTransaction.transaction_date || "",
      });
    } else {
      setForm({
        targetType: "bank",
        bank_id: "",
        asset_id: "",
        category_id: "",
        amount: "",
        description: "",
        transaction_date: "",
      });
    }
  }, [editingTransaction]);

  const handleSubmit = () => {
    onSave({
      bank_id: form.targetType === "bank" && form.bank_id ? Number(form.bank_id) : undefined,
      asset_id: form.targetType === "asset" && form.asset_id ? Number(form.asset_id) : undefined,
      category_id: form.category_id ? Number(form.category_id) : undefined,
      amount: Number(form.amount),
      description: form.description,
      transaction_date: form.transaction_date,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingTransaction ? "Edit Transaksi" : "Tambah Transaksi"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Pilih target */}
          <Select
            value={form.targetType}
            onValueChange={(v) => setForm({ ...form, targetType: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tujuan transaksi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank">Bank</SelectItem>
              <SelectItem value="asset">Asset</SelectItem>
            </SelectContent>
          </Select>

          {/* Kalau Bank */}
          {form.targetType === "bank" && (
            <Select
              value={form.bank_id ? String(form.bank_id) : ""}
              onValueChange={(v) => setForm({ ...form, bank_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.bank_name} - {b.account_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Kalau Asset */}
          {form.targetType === "asset" && (
            <Select
              value={form.asset_id ? String(form.asset_id) : ""}
              onValueChange={(v) => setForm({ ...form, asset_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.asset_code} - {a.asset_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Category */}
          <Select
            value={form.category_id ? String(form.category_id) : ""}
            onValueChange={(v) => setForm({ ...form, category_id: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name} ({c.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Jumlah"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <Input
            placeholder="Deskripsi"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <DateTimePicker
            value={form.transaction_date}
            onChange={(val) => setForm({ ...form, transaction_date: val })}
          />


          <Button onClick={handleSubmit} className="w-full">
            {editingTransaction ? "Update" : "Simpan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
