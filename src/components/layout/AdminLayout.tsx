"use client";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AdminLayout({
    children,
    username,
    onLogout,
}: {
    children: React.ReactNode;
    username: string;
    onLogout: () => void;
}) {
    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar onLogout={onLogout} />

            {/* Main Content */}
            <div className="flex-1 ml-64 bg-gray-50 min-h-screen">
                <Navbar username={username} />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
