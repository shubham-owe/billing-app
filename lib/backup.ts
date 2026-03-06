import Papa from "papaparse";
import { db } from "@/lib/dexie";
import type { BackupData, Product } from "@/lib/types";
import { addProduct } from "@/lib/db";

export async function exportBackupData(): Promise<BackupData> {
  const [profile, products, bills, billItems, settings, authMeta] = await Promise.all([
    db.profile.toArray(),
    db.products.toArray(),
    db.bills.toArray(),
    db.billItems.toArray(),
    db.settings.toArray(),
    db.authMeta.toArray()
  ]);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile,
    products,
    bills,
    billItems,
    settings,
    authMeta
  };
}

export async function importBackupData(
  payload: BackupData,
  mode: "merge" | "replace"
) {
  if (mode === "replace") {
    await db.transaction(
      "rw",
      [db.profile, db.products, db.bills, db.billItems, db.settings, db.authMeta],
      async () => {
        await db.profile.clear();
        await db.products.clear();
        await db.bills.clear();
        await db.billItems.clear();
        await db.settings.clear();
        await db.authMeta.clear();
      }
    );
  }

  await db.transaction(
    "rw",
    [db.profile, db.products, db.bills, db.billItems, db.settings, db.authMeta],
    async () => {
      if (payload.profile?.length) await db.profile.bulkPut(payload.profile);
      if (payload.products?.length) await db.products.bulkPut(payload.products);
      if (payload.bills?.length) await db.bills.bulkPut(payload.bills);
      if (payload.billItems?.length) await db.billItems.bulkPut(payload.billItems);
      if (payload.settings?.length) await db.settings.bulkPut(payload.settings);
      if (payload.authMeta?.length) await db.authMeta.bulkPut(payload.authMeta);
    }
  );
}

export function productsToCsv(products: Product[]) {
  return Papa.unparse(
    products.map((product) => ({
      barcode: product.barcode,
      name: product.name,
      price: (product.pricePaise / 100).toFixed(2),
      category: product.category ?? "",
      stockQty: product.stockQty ?? "",
      unit: product.unit ?? ""
    }))
  );
}

export async function importProductsCsv(csvText: string) {
  const parsed = Papa.parse<{
    barcode: string;
    name: string;
    price: string;
    category?: string;
    stockQty?: string;
    unit?: string;
  }>(csvText, {
    header: true,
    skipEmptyLines: true
  });

  if (parsed.errors.length) {
    throw new Error(parsed.errors[0]?.message ?? "Invalid CSV");
  }

  for (const row of parsed.data) {
    if (!row.barcode || !row.name || !row.price) continue;

    const pricePaise = Math.round(Number(row.price) * 100);
    if (!Number.isFinite(pricePaise) || pricePaise <= 0) continue;

    try {
      await addProduct({
        barcode: row.barcode.trim(),
        name: row.name.trim(),
        pricePaise,
        category: row.category?.trim() || undefined,
        stockQty: row.stockQty ? Number(row.stockQty) : undefined,
        unit: row.unit?.trim() || undefined
      });
    } catch {
      // duplicate barcode is ignored in CSV imports
    }
  }
}
