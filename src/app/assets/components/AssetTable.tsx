"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import Pagination from "@/components/common/Pagination";

interface Asset {
  id: number;
  type_id: number;
  asset_code: string;
  asset_name: string;
  quantity: number;
  type?: { id: number; name: string }; // relasi type
}

interface AssetTableProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (id: number) => void;
}

// 🔹 Helper untuk format quantity sesuai tipe
const formatQuantity = (asset: Asset) => {
  const type = asset.type?.name?.toLowerCase();

  // saham → lot, biasanya integer
  if (type === "saham") {
    return `${Number(asset.quantity).toLocaleString("id-ID", { maximumFractionDigits: 0 })} lot`;
  }

  // emas → gram, biasanya 2 desimal
  if (type === "gold" || type === "emas") {
    return `${Number(asset.quantity).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gr`;
  }

  // crypto → sampai 8 desimal
  if (type === "crypto" || type === "cryptocurrency") {
    return `${Number(asset.quantity).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${asset.asset_code}`;
  }

  // default → 2 desimal
  return Number(asset.quantity).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function AssetTable({ assets, onEdit, onDelete }: AssetTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(assets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAssets = assets.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">#</th>
            <th className="text-left p-3">Tipe</th>
            <th className="text-left p-3">Kode</th>
            <th className="text-left p-3">Nama Aset</th>
            <th className="text-left p-3">Jumlah</th>
            <th className="text-left p-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentAssets.map((asset, index) => (
            <tr key={asset.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{startIndex + index + 1}</td>
              <td className="p-3">{asset.type?.name || "-"}</td>
              <td className="p-3">{asset.asset_code}</td>
              <td className="p-3">{asset.asset_name}</td>
              <td className="p-3">{formatQuantity(asset)}</td>
              <td className="p-3 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(asset)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(asset.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}

          {assets.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                Tidak ada data aset.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
