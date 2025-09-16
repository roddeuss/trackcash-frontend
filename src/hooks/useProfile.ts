"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export interface Profile {
  id: number;
  name: string;
  email: string;
  default_currency: "IDR" | "USD";
  profile_picture_url?: string; // opsional kalau backend ikut mengirim url-nya
}

function getAuthHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  } as HeadersInit;
}

function jsonHeaders() {
  return {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  } as HeadersInit;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/profile/me`, {
        headers: getAuthHeaders(),
        cache: "no-store",
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to fetch profile");
      }
      const json = await res.json();
      const data = json?.data ?? json;
      setProfile(data);
    } catch (e: any) {
      console.error("fetchMe error:", e);
      setError(e?.message ?? "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (payload: { name: string; email: string }) => {
    const res = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: jsonHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || json?.status === false) {
      throw new Error(json?.message || "Gagal mengupdate profil");
    }
    const data = json?.data ?? json;
    setProfile((prev) => (prev ? { ...prev, ...data } : data));
    return data;
  };

  const updatePassword = async (payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => {
    const res = await fetch(`${API_URL}/profile/password`, {
      method: "PUT",
      headers: jsonHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || json?.status === false) {
      throw new Error(json?.message || "Gagal mengubah password");
    }
    return true;
  };

  const updateCurrency = async (payload: {
    default_currency: "IDR" | "USD";
  }) => {
    const res = await fetch(`${API_URL}/profile/currency`, {
      method: "PUT",
      headers: jsonHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || json?.status === false) {
      throw new Error(json?.message || "Gagal mengubah mata uang");
    }
    setProfile((p) =>
      p ? { ...p, default_currency: payload.default_currency } : p
    );
    return json?.data ?? json;
  };

  const updateProfilePicture = async (file: File) => {
    const form = new FormData();
    form.append("profile_picture", file);

    const res = await fetch(`${API_URL}/profile/picture`, {
      method: "POST",
      headers: getAuthHeaders(), // penting: jangan set Content-Type manual untuk FormData
      body: form,
    });
    const json = await res.json();
    if (!res.ok || json?.status === false) {
      throw new Error(json?.message || "Gagal mengunggah foto profil");
    }

    const url = json?.data?.profile_picture_url;
    setProfile((p) =>
      p ? ({ ...p, profile_picture_url: url } as Profile) : p
    );
    return url;
  };

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    profile,
    loading,
    error,
    fetchMe,
    updateProfile,
    updatePassword,
    updateCurrency,
    updateProfilePicture,
  };
}
