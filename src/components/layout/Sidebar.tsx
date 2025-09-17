"use client";

import Link from "next/link";
import {
    Home,
    Database,
    Landmark,
    Tags,
    DollarSign,
    PieChart,
    User,
    Settings,
    LogOut,
    Wallet, // 🔹 bisa dipakai untuk budget
} from "lucide-react";

const menuGroups = [
    {
        title: "Home",
        items: [{ name: "Dashboard", href: "/dashboard", icon: Home }],
    },
    {
        title: "Master Data",
        items: [
            { name: "Asset", href: "/assets", icon: Database },
            { name: "Bank", href: "/banks", icon: Landmark },
            { name: "Category", href: "/categories", icon: Tags }, // 🔹 typo categorys → categories
            { name: "Type", href: "/types", icon: Tags },
        ],
    },
    {
        title: "Transactions",
        items: [
            { name: "Transaction", href: "/transactions", icon: DollarSign },
            { name: "Investment", href: "/investments", icon: PieChart },
        ],
    },
    {
        title: "Budgeting",
        items: [
            { name: "Budgets", href: "/budgets", icon: Wallet }, // 🔹 menu baru
        ],
    },
    {
        title: "Profile",
        items: [{ name: "Profile", href: "/profile", icon: User }],
    },
    {
        title: "Settings",
        items: [{ name: "Settings", href: "/settings", icon: Settings }],
    },
];

export default function Sidebar({ onLogout }: { onLogout: () => void }) {
    return (
        <aside className="w-64 bg-white shadow-md h-screen fixed left-0 top-0 flex flex-col">
            <div className="px-6 py-4 text-2xl font-bold text-indigo-600">
                TrackCash 💰
            </div>
            <nav className="flex-1 px-4 overflow-y-auto">
                {menuGroups.map((group) => (
                    <div key={group.title} className="mb-4">
                        <p className="px-2 text-xs font-semibold text-gray-500 uppercase mb-2">
                            {group.title}
                        </p>
                        <div className="flex flex-col space-y-1">
                            {group.items.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
}
