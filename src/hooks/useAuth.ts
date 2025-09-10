  "use client";

  import { useEffect, useState } from "react";
  import { API_URL } from "@/lib/api";

  export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const fetchUser = async () => {
        try {
          const res = await fetch(`${API_URL}/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error("Failed to fetch user");
          }

          const data = await res.json();
          setUser(data);
        } catch (error) {
          console.error("Auth error:", error);
          localStorage.removeItem("token"); // kalau token invalid, hapus
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, []);

    const logout = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    return { user, loading, logout };
  }
