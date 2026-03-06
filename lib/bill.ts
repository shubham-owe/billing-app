import type { CartItem } from "@/lib/types";

export function computeBillTotals(items: CartItem[], taxPercent: number) {
  const subtotalPaise = items.reduce(
    (sum, item) => sum + item.unitPricePaise * item.qty,
    0
  );
  const safeTax = Math.max(0, Math.min(100, taxPercent));
  const taxAmountPaise = Math.round((subtotalPaise * safeTax) / 100);
  const totalPaise = subtotalPaise + taxAmountPaise;

  return { subtotalPaise, taxAmountPaise, totalPaise };
}
