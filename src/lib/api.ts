// lib/api.ts

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json", // tambahin ini
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text(); // ambil raw text dulu
    let errorJson: any = {};
    try {
      errorJson = JSON.parse(errorText);
    } catch {
      errorJson = { message: errorText };
    }
    throw new Error(errorJson.message || "API Error");
  }

  return res.json();
}
