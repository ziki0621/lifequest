/** 格式化为 YYYY-MM-DD */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}

/** 今天的日期字符串 */
export function today(): string {
  return formatDate(new Date());
}

/** 可读日期格式 */
export function readableDate(dateStr: string): string {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const weekday = weekdays[d.getDay()];
  return `${month}月${day}日 ${weekday}`;
}

/** 简短可读日期 */
export function shortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/** 计算从某个日期到今天的天数 */
export function daysSince(dateStr: string): number {
  const start = new Date(dateStr);
  const now = new Date();
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
