import { z } from "zod";

export const productSchema = z.object({
  barcode: z.string().trim().min(4, "Barcode is required"),
  name: z.string().trim().min(2, "Product name is required"),
  price: z.coerce.number<number>().positive("Price must be greater than 0"),
  category: z.string().trim().optional(),
  stockQty: z.coerce.number<number>().min(0).optional(),
  unit: z.string().trim().optional()
});

export const profileSchema = z.object({
  ownerName: z.string().trim().min(2, "Owner name is required"),
  shopName: z.string().trim().min(2, "Shop name is required"),
  shopLogo: z.string().optional(),
  shopAddress: z.string().trim().min(5, "Shop address is required"),
  gstNumber: z.string().trim().optional(),
  phoneNumber: z.string().trim().min(7, "Phone number is required"),
  email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  currency: z.string().trim().min(2),
  taxEnabled: z.boolean(),
  taxPercent: z.coerce.number<number>().min(0).max(100),
  receiptFooterMessage: z.string().trim().optional(),
  receiptPrefix: z.string().trim().min(2).max(12),
  businessCategory: z.string().trim().optional()
});

export const quickAddProductSchema = z.object({
  barcode: z.string().trim().min(4),
  name: z.string().trim().min(2),
  price: z.coerce.number<number>().positive(),
  category: z.string().trim().optional()
});

export const customerSchema = z.object({
  customerName: z.string().trim().optional(),
  customerPhone: z.string().trim().optional()
});
