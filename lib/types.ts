export type UserSession = {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
};

export type Product = {
  id?: number;
  barcode: string;
  name: string;
  pricePaise: number;
  category?: string;
  stockQty?: number;
  unit?: string;
  createdAt: string;
  updatedAt: string;
};

export type ShopProfile = {
  id?: number;
  ownerName: string;
  shopName: string;
  shopLogo?: string;
  shopAddress: string;
  gstNumber?: string;
  phoneNumber: string;
  email?: string;
  currency: string;
  taxEnabled: boolean;
  taxPercent: number;
  receiptFooterMessage?: string;
  receiptPrefix: string;
  businessCategory?: string;
  createdAt: string;
  updatedAt: string;
};

export type Bill = {
  id?: number;
  billNumber: string;
  createdAt: string;
  subtotalPaise: number;
  taxPercent: number;
  taxAmountPaise: number;
  totalPaise: number;
  itemCount: number;
  customerName?: string;
  customerPhone?: string;
};

export type BillItem = {
  id?: number;
  billId: number;
  productId?: number;
  barcode: string;
  nameSnapshot: string;
  unitPricePaise: number;
  qty: number;
  lineTotalPaise: number;
};

export type AppSetting = {
  key: string;
  value: string;
  updatedAt: string;
};

export type AuthMeta = {
  key: string;
  uid: string;
  updatedAt: string;
};

export type CartItem = {
  productId?: number;
  barcode: string;
  name: string;
  unitPricePaise: number;
  qty: number;
  category?: string;
};

export type BillWithItems = {
  bill: Bill;
  items: BillItem[];
};

export type BackupData = {
  version: number;
  exportedAt: string;
  profile: ShopProfile[];
  products: Product[];
  bills: Bill[];
  billItems: BillItem[];
  settings: AppSetting[];
  authMeta: AuthMeta[];
};
