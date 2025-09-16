"use client";

import { Investment } from "@/hooks/useInvestment";
import { formatCurrency } from "@/utils/format";

export default function InvestmentTable({
    investments,
    onSell,
    onDelete,
}: {
    investments: Investment[];
    onSell: (inv: Investment) => void;
    onDelete: (id: number) => void;
}) {
    return (
        <div className="overflow-x-auto rounded-lg shadow border">
            <table className="w-full border-collapse bg-white">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-3 border">Aset</th>
                        <th className="p-3 border">Units</th>
                        <th className="p-3 border">Avg Buy Price</th>
                        <th className="p-3 border">Total Cost</th>
                        <th className="p-3 border">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {investments.map((i) => (
                        <tr key={i.id} className="hover:bg-gray-50">
                            <td className="p-3 border">
                                {i.asset?.asset_code} - {i.asset?.asset_name}
                            </td>
                            <td className="p-3 border">{i.units}</td>
                            <td className="p-3 border">{formatCurrency(i.average_buy_price)}</td>
                            <td className="p-3 border">
                                {formatCurrency(i.units * i.average_buy_price)}
                            </td>
                            <td className="p-3 border">
                                <button
                                    onClick={() => onSell(i)}
                                    className="text-blue-600 hover:underline mr-3"
                                >
                                    Jual
                                </button>
                                <button
                                    onClick={() => onDelete(i.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}

                    {investments.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-4 text-center text-gray-500">
                                Tidak ada investasi
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
