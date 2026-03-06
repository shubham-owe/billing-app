"use client";

import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import AppShell from "@/components/common/AppShell";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { clearAllData } from "@/lib/db";
import { downloadTextFile, fileToText } from "@/lib/utils";
import { exportBackupData, importBackupData, importProductsCsv, productsToCsv } from "@/lib/backup";
import { db } from "@/lib/dexie";
import type { BackupData } from "@/lib/types";

export default function BackupPage() {
  const jsonInputRef = useRef<HTMLInputElement | null>(null);
  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const [confirmReplace, setConfirmReplace] = useState<BackupData | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <AppShell title="Backup / Restore">
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          Important: Your POS data is only on this device (IndexedDB). Clearing browser data may permanently erase it.
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold">Export / Import JSON</h3>
            <p className="mt-1 text-sm text-slate-500">Backup all tables: profile, products, bills, bill items, settings.</p>
            <div className="mt-3 space-y-2">
              <button
                className="btn-primary w-full"
                onClick={async () => {
                  const payload = await exportBackupData();
                  downloadTextFile(
                    `pos-backup-${new Date().toISOString().slice(0, 10)}.json`,
                    JSON.stringify(payload, null, 2)
                  );
                  toast.success("Backup exported");
                }}
                type="button"
              >
                Export JSON Backup
              </button>
              <button
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
                onClick={() => jsonInputRef.current?.click()}
                type="button"
              >
                Import JSON (Merge)
              </button>
              <input
                accept=".json"
                className="hidden"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const text = await fileToText(file);
                  const parsed = JSON.parse(text) as BackupData;
                  await importBackupData(parsed, "merge");
                  toast.success("Backup merged");
                }}
                ref={jsonInputRef}
                type="file"
              />
              <button
                className="w-full rounded-lg bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700"
                onClick={async () => {
                  const filePicker = document.createElement("input");
                  filePicker.type = "file";
                  filePicker.accept = ".json";
                  filePicker.onchange = async () => {
                    const file = filePicker.files?.[0];
                    if (!file) return;
                    const text = await fileToText(file);
                    const parsed = JSON.parse(text) as BackupData;
                    setConfirmReplace(parsed);
                  };
                  filePicker.click();
                }}
                type="button"
              >
                Import JSON (Replace Existing Data)
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold">Products CSV</h3>
            <p className="mt-1 text-sm text-slate-500">
              CSV columns: barcode,name,price,category,stockQty,unit
            </p>
            <div className="mt-3 space-y-2">
              <button
                className="btn-primary w-full"
                onClick={async () => {
                  const products = await db.products.toArray();
                  downloadTextFile(
                    `products-${new Date().toISOString().slice(0, 10)}.csv`,
                    productsToCsv(products),
                    "text/csv"
                  );
                  toast.success("CSV exported");
                }}
                type="button"
              >
                Export Products CSV
              </button>
              <button
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
                onClick={() => csvInputRef.current?.click()}
                type="button"
              >
                Import Products CSV
              </button>
              <input
                accept=".csv"
                className="hidden"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  await importProductsCsv(await fileToText(file));
                  toast.success("CSV import complete");
                }}
                ref={csvInputRef}
                type="file"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/30">
          <h3 className="font-semibold text-rose-700 dark:text-rose-300">Danger Zone</h3>
          <p className="mt-1 text-sm text-rose-700/90 dark:text-rose-300">
            This will permanently delete all local app data from this browser.
          </p>
          <button
            className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            onClick={() => setConfirmClear(true)}
            type="button"
          >
            Clear All Local Data
          </button>
        </div>
      </div>

      <ConfirmDialog
        confirmLabel="Replace Data"
        dangerous
        description="Replace all current local data with imported backup?"
        onCancel={() => setConfirmReplace(null)}
        onConfirm={async () => {
          if (!confirmReplace) return;
          await importBackupData(confirmReplace, "replace");
          setConfirmReplace(null);
          toast.success("Backup restored (replace mode)");
        }}
        open={Boolean(confirmReplace)}
        title="Confirm Replace"
      />

      <ConfirmDialog
        confirmLabel="Delete Everything"
        dangerous
        description="This cannot be undone. Are you absolutely sure?"
        onCancel={() => setConfirmClear(false)}
        onConfirm={async () => {
          await clearAllData();
          setConfirmClear(false);
          toast.success("All local data cleared");
        }}
        open={confirmClear}
        title="Clear All Data"
      />
    </AppShell>
  );
}
