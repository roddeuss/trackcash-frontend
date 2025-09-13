// src/utils/format.ts
export function formatDateTime(dateStr: string | Date): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";

  const dd = ("0" + d.getDate()).slice(-2);
  const mm = ("0" + (d.getMonth() + 1)).slice(-2);
  const yyyy = d.getFullYear();
  const hh = ("0" + d.getHours()).slice(-2);
  const min = ("0" + d.getMinutes()).slice(-2);

  return `${dd}-${mm}-${yyyy}`;
}

export function formatCurrency(value: number, locale = "id-ID", currency = "IDR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}
