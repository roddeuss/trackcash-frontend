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

interface Bank {
    id: number;
    bank_name: string;
    account_number: string;
    account_name: string;
    balance: number;
}

export default function BankForm({
    open,
    onOpenChange,
    onSave,
    editingBank,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSave: (data: {
        bank_name: string;
        account_number: string;
        account_name: string;
        balance: number;
    }) => void;
    editingBank: Bank | null;
}) {
    const [form, setForm] = useState({
        bank_name: "",
        account_number: "",
        account_name: "",
        balance: 0,
    });

    useEffect(() => {
        if (editingBank) {
            setForm({
                bank_name: editingBank.bank_name,
                account_number: editingBank.account_number,
                account_name: editingBank.account_name,
                balance: editingBank.balance,
            });
        } else {
            setForm({
                bank_name: "",
                account_number: "",
                account_name: "",
                balance: 0,
            });
        }
    }, [editingBank]);

    const handleSubmit = () => {
        onSave(form);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editingBank ? "Edit Bank" : "Tambah Bank"}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                    <Input
                        placeholder="Nama Bank"
                        value={form.bank_name}
                        onChange={(e) =>
                            setForm({ ...form, bank_name: e.target.value })
                        }
                    />
                    <Input
                        placeholder="Nomor Rekening"
                        value={form.account_number}
                        onChange={(e) =>
                            setForm({ ...form, account_number: e.target.value })
                        }
                    />
                    <Input
                        placeholder="Nama Pemilik Rekening"
                        value={form.account_name}
                        onChange={(e) =>
                            setForm({ ...form, account_name: e.target.value })
                        }
                    />
                    <Input
                        type="number"
                        placeholder="Saldo Awal"
                        value={form.balance}
                        onChange={(e) =>
                            setForm({ ...form, balance: Number(e.target.value) })
                        }
                    />
                    <Button onClick={handleSubmit} className="w-full">
                        {editingBank ? "Update" : "Simpan"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
