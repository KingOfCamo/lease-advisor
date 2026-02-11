import { format, parse } from "date-fns";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyDetailed(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatArea(sqm: number): string {
  return `${sqm.toLocaleString("en-AU")} sqm`;
}

export function formatRentPSQM(amount: number): string {
  return `$${amount.toFixed(0)}/sqm`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd/MM/yyyy");
}

export function parseAusDate(dateStr: string): Date {
  return parse(dateStr, "dd/MM/yyyy", new Date());
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatMonths(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years === 0) return `${remainingMonths} months`;
  if (remainingMonths === 0) return `${years} year${years > 1 ? "s" : ""}`;
  return `${years}y ${remainingMonths}m`;
}
