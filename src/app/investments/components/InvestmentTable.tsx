"use client";

import { useState } from "react";
import { Investment } from "@/hooks/useInvestment";
import { formatDateTime, formatCurrency } from "@/utils/format";

export default function InvestmentTable({
  investments,
  onSell,
  onDelete,
}: {
  investments: Investment[];
  onSell: (inv: Investment) => void;
  onDelete: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);

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
            <>
              <tr
                key={i.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setExpanded(expanded === i.id ? null : i.id)}
              >
                <td className="p-3 border">
                  {i.asset?.asset_code} - {i.asset?.asset_name}
                </td>
                <td className="p-3 border">
                  {/* format lot kalau saham */}
                  {i.units % 1 === 0 ? `${i.units / 100} lot` : i.units}
                </td>
                <td className="p-3 border">
                  {formatCurrency(i.average_buy_price)}
                </td>
                <td className="p-3 border">
                  {formatCurrency(i.units * i.average_buy_price)}
                </td>
                <td className="p-3 border">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSell(i);
                    }}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Jual
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(i.id);
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>

              {expanded === i.id && i.transactions && (
                <tr>
                  <td colSpan={5} className="p-3 border bg-gray-50">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-600">
                          <th className="p-2 border">Tanggal</th>
                          <th className="p-2 border">Tipe</th>
                          <th className="p-2 border">Units</th>
                          <th className="p-2 border">Harga/Unit</th>
                          <th className="p-2 border">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {i.transactions.map((t) => (
                          <tr key={t.id}>
                              <td className="p-2 border ">{formatDateTime(t.transaction_date)}</td>
                            <td className="p-2 border capitalize">{t.type}</td>
                            <td className="p-2 border">{t.units}</td>
                            <td className="p-2 border">
                              {formatCurrency(t.price_per_unit)}
                            </td>
                            <td className="p-2 border">
                              {formatCurrency(t.units * t.price_per_unit)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </>
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
