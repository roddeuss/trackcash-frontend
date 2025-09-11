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

interface TypeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { name: string }) => void;
  editingType?: { id: number; name: string } | null;
}

export default function TypeForm({
  open,
  onOpenChange,
  onSave,
  editingType,
}: TypeFormProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editingType) {
      setName(editingType.name);
    } else {
      setName("");
    }
  }, [editingType]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ name });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingType ? "Edit Tipe" : "Tambah Tipe"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Nama Tipe (mis. Saham, Crypto)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit}>
              {editingType ? "Update" : "Simpan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
