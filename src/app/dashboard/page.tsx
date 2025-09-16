"use client";

import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/layout/AdminLayout";
import { Fade, Zoom } from "react-awesome-reveal";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";

const COLORS = ["#4F46E5", "#10B981", "#EF4444", "#F59E0B", "#6366F1"];
const RANGE_OPTIONS = [
  { key: "day", label: "Day" },
  { key: "week", label: "Weekly" },
  { key: "month", label: "Monthly" },
  { key: "year", label: "Year" },
] as const;

type RangeKey = typeof RANGE_OPTIONS[number]["key"];

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();

  const [range, setRange] = useState<RangeKey>("month");
  const [summary, setSummary] = useState({ income: 0, expense: 0, net: 0, investment: 0 });
  const [cashflow, setCashflow] = useState<any[]>([]);
  const [allocation, setAllocation] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchData = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setFetchError("Token tidak ditemukan. Silakan login lagi.");
      setFetching(false);
      return;
    }

    setFetching(true);
    setFetchError(null);
    try {
      const commonHeaders: HeadersInit = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };

      const [sRes, cRes, aRes] = await Promise.all([
        fetch(`${API_URL}/dashboard/summary?range=${range}`, { headers: commonHeaders, cache: "no-store" }),
        fetch(`${API_URL}/dashboard/cashflow?range=${range}`, { headers: commonHeaders, cache: "no-store" }),
        fetch(`${API_URL}/dashboard/allocation?range=${range}`, { headers: commonHeaders, cache: "no-store" }),
      ]);

      if (!sRes.ok) throw new Error(`summary: ${sRes.status} ${await sRes.text()}`);
      if (!cRes.ok) throw new Error(`cashflow: ${cRes.status} ${await cRes.text()}`);
      if (!aRes.ok) throw new Error(`allocation: ${aRes.status} ${await aRes.text()}`);

      const [sJson, cJson, aJson] = await Promise.all([sRes.json(), cRes.json(), aRes.json()]);

      setSummary({
        income: Number(sJson?.income ?? 0),
        expense: Number(sJson?.expense ?? 0),
        net: Number(sJson?.net ?? 0),
        investment: Number(sJson?.investment ?? 0),
      });
      setCashflow(Array.isArray(cJson) ? cJson : []);
      setAllocation(Array.isArray(aJson) ? aJson : []);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setFetchError(
        typeof err?.message === "string" ? err.message : "Gagal memuat data dashboard"
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Silakan login dulu
      </div>
    );
  }

  return (
    <AdminLayout username={user.name} onLogout={logout}>
      <div className="p-6 space-y-8">
        <Fade direction="down" triggerOnce>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex gap-2">
              {RANGE_OPTIONS.map((opt) => (
                <Button
                  key={opt.key}
                  variant={range === opt.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRange(opt.key)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        </Fade>

        {fetchError && (
          <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{fetchError}</p>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "Income", value: summary.income, color: "text-green-600" },
            { title: "Expenses", value: summary.expense, color: "text-red-600" },
            { title: "Net", value: summary.net, color: "text-indigo-600" },
            { title: "Investments (Cost Basis)", value: summary.investment, color: "text-purple-600" },
          ].map((stat, idx) => (
            <Zoom key={idx} delay={idx * 100} triggerOnce>
              <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
                <h2 className="text-gray-500">{stat.title}</h2>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {formatCurrency(stat.value)}
                </p>
              </div>
            </Zoom>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cashflow Line Chart */}
          <div className="p-6 bg-white rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">Cash Flow</h2>
            {cashflow.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cashflow}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#10B981" />
                  <Line type="monotone" dataKey="expense" stroke="#EF4444" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-sm">Belum ada transaksi</p>
            )}
          </div>

          {/* Allocation Pie Chart */}
          <div className="p-6 bg-white rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">Expense Allocation</h2>
            {allocation.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={allocation}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {allocation.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-sm">Belum ada data pengeluaran</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
