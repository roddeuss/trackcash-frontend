"use client";

import { useState } from "react";
import { login } from "@/lib/auth";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await login(email, password);
            localStorage.setItem("token", res.token);
            window.location.href = "/dashboard";
        } catch (err: any) {
            setError(err.message);
        }
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
                <h1 className="text-xl font-bold mb-4">Login</h1>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}
