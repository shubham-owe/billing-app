"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { quickAddProductSchema } from "@/lib/validators";
import { addProduct } from "@/lib/db";
import { rupeesToPaise } from "@/lib/money";
import { toast } from "react-hot-toast";

type Values = z.infer<typeof quickAddProductSchema>;

type QuickAddProductDialogProps = {
  open: boolean;
  barcode?: string;
  onClose: () => void;
  onAdded: (barcode: string) => void;
};

export default function QuickAddProductDialog({
  open,
  barcode,
  onClose,
  onAdded
}: QuickAddProductDialogProps) {
  const { register, handleSubmit, reset } = useForm<Values>({
    resolver: zodResolver(quickAddProductSchema),
    values: { barcode: barcode ?? "", name: "", price: 0, category: "" }
  });

  if (!open || !barcode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl dark:bg-slate-900">
        <h3 className="text-lg font-semibold">Product not found</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Quickly add this product to catalogue and continue billing.
        </p>
        <form
          className="mt-3 space-y-2"
          onSubmit={handleSubmit(async (values) => {
            try {
              await addProduct({
                barcode: values.barcode,
                name: values.name,
                pricePaise: rupeesToPaise(values.price),
                category: values.category || undefined
              });
              toast.success("Product added");
              onAdded(values.barcode);
              reset();
              onClose();
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Failed");
            }
          })}
        >
          <input className="input" readOnly {...register("barcode")} />
          <input className="input" placeholder="Name" {...register("name")} />
          <input className="input" placeholder="Price INR" step="0.01" type="number" {...register("price")} />
          <input className="input" placeholder="Category (optional)" {...register("category")} />
          <div className="flex gap-2">
            <button
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button className="btn-primary flex-1" type="submit">
              Save & Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
