/** 格式化为 YYYY-MM-DD */
export function formatDate(date: Date | string): string {
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** 今天的日期字符串 */
export function today(): string {
  return formatDate(new Date());
}

/** 本地时间戳，日期部分稳定匹配 today() */
export function localTimestamp(date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
  return `${formatDate(date)}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}

/** 可读日期格式 */
export function readableDate(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const weekday = weekdays[d.getDay()];
  return `${month}月${day}日 ${weekday}`;
}

/** 简短可读日期 */
export function shortDate(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/** 计算从某个日期到今天的天数 */
export function daysSince(dateStr: string): number {
  const start = startOfLocalDay(parseLocalDate(dateStr));
  const now = startOfLocalDay(new Date());
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/** 获取某年某月的天数 */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** 获取某年某月第一天是星期几（0=周日） */
export function firstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** 是否为今天 */
export function isToday(dateStr: string): boolean {
  return dateStr === today();
}

/** 将 YYYY-MM-DD 当作本地日期解析，避免浏览器按 UTC 解析造成跨天 */
export function parseLocalDate(dateStr: string): Date {
  const [datePart] = dateStr.split("T");
  const parts = datePart.split("-").map(Number);
  if (parts.length === 3 && parts.every(Number.isFinite)) {
    const [year = 0, month = 1, day = 1] = parts;
    return new Date(year, month - 1, day);
  }
  return new Date(dateStr);
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
