// src/utils/format.ts
export function formatDateTime(dateStr: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr; // fallback kalau invalid

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0"); // bulan mulai dari 0
  const yyyy = d.getFullYear();

  const HH = String(d.getHours()).padStart(2, "0");
  const MM = String(d.getMinutes()).padStart(2, "0");
  const SS = String(d.getSeconds()).padStart(2, "0");

  return `${dd}-${mm}-${yyyy} ${HH}:${MM}:${SS}`;
}

export function formatCurrency(value: number, locale = "id-ID", currency = "IDR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}
