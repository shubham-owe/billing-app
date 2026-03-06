import { db } from "@/lib/dexie";
import { AUTH_META_KEY } from "@/lib/constants";
import { computeBillTotals } from "@/lib/bill";
import type {
  Bill,
  BillItem,
  BillWithItems,
  CartItem,
  Product,
  ShopProfile,
  UserSession
} from "@/lib/types";

const DEMO_PRODUCTS: Omit<Product, "id" | "createdAt" | "updatedAt">[] = [
  { barcode: "8901030865012", name: "Whole Milk 1L", pricePaise: 5500, category: "Dairy", unit: "ltr" },
  { barcode: "8901491101223", name: "Brown Bread", pricePaise: 4000, category: "Bakery", unit: "pcs" },
  { barcode: "8901063010018", name: "Eggs Pack 12", pricePaise: 7800, category: "Dairy", unit: "pack" },
  { barcode: "8901719100051", name: "Basmati Rice 5kg", pricePaise: 49900, category: "Grocery", unit: "bag" },
  { barcode: "8906001024518", name: "Sugar 1kg", pricePaise: 4900, category: "Grocery", unit: "kg" },
  { barcode: "8901233021455", name: "Sunflower Oil 1L", pricePaise: 17500, category: "Grocery", unit: "ltr" },
  { barcode: "8904043902127", name: "Black Tea 250g", pricePaise: 14900, category: "Beverage", unit: "box" },
  { barcode: "8903146005014", name: "Instant Coffee 100g", pricePaise: 22000, category: "Beverage", unit: "jar" },
  { barcode: "8901207034151", name: "Dishwash Liquid 500ml", pricePaise: 8900, category: "Home", unit: "bottle" },
  { barcode: "8906013030040", name: "Bath Soap Pack 3", pricePaise: 9900, category: "Personal Care", unit: "pack" }
];

export async function saveAuthMeta(session: UserSession) {
  await db.authMeta.put({
    key: AUTH_META_KEY,
    uid: session.uid,
    updatedAt: new Date().toISOString()
  });
}

export async function clearAuthMeta() {
  await db.authMeta.delete(AUTH_META_KEY);
}

export async function getProfile(): Promise<ShopProfile | undefined> {
  return await db.profile.toCollection().first();
}

export async function upsertProfile(
  payload: Omit<ShopProfile, "id" | "createdAt" | "updatedAt">
) {
  const existing = await getProfile();
  const now = new Date().toISOString();

  if (existing?.id) {
    await db.profile.update(existing.id, { ...payload, updatedAt: now });
    return existing.id;
  }

  return await db.profile.add({
    ...payload,
    createdAt: now,
    updatedAt: now
  });
}

export async function ensureSeededProducts() {
  const count = await db.products.count();
  if (count > 0) return;

  const now = new Date().toISOString();
  await db.products.bulkAdd(
    DEMO_PRODUCTS.map((item) => ({
      ...item,
      createdAt: now,
      updatedAt: now
    }))
  );
}

export async function addProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
) {
  const existing = await db.products.where("barcode").equals(product.barcode).first();
  if (existing) throw new Error("Product with this barcode already exists.");
  const now = new Date().toISOString();
  return await db.products.add({ ...product, createdAt: now, updatedAt: now });
}

export async function updateProduct(id: number, updates: Partial<Product>) {
  await db.products.update(id, { ...updates, updatedAt: new Date().toISOString() });
}

export async function deleteProduct(id: number) {
  await db.products.delete(id);
}

export async function findProductByBarcode(barcode: string) {
  return await db.products.where("barcode").equals(barcode).first();
}

export async function createBill(payload: {
  prefix: string;
  cartItems: CartItem[];
  taxPercent: number;
  customerName?: string;
  customerPhone?: string;
}) {
  if (payload.cartItems.length === 0) throw new Error("Cart is empty.");

  const createdAt = new Date().toISOString();
  const totals = computeBillTotals(payload.cartItems, payload.taxPercent);
  const billNumber = `${payload.prefix}-${Date.now()}`;

  return await db.transaction("rw", db.bills, db.billItems, async () => {
    const billId = await db.bills.add({
      billNumber,
      createdAt,
      subtotalPaise: totals.subtotalPaise,
      taxPercent: payload.taxPercent,
      taxAmountPaise: totals.taxAmountPaise,
      totalPaise: totals.totalPaise,
      itemCount: payload.cartItems.reduce((sum, item) => sum + item.qty, 0),
      customerName: payload.customerName,
      customerPhone: payload.customerPhone
    });

    const items: BillItem[] = payload.cartItems.map((item) => ({
      billId,
      productId: item.productId,
      barcode: item.barcode,
      nameSnapshot: item.name,
      unitPricePaise: item.unitPricePaise,
      qty: item.qty,
      lineTotalPaise: item.unitPricePaise * item.qty
    }));

    await db.billItems.bulkAdd(items);
    return billId;
  });
}

export async function getBillWithItems(id: number): Promise<BillWithItems | undefined> {
  const bill = await db.bills.get(id);
  if (!bill) return undefined;
  const items = await db.billItems.where("billId").equals(id).toArray();
  return { bill, items };
}

export async function listBills(): Promise<Bill[]> {
  return await db.bills.orderBy("createdAt").reverse().toArray();
}

export async function getStats() {
  const [productsCount, billsCount] = await Promise.all([
    db.products.count(),
    db.bills.count()
  ]);
  return { productsCount, billsCount };
}

export async function clearAllData() {
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
