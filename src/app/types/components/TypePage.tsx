"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import TypeTable from "./TypeTable";
import TypeForm from "./TypeForm";
import { API_URL } from "@/lib/api";
import Swal from "sweetalert2";

interface Type {
  id: number;
  name: string;
}

export default function TypePage() {
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingType, setEditingType] = useState<Type | null>(null);

  const fetchTypes = async () => {
    try {
      const res = await fetch(`${API_URL}/types`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("Gagal mengambil data tipe");
      const data = await res.json();
      setTypes(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Fetch types error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleSave = async (data: { name: string }) => {
    try {
      if (editingType) {
        const res = await fetch(`${API_URL}/types/${editingType.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Gagal update tipe");
        Swal.fire("Berhasil", "Tipe berhasil diperbarui", "success");
      } else {
        const res = await fetch(`${API_URL}/types`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Gagal tambah tipe");
        Swal.fire("Berhasil", "Tipe berhasil ditambahkan", "success");
      }
      await fetchTypes();
    } catch (err) {
      Swal.fire("Error", "Terjadi kesalahan saat menyimpan data tipe", "error");
    } finally {
      setEditingType(null);
      setOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus tipe ini?")) return;
    try {
      const res = await fetch(`${API_URL}/types/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Gagal hapus tipe");
      Swal.fire("Berhasil", "Tipe berhasil dihapus", "success");
      await fetchTypes();
    } catch (err) {
      Swal.fire("Error", "Terjadi kesalahan saat menghapus tipe", "error");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="flex">
      <Sidebar onLogout={() => console.log("logout")} />
      <main className="flex-1 p-6 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Master Data - Types</h1>
          <Button
            onClick={() => {
              setEditingType(null);
              setOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Tipe
          </Button>
        </div>

        <TypeTable
          types={types}
          onEdit={(type) => {
            setEditingType(type);
            setOpen(true);
          }}
          onDelete={handleDelete}
        />

        <TypeForm
          open={open || !!editingType}
          onOpenChange={setOpen}
          onSave={handleSave}
          editingType={editingType}
        />
      </main>
    </div>
  );
}
