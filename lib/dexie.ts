import Dexie, { type Table } from "dexie";
import { DB_NAME, DB_VERSION } from "@/lib/constants";
import type {
  AppSetting,
  AuthMeta,
  Bill,
  BillItem,
  Product,
  ShopProfile
} from "@/lib/types";

export class PosDatabase extends Dexie {
  profile!: Table<ShopProfile, number>;
  products!: Table<Product, number>;
  bills!: Table<Bill, number>;
  billItems!: Table<BillItem, number>;
  settings!: Table<AppSetting, string>;
  authMeta!: Table<AuthMeta, string>;

  constructor() {
    super(DB_NAME);

    this.version(DB_VERSION).stores({
      profile: "++id, updatedAt",
      products: "++id, &barcode, name, category, createdAt, updatedAt",
      bills: "++id, billNumber, createdAt",
      billItems: "++id, billId, barcode, productId",
      settings: "&key, updatedAt",
      authMeta: "&key, uid, updatedAt"
    });
  }
}

export const db = new PosDatabase();
