// components/layout/AdminLayout.tsx
"use client";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

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
        <div className="min-h-screen bg-gray-50">
            <Sidebar onLogout={onLogout} /> {/* fixed left width 16rem */}
            <div className="ml-64 flex flex-col min-h-screen"> {/* compensate sidebar */}
                <Navbar username={username} onLogout={onLogout} />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
