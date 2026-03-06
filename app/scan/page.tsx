"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import AppShell from "@/components/common/AppShell";
import ScannerCamera from "@/components/scan/ScannerCamera";
import ScannerInput from "@/components/scan/ScannerInput";
import BillCart from "@/components/scan/BillCart";
import QuickAddProductDialog from "@/components/scan/QuickAddProductDialog";
import CustomerForm from "@/components/scan/CustomerForm";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import CurrencyText from "@/components/common/CurrencyText";
import { BILL_SCAN_DEBOUNCE_MS } from "@/lib/constants";
import { BarcodeDebouncer, normalizeBarcode } from "@/lib/barcode";
import { computeBillTotals } from "@/lib/bill";
import { createBill, findProductByBarcode } from "@/lib/db";
import { useAppProfile } from "@/lib/hooks";
import type { CartItem } from "@/lib/types";

type Mode = "camera" | "input";

export default function ScanPage() {
  const router = useRouter();
  const profile = useAppProfile();
  const [mode, setMode] = useState<Mode>("input");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [quickAddBarcode, setQuickAddBarcode] = useState<string>();
  const [confirmClear, setConfirmClear] = useState(false);
  const debouncerRef = useRef(new BarcodeDebouncer(BILL_SCAN_DEBOUNCE_MS));

  const taxPercent = profile?.taxEnabled ? profile.taxPercent : 0;
  const totals = useMemo(() => computeBillTotals(cart, taxPercent), [cart, taxPercent]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.barcode === item.barcode);
      if (existing) {
        return prev.map((entry) =>
          entry.barcode === item.barcode ? { ...entry, qty: entry.qty + 1 } : entry
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
    toast.success(`Added ${item.name}`);
  };

  const handleBarcode = async (raw: string) => {
    const barcode = normalizeBarcode(raw);
    if (!barcode) return;
    if (debouncerRef.current.shouldSkip(barcode)) return;

    const product = await findProductByBarcode(barcode);
    if (!product) {
      setQuickAddBarcode(barcode);
      return;
    }

    addToCart({
      productId: product.id,
      barcode: product.barcode,
      name: product.name,
      unitPricePaise: product.pricePaise,
      qty: 1,
      category: product.category
    });
  };

  return (
    <AppShell title="Scan Products / New Bill">
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex gap-2">
              <button
                className={`rounded-lg px-3 py-2 text-sm ${
                  mode === "camera"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
                onClick={() => setMode("camera")}
                type="button"
              >
                Camera
              </button>
              <button
                className={`rounded-lg px-3 py-2 text-sm ${
                  mode === "input"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
                onClick={() => setMode("input")}
                type="button"
              >
                Input / Scanner
              </button>
            </div>

            {mode === "camera" ? (
              <ScannerCamera onDetected={handleBarcode} />
            ) : (
              <ScannerInput onSubmit={handleBarcode} />
            )}
          </div>

          <CustomerForm
            customerName={customerName}
            customerPhone={customerPhone}
            onCustomerName={setCustomerName}
            onCustomerPhone={setCustomerPhone}
          />
        </div>

        <div className="space-y-4">
          <BillCart
            currency={profile?.currency}
            items={cart}
            onDec={(barcode) =>
              setCart((prev) =>
                prev.map((item) =>
                  item.barcode === barcode ? { ...item, qty: Math.max(1, item.qty - 1) } : item
                )
              )
            }
            onInc={(barcode) =>
              setCart((prev) =>
                prev.map((item) =>
                  item.barcode === barcode ? { ...item, qty: item.qty + 1 } : item
                )
              )
            }
            onQty={(barcode, qty) =>
              setCart((prev) =>
                prev.map((item) =>
                  item.barcode === barcode
                    ? { ...item, qty: Math.max(1, Math.floor(qty || 1)) }
                    : item
                )
              )
            }
            onRemove={(barcode) => setCart((prev) => prev.filter((item) => item.barcode !== barcode))}
          />

          <div className="sticky bottom-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <CurrencyText currency={profile?.currency} paise={totals.subtotalPaise} />
              </div>
              <div className="flex justify-between">
                <span>Tax ({taxPercent}%)</span>
                <CurrencyText currency={profile?.currency} paise={totals.taxAmountPaise} />
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <CurrencyText currency={profile?.currency} paise={totals.totalPaise} />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                className="btn-primary"
                onClick={async () => {
                  if (!profile) return;
                  try {
                    const id = await createBill({
                      prefix: profile.receiptPrefix || "BILL",
                      cartItems: cart,
                      taxPercent,
                      customerName: customerName || undefined,
                      customerPhone: customerPhone || undefined
                    });
                    toast.success("Bill saved");
                    router.push(`/bills/${id}`);
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Failed to save bill");
                  }
                }}
                type="button"
              >
                Save Bill
              </button>
              <button
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                onClick={async () => {
                  if (!profile) return;
                  try {
                    const id = await createBill({
                      prefix: profile.receiptPrefix || "BILL",
                      cartItems: cart,
                      taxPercent,
                      customerName: customerName || undefined,
                      customerPhone: customerPhone || undefined
                    });
                    toast.success("Bill saved");
                    router.push(`/print/${id}`);
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Failed to print bill");
                  }
                }}
                type="button"
              >
                Print Bill
              </button>
              <button
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                onClick={() => setConfirmClear(true)}
                type="button"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <QuickAddProductDialog
        barcode={quickAddBarcode}
        onAdded={(barcode) => void handleBarcode(barcode)}
        onClose={() => setQuickAddBarcode(undefined)}
        open={Boolean(quickAddBarcode)}
      />

      <ConfirmDialog
        confirmLabel="Clear Bill"
        dangerous
        description="Remove all items from current bill?"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          setCart([]);
          setCustomerName("");
          setCustomerPhone("");
          setConfirmClear(false);
        }}
        open={confirmClear}
        title="Clear current bill"
      />
    </AppShell>
  );
}
