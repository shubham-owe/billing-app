"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CartTable from "@/components/CartTable";
import ScannerCamera from "@/components/ScannerCamera";
import ScannerInput from "@/components/ScannerInput";
import { formatCurrency } from "@/lib/format";
import { saveBillToStorage } from "@/lib/storage";
import { STORE_CONFIG } from "@/lib/store";
import type { CartItem, Product, SavedBill } from "@/lib/types";

const DUPLICATE_SCAN_WINDOW_MS = 1000;
type ScanMode = "camera" | "input";

export default function HomePage() {
  const router = useRouter();

  const [scanMode, setScanMode] = useState<ScanMode>("camera");
  const [items, setItems] = useState<CartItem[]>([]);
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxPercent, setTaxPercent] = useState(5);
  const [lastScanned, setLastScanned] = useState("");
  const [scanStatus, setScanStatus] = useState("Ready to scan");
  const [toast, setToast] = useState<string | null>(null);
  const [cameraHelp, setCameraHelp] = useState<string | null>(null);

  const [unknownBarcode, setUnknownBarcode] = useState<string | null>(null);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");

  const lastScanMapRef = useRef<Record<string, number>>({});

  const safeTaxPercent = Number.isFinite(taxPercent) ? Math.max(0, taxPercent) : 0;

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const taxAmount = useMemo(
    () => (taxEnabled ? subtotal * (safeTaxPercent / 100) : 0),
    [safeTaxPercent, subtotal, taxEnabled]
  );
  const total = subtotal + taxAmount;

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const notify = (message: string) => setToast(message);

  const shouldIgnoreScan = (barcode: string) => {
    const now = Date.now();
    const prev = lastScanMapRef.current[barcode] ?? 0;
    if (now - prev < DUPLICATE_SCAN_WINDOW_MS) return true;
    lastScanMapRef.current[barcode] = now;
    return false;
  };

  const addOrIncrement = (product: Product, isCustom = false) => {
    let nextQty = 1;

    setItems((prev) => {
      const existing = prev.find((item) => item.barcode === product.barcode);
      if (existing) {
        nextQty = existing.quantity + 1;
        return prev.map((item) =>
          item.barcode === product.barcode
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1, isCustom }];
    });

    notify(`Added: ${product.name} x${nextQty}`);
  };

  const handleScan = async (rawBarcode: string) => {
    const barcode = rawBarcode.trim();
    if (!barcode) return;

    setLastScanned(barcode);
    if (shouldIgnoreScan(barcode)) return;

    const existing = items.find((item) => item.barcode === barcode);
    if (existing) {
      addOrIncrement(existing, existing.isCustom);
      setScanStatus(`Added ${existing.name}`);
      return;
    }

    setScanStatus(`Looking up ${barcode}...`);

    try {
      const response = await fetch(
        `/api/products/lookup?barcode=${encodeURIComponent(barcode)}`
      );

      if (response.ok) {
        const product = (await response.json()) as Product;
        addOrIncrement(product);
        setScanStatus(`Added ${product.name}`);
        return;
      }

      if (response.status === 404) {
        setUnknownBarcode(barcode);
        setScanStatus("Unknown barcode");
        notify(`Unknown barcode: ${barcode}`);
        return;
      }

      const payload = await response.json().catch(() => null);
      throw new Error(payload?.message ?? "Product lookup failed");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Product lookup failed";
      setScanStatus("Lookup failed");
      notify(message);
    }
  };

  const incrementQty = (barcode: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.barcode === barcode ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQty = (barcode: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.barcode === barcode
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const setQty = (barcode: string, quantity: number) => {
    const nextQty = Math.max(1, Math.floor(quantity || 1));
    setItems((prev) =>
      prev.map((item) =>
        item.barcode === barcode ? { ...item, quantity: nextQty } : item
      )
    );
  };

  const removeItem = (barcode: string) => {
    setItems((prev) => prev.filter((item) => item.barcode !== barcode));
  };

  const closeCustomDialog = () => {
    setUnknownBarcode(null);
    setCustomName("");
    setCustomPrice("");
  };

  const submitCustomItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!unknownBarcode) return;

    const name = customName.trim();
    const price = Number(customPrice);

    if (!name || !Number.isFinite(price) || price <= 0) {
      notify("Enter a valid custom item name and price");
      return;
    }

    addOrIncrement({ barcode: unknownBarcode, name, price }, true);
    setScanStatus(`Added custom item: ${name}`);
    closeCustomDialog();
  };

  const handlePrintBill = () => {
    if (items.length === 0) {
      notify("Cart is empty");
      return;
    }

    const now = Date.now();

    const bill: SavedBill = {
      items,
      totals: {
        subtotal,
        taxAmount,
        total
      },
      meta: {
        billNumber: `BILL-${now}`,
        createdAt: new Date(now).toISOString(),
        storeName: STORE_CONFIG.name,
        storeAddress: STORE_CONFIG.address,
        storePhone: STORE_CONFIG.phone,
        taxEnabled,
        taxPercent: safeTaxPercent
      }
    };

    saveBillToStorage(bill);
    router.push("/print");
  };

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6">
      <header className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold">New Bill</h1>
        <p className="mt-1 text-sm text-slate-600">
          Scan via camera or USB barcode scanner, then print receipt.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex gap-2">
              <button
                className={`rounded-md px-4 py-2 text-sm font-medium ${
                  scanMode === "camera"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-200 text-slate-800"
                }`}
                onClick={() => setScanMode("camera")}
                type="button"
              >
                Camera Scan
              </button>
              <button
                className={`rounded-md px-4 py-2 text-sm font-medium ${
                  scanMode === "input"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-200 text-slate-800"
                }`}
                onClick={() => setScanMode("input")}
                type="button"
              >
                Scanner / Input
              </button>
            </div>

            {scanMode === "camera" ? (
              <ScannerCamera
                onDetected={handleScan}
                onCameraError={(message) => {
                  setCameraHelp(message);
                }}
              />
            ) : (
              <ScannerInput onSubmit={handleScan} />
            )}

            <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm">
              <p>
                <span className="font-semibold">Last scanned:</span>{" "}
                {lastScanned || "-"}
              </p>
              <p className="mt-1">
                <span className="font-semibold">Status:</span> {scanStatus}
              </p>
              {cameraHelp ? (
                <p className="mt-2 text-amber-700">{cameraHelp}</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Totals</h2>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>

            <div className="mt-3 rounded-md border border-slate-200 p-3">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  checked={taxEnabled}
                  onChange={(e) => setTaxEnabled(e.target.checked)}
                  type="checkbox"
                />
                Enable tax
              </label>

              <div className="mt-2 flex items-center gap-2">
                <label className="text-sm text-slate-600">Tax %</label>
                <input
                  className="w-24 rounded-md border border-slate-300 px-2 py-1 text-sm disabled:bg-slate-100"
                  disabled={!taxEnabled}
                  min={0}
                  onChange={(e) => setTaxPercent(Number(e.target.value) || 0)}
                  step={0.1}
                  type="number"
                  value={safeTaxPercent}
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-slate-600">Tax Amount</span>
              <span className="font-semibold">{formatCurrency(taxAmount)}</span>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-bold">
              <span>Grand Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <button
              className="mt-4 w-full rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
              onClick={handlePrintBill}
              type="button"
            >
              Print Bill
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Cart</h2>
          <CartTable
            items={items}
            onDecrement={decrementQty}
            onIncrement={incrementQty}
            onRemove={removeItem}
            onSetQuantity={setQty}
          />
        </div>
      </section>

      {unknownBarcode ? (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
            <h3 className="text-lg font-semibold">Unknown barcode</h3>
            <p className="mt-1 text-sm text-slate-600">
              Barcode <span className="font-mono">{unknownBarcode}</span> was not
              found. Add a temporary custom item for this bill.
            </p>

            <form className="mt-4 space-y-3" onSubmit={submitCustomItem}>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Item name"
                value={customName}
              />
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                min={0}
                onChange={(e) => setCustomPrice(e.target.value)}
                placeholder="Price"
                step="0.01"
                type="number"
                value={customPrice}
              />

              <div className="flex gap-2">
                <button
                  className="flex-1 rounded-md bg-slate-900 px-3 py-2 text-white"
                  type="submit"
                >
                  Add Custom Item
                </button>
                <button
                  className="flex-1 rounded-md bg-slate-200 px-3 py-2 text-slate-800"
                  onClick={closeCustomDialog}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="no-print fixed bottom-4 right-4 rounded-md bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </main>
  );
}
