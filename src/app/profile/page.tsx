"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Swal from "sweetalert2";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
    const { user, loading: authLoading, logout } = useAuth();
    const {
        profile,
        loading,
        error,
        fetchMe,
        updateProfile,
        updatePassword,
        updateCurrency,
        updateProfilePicture,
    } = useProfile();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [currency, setCurrency] = useState<"IDR" | "USD">("IDR");

    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (profile) {
            setName(profile.name);
            setEmail(profile.email);
            setCurrency(profile.default_currency || "IDR");
            setPreview(profile.profile_picture_url || null);
        }
    }, [profile]);

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <div className="flex items-center justify-center h-screen text-gray-600">Silakan login dulu</div>;
    }

    const handleUpdateProfile = async () => {
        try {
            await updateProfile({ name, email });
            Swal.fire("Berhasil", "Profil berhasil diperbarui ✅", "success");
            fetchMe();
        } catch (e: any) {
            Swal.fire("Error", e?.message || "Gagal memperbarui profil", "error");
        }
    };

    const handleUpdatePassword = async () => {
        if (password !== passwordConfirmation) {
            Swal.fire("Error", "Konfirmasi password tidak sama", "error");
            return;
        }
        try {
            await updatePassword({ current_password: currentPassword, password, password_confirmation: passwordConfirmation });
            Swal.fire("Berhasil", "Password berhasil diubah ✅", "success");
            setCurrentPassword("");
            setPassword("");
            setPasswordConfirmation("");
        } catch (e: any) {
            Swal.fire("Error", e?.message || "Gagal mengubah password", "error");
        }
    };

    const handleUpdateCurrency = async () => {
        try {
            await updateCurrency({ default_currency: currency });
            Swal.fire("Berhasil", "Mata uang default diperbarui ✅", "success");
        } catch (e: any) {
            Swal.fire("Error", e?.message || "Gagal memperbarui mata uang", "error");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setFile(f);
        if (f) {
            const url = URL.createObjectURL(f);
            setPreview(url);
        }
    };

    const handleUploadPicture = async () => {
        if (!file) {
            Swal.fire("Info", "Pilih file foto dulu", "info");
            return;
        }
        try {
            const url = await updateProfilePicture(file);
            Swal.fire("Berhasil", "Foto profil berhasil diperbarui ✅", "success");
            // gunakan URL dari server agar permanen
            if (url) setPreview(url);
            setFile(null);
        } catch (e: any) {
            Swal.fire("Error", e?.message || "Gagal mengunggah foto profil", "error");
        }
    };

    return (
        <AdminLayout username={user.name} onLogout={logout}>
            <div className="p-6 space-y-8 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold mb-6">Profil</h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    {/* Foto Profil */}
                    <div className="bg-white p-6 rounded-2xl shadow mb-6">
                        <h2 className="text-lg font-semibold mb-4">Foto Profil</h2>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full overflow-hidden border">
                                {preview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 flex items-center gap-3">
                                <Input type="file" accept="image/*" onChange={handleFileChange} />
                                <Button onClick={handleUploadPicture}>Upload</Button>
                            </div>
                        </div>
                    </div>

                    {/* Data Profil */}
                    <div className="bg-white p-6 rounded-2xl shadow mb-6">
                        <h2 className="text-lg font-semibold mb-4">Data Profil</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">Nama</label>
                                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Email</label>
                                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email aktif" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button onClick={handleUpdateProfile}>Simpan Profil</Button>
                        </div>
                    </div>

                    {/* Mata Uang */}
                    <div className="bg-white p-6 rounded-2xl shadow mb-6">
                        <h2 className="text-lg font-semibold mb-4">Mata Uang Default</h2>
                        <div className="flex items-center gap-3">
                            <Select value={currency} onValueChange={(v) => setCurrency(v as "IDR" | "USD")}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IDR">IDR (Rupiah)</SelectItem>
                                    <SelectItem value="USD">USD (Dollar)</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleUpdateCurrency}>Simpan</Button>
                        </div>
                    </div>

                    {/* Ganti Password */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-lg font-semibold mb-4">Ganti Password</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">Password Saat Ini</label>
                                <Input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Password lama"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Password Baru</label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password baru (min. 8)"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Konfirmasi Password</label>
                                <Input
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    placeholder="Ulangi password baru"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button variant="secondary" onClick={handleUpdatePassword}>
                                Simpan Password
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
