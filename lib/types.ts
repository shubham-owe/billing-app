export type Product = {
  barcode: string;
  name: string;
  price: number;
};

export type CartItem = Product & {
  quantity: number;
  isCustom?: boolean;
};

export type BillMeta = {
  billNumber: string;
  createdAt: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  taxEnabled: boolean;
  taxPercent: number;
};

export type BillTotals = {
  subtotal: number;
  taxAmount: number;
  total: number;
};

export type SavedBill = {
  items: CartItem[];
  totals: BillTotals;
  meta: BillMeta;
};
