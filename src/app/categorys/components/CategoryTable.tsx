"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import Pagination from "@/components/common/Pagination";

interface Category {
    id: number;
    type: string;
    name: string;
}

export default function CategoryTable({
    categories,
    onEdit,
    onDelete,
}: {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const totalPages = Math.ceil(categories.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentCategories = categories.slice(
        startIndex,
        startIndex + rowsPerPage
    );

    return (
        <div>
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-3">#</th>
                        <th className="text-left p-3">Nama</th>
                        <th className="text-left p-3">Tipe</th>
                        <th className="text-left p-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCategories.map((category, index) => (
                        <tr
                            key={category.id}
                            className="border-t hover:bg-gray-50"
                        >
                            <td className="p-3">{startIndex + index + 1}</td>
                            <td className="p-3">{category.name}</td>
                            <td className="p-3">{category.type}</td>
                            <td className="p-3 flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(category)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onDelete(category.id)}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </td>
                        </tr>
                    ))}

                    {categories.length === 0 && (
                        <tr key="empty">
                            <td
                                colSpan={4}
                                className="p-4 text-center text-gray-500"
                            >
                                Tidak ada data category.
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>

            {categories.length > rowsPerPage && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}
