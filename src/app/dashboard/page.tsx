"use client";

import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/layout/AdminLayout";

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>Silakan login dulu</p>;

    return (
        <AdminLayout username={user.name} onLogout={logout}>
            {/* Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-2xl shadow">
                    <h2 className="text-gray-500">Total Balance</h2>
                    <p className="text-2xl font-bold text-indigo-600">Rp 15.000.000</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow">
                    <h2 className="text-gray-500">Income</h2>
                    <p className="text-2xl font-bold text-green-600">Rp 5.000.000</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow">
                    <h2 className="text-gray-500">Expenses</h2>
                    <p className="text-2xl font-bold text-red-600">Rp 2.500.000</p>
                </div>
            </div>
        </AdminLayout>
    );
}
