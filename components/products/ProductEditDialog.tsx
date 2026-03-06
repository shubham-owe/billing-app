"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import type { Product } from "@/lib/types";
import { rupeesToPaise } from "@/lib/money";
import { updateProduct } from "@/lib/db";

type ProductEditDialogProps = {
  open: boolean;
  product?: Product;
  onClose: () => void;
};

export default function ProductEditDialog({
  open,
  product,
  onClose
}: ProductEditDialogProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [stockQty, setStockQty] = useState<string>("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    if (!product) return;
    setName(product.name);
    setPrice(product.pricePaise / 100);
    setCategory(product.category ?? "");
    setStockQty(product.stockQty?.toString() ?? "");
    setUnit(product.unit ?? "");
  }, [product]);

  if (!open || !product?.id) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl dark:bg-slate-900">
        <h3 className="text-lg font-semibold">Edit Product</h3>
        <div className="mt-3 space-y-3">
          <input className="input" onChange={(e) => setName(e.target.value)} value={name} />
          <input
            className="input"
            min={0}
            onChange={(e) => setPrice(Number(e.target.value))}
            step="0.01"
            type="number"
            value={price}
          />
          <input
            className="input"
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            value={category}
          />
          <input
            className="input"
            onChange={(e) => setStockQty(e.target.value)}
            placeholder="Stock qty"
            type="number"
            value={stockQty}
          />
          <input
            className="input"
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Unit"
            value={unit}
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button className="flex-1 rounded-lg border border-slate-300 px-3 py-2" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary flex-1"
            onClick={async () => {
              await updateProduct(product.id!, {
                name: name.trim(),
                pricePaise: rupeesToPaise(price),
                category: category.trim() || undefined,
                stockQty: stockQty ? Number(stockQty) : undefined,
                unit: unit.trim() || undefined
              });
              toast.success("Product updated");
              onClose();
            }}
            type="button"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
