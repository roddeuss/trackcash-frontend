"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

// ====== Types ======
export interface Summary {
  income: number;
  expense: number;
  net: number;
}

export interface CashflowRow {
  period: string; // "2025-01" / "2025-01-01"
  label: string;  // "Jan" / "01 Jan"
  income: number;
  expense: number;
  net: number;
}

export interface AllocationRow {
  category: string;
  total: number;
}

interface OverviewResponse {
  summary: Summary;
  cashflow: CashflowRow[];
  allocation: AllocationRow[];
}

// helper untuk ambil pesan error yang valid
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function useReports(
  range: string = "year",
  groupBy: "day" | "month" = "month"
) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [cashflow, setCashflow] = useState<CashflowRow[]>([]);
  const [allocation, setAllocation] = useState<AllocationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        range,
        group_by: groupBy,
      }).toString();

      const res = await fetch(`${API_URL}/reports/overview?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch reports");

      const json: OverviewResponse = await res.json();

      setSummary(json.summary ?? null);
      setCashflow(Array.isArray(json.cashflow) ? json.cashflow : []);
      setAllocation(Array.isArray(json.allocation) ? json.allocation : []);
    } catch (err: unknown) {
      console.error("Fetch reports error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, groupBy]);

  return {
    summary,
    cashflow,
    allocation,
    loading,
    error,
    refetch: fetchReports,
  };
}
