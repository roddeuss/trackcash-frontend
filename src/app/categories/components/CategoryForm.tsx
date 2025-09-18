"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface Category {
    id: number;
    type: string; // income, expense, investment
    name: string;
}

export default function CategoryForm({
    open,
    onOpenChange,
    onSave,
    editingCategory,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSave: (data: { type: string; name: string }) => void;
    editingCategory: Category | null;
}) {
    const [form, setForm] = useState({
        type: "",
        name: "",
    });

    useEffect(() => {
        if (editingCategory) {
            setForm({
                type: editingCategory.type,
                name: editingCategory.name,
            });
        } else {
            setForm({ type: "", name: "" });
        }
    }, [editingCategory]);

    const handleSubmit = () => {
        if (!form.type || !form.name) return;
        onSave({
            type: form.type.toLowerCase(),
            name: form.name,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editingCategory ? "Edit Category" : "Tambah Category"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <Input
                        placeholder="Nama Category"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />

                    <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="border rounded p-2 w-full"
                    >
                        <option value="">-- Pilih Tipe --</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                        <option value="investment">Investment</option>
                    </select>

                    <Button onClick={handleSubmit} className="w-full">
                        {editingCategory ? "Update" : "Simpan"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
