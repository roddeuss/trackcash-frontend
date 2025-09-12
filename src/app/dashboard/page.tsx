"use client";

import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/layout/AdminLayout";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
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

  // 🔹 Data sementara (static)
  const stats = [
    {
      title: "Total Balance",
      value: "Rp 15.000.000",
      color: "text-indigo-600",
    },
    {
      title: "Income",
      value: "Rp 5.000.000",
      color: "text-green-600",
    },
    {
      title: "Expenses",
      value: "Rp 2.500.000",
      color: "text-red-600",
    },
  ];

  return (
    <AdminLayout username={user.name} onLogout={logout}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition"
            >
              <h2 className="text-gray-500">{stat.title}</h2>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
