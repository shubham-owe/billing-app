import type { Product } from "@/lib/types";

export const PRODUCT_CATALOG: Product[] = [
  { barcode: "8901030865012", name: "Whole Milk 1L", price: 2.49 },
  { barcode: "8901491101223", name: "Brown Bread Loaf", price: 1.99 },
  { barcode: "8901063010018", name: "Eggs (12 Pack)", price: 3.79 },
  { barcode: "8901719100051", name: "Basmati Rice 5kg", price: 12.99 },
  { barcode: "8906001024518", name: "Refined Sugar 1kg", price: 1.49 },
  { barcode: "8901233021455", name: "Sunflower Oil 1L", price: 4.69 },
  { barcode: "8904043902127", name: "Black Tea 250g", price: 3.29 },
  { barcode: "8903146005014", name: "Instant Coffee 100g", price: 5.99 },
  { barcode: "8901207034151", name: "Dishwashing Liquid 500ml", price: 2.89 },
  { barcode: "8906013030040", name: "Bath Soap (Pack of 3)", price: 2.59 },
  { barcode: "8901764032085", name: "Toothpaste 150g", price: 2.25 },
  { barcode: "8901725130169", name: "Shampoo 340ml", price: 4.45 },
  { barcode: "8901537022119", name: "Bottled Water 1L", price: 0.99 },
  { barcode: "8901806001108", name: "Potato Chips 100g", price: 1.35 },
  { barcode: "8904098203016", name: "Chocolate Cookies 200g", price: 2.79 },
  { barcode: "8908001123004", name: "Laundry Detergent 1kg", price: 6.49 }
];

export function findProductByBarcode(barcode: string): Product | undefined {
  const normalized = barcode.trim();
  return PRODUCT_CATALOG.find((product) => product.barcode === normalized);
}
