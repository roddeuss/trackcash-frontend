// app/investments/components/InvestmentForm.tsx
"use client";

import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { DateTimePicker } from "@/components/common/DateTimePicker";
import { useBank } from "@/hooks/useBank";
import { useAsset } from "@/hooks/useAsset";
import { useCategories } from "@/hooks/useCategories";
import { Investment } from "@/hooks/useInvestment";

type InputMode = "unit" | "lot";

export default function InvestmentForm({
    mode,
    open,
    onOpenChange,
    onSubmit,
    editing,
}: {
    mode: "buy" | "sell";
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSubmit: (payload: {
        mode: "buy" | "sell";
        asset_id?: number;
        investment_id?: number;
        bank_id: number;
        category_id: number;
        units: number;
        price_per_unit: number;
        transaction_date: string;
    }) => void;
    editing: Investment | null;
}) {
    const { banks } = useBank();
    const { assets } = useAsset();
    const { categories } = useCategories();

    const investmentCategories = useMemo(() => {
        const lc = (s?: string) => (s ?? "").toLowerCase();
        return categories.filter(
            c => lc(c.type).includes("investment") || lc(c.name).includes("investment")
        );
    }, [categories]);

    const [form, setForm] = useState({
        asset_id: "" as string | number,
        investment_id: "" as string | number,
        bank_id: "" as string | number,
        category_id: "" as string | number,
        unitsRaw: "",
        priceRaw: "",
        transaction_date: "",
    });

    const selectedAsset = useMemo(
        () => assets.find(a => String(a.id) === String(form.asset_id)),
        [assets, form.asset_id]
    );

    const isStock = useMemo(() => {
        const t = selectedAsset?.type?.name?.toLowerCase();
        return t === "saham";
    }, [selectedAsset]);

    const lotSize = isStock ? Number((selectedAsset as any)?.lot_size ?? 100) : 1;

    const [inputMode, setInputMode] = useState<InputMode>("unit");

    // Saat modal dibuka, kalau transaction_date kosong → set now()
    useEffect(() => {
        if (open && !form.transaction_date) {
            // Kalau DateTimePicker menerima ISO, ini oke:
            // Kalau perlu format lain (YYYY-MM-DD HH:mm:ss), ubah di sini.
            setForm((f) => ({ ...f, transaction_date: new Date().toISOString() }));
        }
    }, [open, form.transaction_date]);

    useEffect(() => {
        if (!isStock && inputMode !== "unit") setInputMode("unit");
    }, [isStock, inputMode]);

    useEffect(() => {
        if (mode === "sell" && editing) {
            setForm(f => ({
                ...f,
                investment_id: editing.id,
                asset_id: editing.asset_id,
            }));
        } else if (mode === "buy") {
            setForm(f => ({ ...f, investment_id: "" }));
        }
    }, [mode, editing]);

    const handleOpenChange = (v: boolean) => {
        if (!v) {
            setForm({
                asset_id: "",
                investment_id: "",
                bank_id: "",
                category_id: "",
                unitsRaw: "",
                priceRaw: "",
                transaction_date: "",
            });
        }
        onOpenChange(v);
    };

    const preview = useMemo(() => {
        const unitsRaw = Number(form.unitsRaw || 0);
        const priceRaw = Number(form.priceRaw || 0);

        if (!isStock) {
            return { unitsFinal: unitsRaw, pricePerUnitFinal: priceRaw, hint: "" };
        }
        if (inputMode === "lot") {
            const unitsFinal = unitsRaw * lotSize;
            const pricePerUnitFinal = lotSize > 0 ? priceRaw / lotSize : 0;
            return {
                unitsFinal,
                pricePerUnitFinal,
                hint: `Konversi: ${unitsRaw || 0} lot × ${lotSize} = ${unitsFinal} lembar, harga/lembar ≈ ${pricePerUnitFinal.toLocaleString("id-ID")}`,
            };
        }
        return { unitsFinal: unitsRaw, pricePerUnitFinal: priceRaw, hint: "" };
    }, [form.unitsRaw, form.priceRaw, isStock, inputMode, lotSize]);

    const handleSubmit = () => {
        const payload = {
            mode,
            asset_id: mode === "buy" ? Number(form.asset_id) : undefined,
            investment_id: mode === "sell" ? Number(form.investment_id || editing?.id) : undefined,
            bank_id: Number(form.bank_id),
            category_id: Number(form.category_id),
            units: Number(preview.unitsFinal || 0),
            price_per_unit: Number(preview.pricePerUnitFinal || 0),
            transaction_date: form.transaction_date, // sudah auto diisi saat modal open
        };
        onSubmit(payload);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "buy" ? "Beli Investasi" : "Jual Investasi"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {mode === "buy" ? (
                        <Select
                            value={form.asset_id ? String(form.asset_id) : ""}
                            onValueChange={(v) => setForm({ ...form, asset_id: v })}
                        >
                            <SelectTrigger><SelectValue placeholder="Pilih Aset" /></SelectTrigger>
                            <SelectContent>
                                {assets.map((a) => (
                                    <SelectItem key={a.id} value={String(a.id)}>
                                        {a.asset_code} - {a.asset_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Input
                            disabled
                            value={
                                editing
                                    ? `${editing.asset?.asset_code ?? ""} - ${editing.asset?.asset_name ?? ""}`
                                    : ""
                            }
                        />
                    )}

                    <Select
                        value={form.bank_id ? String(form.bank_id) : ""}
                        onValueChange={(v) => setForm({ ...form, bank_id: v })}
                    >
                        <SelectTrigger><SelectValue placeholder="Pilih Bank" /></SelectTrigger>
                        <SelectContent>
                            {banks.map((b) => (
                                <SelectItem key={b.id} value={String(b.id)}>
                                    {b.bank_name} - {b.account_number}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={form.category_id ? String(form.category_id) : ""}
                        onValueChange={(v) => setForm({ ...form, category_id: v })}
                    >
                        <SelectTrigger><SelectValue placeholder="Pilih Kategori Investasi" /></SelectTrigger>
                        <SelectContent>
                            {(investmentCategories.length ? investmentCategories : categories).map((c) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                    {c.name} ({c.type})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {isStock && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Mode input:</span>
                            <Select value={inputMode} onValueChange={(v) => setInputMode(v as InputMode)}>
                                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unit">Per Unit (lembar)</SelectItem>
                                    <SelectItem value="lot">Per Lot</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="ml-auto text-xs text-gray-500">
                                Lot size: {lotSize.toLocaleString("id-ID")} unit/lot
                            </span>
                        </div>
                    )}

                    <Input
                        type="number"
                        placeholder={isStock && inputMode === "lot" ? "Jumlah Lot" : "Jumlah Unit"}
                        value={form.unitsRaw}
                        onChange={(e) => setForm({ ...form, unitsRaw: e.target.value })}
                    />

                    <Input
                        type="number"
                        placeholder={isStock && inputMode === "lot" ? "Harga per Lot" : "Harga per Unit"}
                        value={form.priceRaw}
                        onChange={(e) => setForm({ ...form, priceRaw: e.target.value })}
                    />

                    {(isStock && inputMode === "lot") && (
                        <p className="text-xs text-gray-600">{preview.hint}</p>
                    )}

                    <DateTimePicker
                        value={form.transaction_date}
                        onChange={(val) =>
                            setForm({
                                ...form,
                                transaction_date:
                                    typeof val === "string" ? val : new Date(val).toISOString(),
                            })
                        }
                    />

                    <Button onClick={handleSubmit} className="w-full">
                        {mode === "buy" ? "Simpan Pembelian" : "Simpan Penjualan"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
