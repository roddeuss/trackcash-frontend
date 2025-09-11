"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import Pagination from "@/components/common/Pagination";

interface Type {
  id: number;
  name: string;
}

export default function TypeTable({
  types,
  onEdit,
  onDelete,
}: {
  types: Type[];
  onEdit: (type: Type) => void;
  onDelete: (id: number) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(types.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTypes = types.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">#</th>
            <th className="text-left p-3">Nama Tipe</th>
            <th className="text-left p-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentTypes.map((type, index) => (
            <tr key={type.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{startIndex + index + 1}</td>
              <td className="p-3">{type.name}</td>
              <td className="p-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(type)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(type.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
          {types.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                Tidak ada data tipe.
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
