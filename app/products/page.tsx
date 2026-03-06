"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import AppShell from "@/components/common/AppShell";
import ProductForm from "@/components/products/ProductForm";
import ScannerCamera from "@/components/scan/ScannerCamera";
import ScannerInput from "@/components/scan/ScannerInput";

type Mode = "camera" | "input";

export default function ProductsPage() {
  const [mode, setMode] = useState<Mode>("input");
  const [barcode, setBarcode] = useState("");

  return (
    <AppShell title="Add Products">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
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
                Camera Scan
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
                Input/Scanner
              </button>
            </div>
            {mode === "camera" ? (
              <ScannerCamera
                onDetected={(code) => {
                  setBarcode(code);
                  toast.success(`Barcode captured: ${code}`);
                }}
              />
            ) : (
              <ScannerInput
                onSubmit={(code) => {
                  setBarcode(code);
                  toast.success(`Barcode captured: ${code}`);
                }}
              />
            )}
          </div>
        </div>

        <ProductForm initialBarcode={barcode} onSaved={() => setBarcode("")} />
      </div>
    </AppShell>
  );
}
