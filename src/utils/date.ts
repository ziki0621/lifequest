import type { RecurrencePeriod } from "../types";

/** Format as YYYY-MM-DD */
export function formatDate(date: Date | string): string {
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const d = typeof date === "string" ? new Date(date) : date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function today(): string { return formatDate(new Date()); }

export function localTimestamp(date = new Date()): string {
  const h = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  const ms = String(date.getMilliseconds()).padStart(3, "0");
  return `${formatDate(date)}T${h}:${mi}:${s}.${ms}`;
}

export function readableDate(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  const w = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return `${d.getMonth() + 1}月${d.getDate()}日 ${w[d.getDay()]}`;
}

export function daysSince(dateStr: string): number {
  const start = startOfLocalDay(parseLocalDate(dateStr));
  const now = startOfLocalDay(new Date());
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function firstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function isToday(dateStr: string): boolean { return dateStr === today(); }

export function parseLocalDate(dateStr: string): Date {
  const [dp] = dateStr.split("T");
  const parts = dp.split("-").map(Number);
  if (parts.length === 3 && parts.every(Number.isFinite)) {
    const [y = 0, m = 1, d = 1] = parts;
    return new Date(y, m - 1, d);
  }
  return new Date(dateStr);
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// ── Recurrence helpers ──

export function getCurrentPeriodRange(period: RecurrencePeriod, refDate: string): { start: string; end: string } {
  const d = parseLocalDate(refDate);
  switch (period) {
    case "daily":
      return { start: refDate, end: refDate };
    case "weekly": {
      const dow = d.getDay();
      const start = new Date(d); start.setDate(d.getDate() - dow);
      const end = new Date(start); end.setDate(start.getDate() + 6);
      return { start: formatDate(start), end: formatDate(end) };
    }
    case "monthly": {
      const start = formatDate(new Date(d.getFullYear(), d.getMonth(), 1));
      const end = formatDate(new Date(d.getFullYear(), d.getMonth() + 1, 0));
      return { start, end };
    }
  }
}

export function countCompletionsInPeriod(completions: string[], period: RecurrencePeriod, refDate: string): number {
  const { start, end } = getCurrentPeriodRange(period, refDate);
  return completions.filter((c) => c >= start && c <= end).length;
}

export function countTodayCompletions(completions: string[], refDate: string): number {
  return completions.filter((c) => c === refDate).length;
}

export function isDailyTaskDue(
  completions: string[], period: RecurrencePeriod, targetCount: number,
  active: boolean, refDate: string,
  daysOfWeek?: number[], timesPerDay?: number,
): boolean {
  if (!active) return false;

  if (period === "daily") {
    // Check if today is an active day
    if (daysOfWeek && daysOfWeek.length > 0) {
      const todayDow = parseLocalDate(refDate).getDay();
      if (!daysOfWeek.includes(todayDow)) return false;
    }
    // Count today's completions vs timesPerDay (default 1)
    const tpd = timesPerDay || 1;
    return countTodayCompletions(completions, refDate) < tpd;
  }

  // weekly / monthly: count in period vs targetCount
  return countCompletionsInPeriod(completions, period, refDate) < targetCount;
}
