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
  lot_size?: number;
  type?: { id: number; name: string };
}

interface AssetTableProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (id: number) => void;
}

const renderLotSize = (asset: Asset) => {
  const isStock = (asset.type?.name ?? "").toLowerCase() === "saham";
  if (!isStock) return "—";
  const ls = Number(asset.lot_size ?? 1);
  return ls > 1 ? `1 lot = ${ls.toLocaleString("id-ID")} unit` : "1";
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
            <th className="text-left p-3">Lot Size</th>
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
              <td className="p-3">{renderLotSize(asset)}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(asset)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(asset.id)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
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
