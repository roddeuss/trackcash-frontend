"use client";

import { User } from "lucide-react";

export default function Navbar({ username }: { username: string }) {
    return (
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
            <h1 className="text-xl font-semibold">Welcome, {username} 🎉</h1>
            <div className="flex items-center gap-2">
                <User className="w-6 h-6 text-gray-600" />
                <span className="text-gray-700 font-medium">{username}</span>
            </div>
        </header>
    );
}
