import type { SavedBill } from "@/lib/types";

export const BILL_STORAGE_KEY = "billing_app_current_bill";

function isValidBill(payload: unknown): payload is SavedBill {
  if (!payload || typeof payload !== "object") return false;

  const bill = payload as SavedBill;
  return Boolean(
    Array.isArray(bill.items) &&
      bill.meta &&
      typeof bill.meta.billNumber === "string" &&
      bill.totals &&
      typeof bill.totals.total === "number"
  );
}

export function saveBillToStorage(bill: SavedBill): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BILL_STORAGE_KEY, JSON.stringify(bill));
}

export function readBillFromStorage(): SavedBill | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(BILL_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    return isValidBill(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
