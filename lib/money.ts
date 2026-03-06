import { DEFAULT_CURRENCY } from "@/lib/constants";

export function rupeesToPaise(value: number | string): number {
  const numeric = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numeric)) return 0;
  return Math.round(numeric * 100);
}

export function paiseToRupees(value: number): number {
  return value / 100;
}

export function formatCurrency(
  paise: number,
  currency = DEFAULT_CURRENCY,
  locale = "en-IN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2
  }).format(paiseToRupees(paise));
}
