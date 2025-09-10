"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"; // ✅ SweetAlert2

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const endpoint = isLogin ? "/login" : "/register";

            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            if (isLogin) {
                // ✅ LOGIN FLOW
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }

                Swal.fire({
                    icon: "success",
                    title: "Login Berhasil 🎉",
                    text: "Selamat datang kembali!",
                    timer: 2000,
                    showConfirmButton: false,
                });

                router.push("/dashboard");
            } else {
                // ✅ REGISTER FLOW
                Swal.fire({
                    icon: "success",
                    title: "Registrasi Berhasil ✅",
                    text: "Silakan login dengan akun baru kamu.",
                });

                setIsLogin(true); // balik ke form login
                setFormData({ name: "", email: "", password: "" }); // reset form
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-gray-100">
            {/* Left Side - Form */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col justify-center w-full md:w-1/2 px-10 md:px-20 bg-white shadow-lg"
            >
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                    {isLogin ? "Welcome Back 👋" : "Join TrackCash 🚀"}
                </h1>
                <p className="text-gray-500 mb-8">
                    {isLogin
                        ? "Sign in to continue managing your finances."
                        : "Create your account and start tracking your money smartly."}
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-indigo-300 text-black placeholder-gray-400"
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-indigo-300 text-black placeholder-gray-400"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-indigo-300 text-black placeholder-gray-400"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-6">
                    {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-600 font-medium hover:underline"
                    >
                        {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                </p>
            </motion.div>

            {/* Right Side - Illustration */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600"
            >
                <Image
                    src="/login-illustration.jpg"
                    alt="Finance Illustration"
                    width={500}
                    height={500}
                    className="drop-shadow-lg"
                />
            </motion.div>
        </div>
    );
}
