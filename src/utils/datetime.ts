// src/utils/datetime.ts
export function ensureSecondsDMY(dateStr: string): string {
  if (!dateStr) return "";

  // Dari <input type="datetime-local"> → "YYYY-MM-DDTHH:mm(:ss)?"
  const isoLocal = dateStr.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
  );
  if (isoLocal) {
    const [, y, m, d, H, i, s] = isoLocal;
    return `${d}-${m}-${y} ${H}:${i}:${s ?? "00"}`;
    // -> "dd-mm-yyyy HH:mm:ss"
  }

  // Sudah "dd-mm-yyyy HH:mm" → tambahin :00
  const dmyHm = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})\s(\d{2}):(\d{2})$/);
  if (dmyHm) {
    const [, d, m, y, H, i] = dmyHm;
    return `${d}-${m}-${y} ${H}:${i}:00`;
  }

  // Sudah sesuai → biarkan
  const dmyHms = dateStr.match(
    /^(\d{2})-(\d{2})-(\d{4})\s(\d{2}):(\d{2}):(\d{2})$/
  );
  if (dmyHms) return dateStr;

  // Fallback: coba parse Date
  const dt = new Date(dateStr);
  if (!isNaN(dt.getTime())) {
    const pad = (n: number) => String(n).padStart(2, "0");
    const d = pad(dt.getDate());
    const m = pad(dt.getMonth() + 1);
    const y = dt.getFullYear();
    const H = pad(dt.getHours());
    const i = pad(dt.getMinutes());
    const s = pad(dt.getSeconds());
    return `${d}-${m}-${y} ${H}:${i}:${s}`;
  }

  // Biarkan (akan gagal di backend kalau tetap tak valid)
  return dateStr;
}
