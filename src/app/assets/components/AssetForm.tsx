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

interface Type {
  id: number;
  name: string;
}

interface AssetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    type_id: number;
    asset_code: string;
    asset_name: string;
    quantity: number;
  }) => void;
  editingAsset?: {
    id: number;
    type_id: number;
    asset_code: string;
    asset_name: string;
    quantity: number;
  } | null;
  types: Type[]; // dropdown untuk pilih type
}

export default function AssetForm({
  open,
  onOpenChange,
  onSave,
  editingAsset,
  types,
}: AssetFormProps) {
  const [typeId, setTypeId] = useState<number>(0);
  const [asset_code, setCode] = useState("");
  const [asset_name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (editingAsset) {
      setTypeId(editingAsset.type_id);
      setCode(editingAsset.asset_code);
      setName(editingAsset.asset_name);
      setQuantity(editingAsset.quantity);
    } else {
      setTypeId(types.length > 0 ? types[0].id : 0);
      setCode("");
      setName("");
      setQuantity(0);
    }
  }, [editingAsset, types]);

  const handleSubmit = () => {
    if (!typeId) {
      alert("Pilih tipe aset terlebih dahulu");
      return;
    }
    onSave({
      type_id: typeId,
      asset_code,
      asset_name,
      quantity,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingAsset ? "Edit Aset" : "Tambah Aset"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Dropdown Type */}
          <select
            className="w-full border rounded-lg p-2"
            value={typeId}
            onChange={(e) => setTypeId(Number(e.target.value))}
          >
            <option value="">-- Pilih Tipe --</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <Input
            placeholder="Kode Aset (misal: BBCA, BTC)"
            value={asset_code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Input
            placeholder="Nama Aset"
            value={asset_name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Jumlah"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit}>
              {editingAsset ? "Update" : "Simpan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
