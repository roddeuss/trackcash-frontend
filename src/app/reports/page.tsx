"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import UnauthorizedPage from "@/app/unauthorized/page";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet, FileText } from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import { useReports } from "@/hooks/useReports";

const PIE_COLORS = ["#6366F1", "#EC4899", "#F97316", "#22C55E", "#0EA5E9", "#A855F7"];

export default function ReportsPage() {
  const { user, loading: authLoading, logout } = useAuth();

  // ambil data report dari backend
  const {
    summary,
    cashflow,
    allocation,
    loading: reportLoading,
    error,
  } = useReports("year", "month");

  const isLoading = authLoading || reportLoading;

  // 🔹 SEMUA HOOK (useMemo) DIPANGGIL SEBELUM CONDITIONAL RETURN 🔹
  const pieData = useMemo(
    () => allocation.map((a) => ({ name: a.category, value: a.total })),
    [allocation]
  );

  const csvData = useMemo(() => {
    const header = ["Period", "Income", "Expense", "Net"];
    const rows = cashflow.map((row) => [
      row.label || row.period,
      row.income.toString(),
      row.expense.toString(),
      row.net.toString(),
    ]);
    return [header, ...rows];
  }, [cashflow]);

  // ===== Loading state =====
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <UnauthorizedPage />;
  }

  const exportCSV = () => {
    const lines = csvData.map((cols) =>
      cols
        .map((c) => `"${c.replace(/"/g, '""')}"`)
        .join(",")
    );
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "laporan-trackcash.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    const lines = csvData.map((cols) =>
      cols
        .map((c) => `"${c.replace(/"/g, '""')}"`)
        .join(",")
    );
    const blob = new Blob([lines.join("\n")], {
      type: "application/vnd.ms-excel",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "laporan-trackcash.xls";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <AdminLayout username={user.name} onLogout={logout}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
            <p className="text-sm text-muted-foreground">
              Ringkasan cashflow, kategori pengeluaran, dan export data dari transaksi kamu.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <FileText className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportExcel}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button size="sm" onClick={exportPDF}>
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="mb-2 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded">
            {error}
          </p>
        )}

        {/* Summary cards */}
        {summary && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">Total Income</p>
              <p className="text-xl font-semibold text-emerald-600">
                {summary.income.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">Total Expense</p>
              <p className="text-xl font-semibold text-red-500">
                {summary.expense.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">Net</p>
              <p
                className={`text-xl font-semibold ${
                  summary.net >= 0 ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {summary.net.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pie chart */}
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold">
              Proporsi Pengeluaran per Kategori
            </h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Komposisi pengeluaran berdasarkan kategori.
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, idx) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[idx % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line chart */}
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold">
              Trend Cashflow ({cashflow.length > 0 ? "Periode" : "Tidak ada data"})
            </h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Perbandingan income dan expense per periode (group by bulan).
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashflow}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="#22C55E"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    name="Expense"
                    stroke="#EF4444"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabel */}
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold">Ringkasan Periode</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="border-b text-xs text-muted-foreground bg-gray-50">
                  <th className="px-3 py-2 text-left">Periode</th>
                  <th className="px-3 py-2 text-right">Income</th>
                  <th className="px-3 py-2 text-right">Expense</th>
                  <th className="px-3 py-2 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {cashflow.map((row) => (
                  <tr key={row.period} className="border-b last:border-0">
                    <td className="px-3 py-2">{row.label || row.period}</td>
                    <td className="px-3 py-2 text-right">
                      {row.income.toLocaleString("id-ID")}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {row.expense.toLocaleString("id-ID")}
                    </td>
                    <td
                      className={`px-3 py-2 text-right ${
                        row.net >= 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {row.net.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}

                {cashflow.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-sm text-muted-foreground"
                    >
                      Belum ada data transaksi untuk laporan pada range ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
