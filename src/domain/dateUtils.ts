export const MS_IN_DAY = 86_400_000 as const;

export function startOfDay(ts: number = Date.now()): number {
  const d = new Date(ts);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function endOfDay(ts: number = Date.now()): number {
  return startOfDay(ts) + MS_IN_DAY - 1;
}

export function dayBucket(ts: number = Date.now()): number {
  return startOfDay(ts);
}

export function todayBucket(): number {
  return dayBucket(Date.now());
}

export function startOfWeek(ts: number = Date.now()): number {
  const sod = startOfDay(ts);
  const d = new Date(sod);
  const weekday = d.getDay();
  const mondayIndex = (weekday + 6) % 7;
  return sod - mondayIndex * MS_IN_DAY;
}

export function endOfWeek(ts: number = Date.now()): number {
  return startOfWeek(ts) + 7 * MS_IN_DAY - 1;
}

export function addDays(ts: number, days: number): number {
  return startOfDay(ts) + days * MS_IN_DAY;
}

export function isSameDay(a: number, b: number): boolean {
  return dayBucket(a) === dayBucket(b);
}

export function isInRange(
  ts: number,
  start: number,
  end: number,
  inclusive = true
): boolean {
  return inclusive ? ts >= start && ts <= end : ts > start && ts < end;
}

export function weekdayLabel(
  ts: number,
  locale: string = (typeof navigator !== "undefined" && navigator.language) ||
    "en-US"
): string {
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
    new Date(ts)
  );
}

export function clampToThisWeek(
  ts: number,
  refTs: number = Date.now()
): number {
  const s = startOfWeek(refTs);
  const e = endOfWeek(refTs);
  if (ts < s) return s;
  if (ts > e) return e;
  return ts;
}
