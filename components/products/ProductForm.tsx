"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { addProduct } from "@/lib/db";
import { rupeesToPaise } from "@/lib/money";
import { productSchema } from "@/lib/validators";

type ProductFormValues = z.infer<typeof productSchema>;

type ProductFormProps = {
  initialBarcode?: string;
  onSaved?: () => void;
};

export default function ProductForm({ initialBarcode, onSaved }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      barcode: "",
      name: "",
      price: 0,
      category: "",
      stockQty: undefined,
      unit: ""
    }
  });

  useEffect(() => {
    if (initialBarcode) setValue("barcode", initialBarcode);
  }, [initialBarcode, setValue]);

  return (
    <form
      className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
      onSubmit={handleSubmit(async (values) => {
        try {
          await addProduct({
            barcode: values.barcode.trim(),
            name: values.name.trim(),
            pricePaise: rupeesToPaise(values.price),
            category: values.category?.trim() || undefined,
            stockQty: values.stockQty ? Number(values.stockQty) : undefined,
            unit: values.unit?.trim() || undefined
          });
          toast.success("Product added");
          reset({ ...values, barcode: "", name: "", price: 0 });
          onSaved?.();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Failed to add product");
        }
      })}
    >
      <h2 className="text-lg font-semibold">Add Product</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm">Barcode *</label>
          <input className="input" {...register("barcode")} />
          {errors.barcode ? <p className="error">{errors.barcode.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm">Product Name *</label>
          <input className="input" {...register("name")} />
          {errors.name ? <p className="error">{errors.name.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm">Price (INR) *</label>
          <input className="input" step="0.01" type="number" {...register("price")} />
          {errors.price ? <p className="error">{errors.price.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm">Category</label>
          <input className="input" {...register("category")} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Stock Qty</label>
          <input className="input" type="number" {...register("stockQty")} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Unit</label>
          <input className="input" placeholder="pcs, kg, packet" {...register("unit")} />
        </div>
      </div>

      <button className="btn-primary" disabled={isSubmitting} type="submit">
        Save Product
      </button>
    </form>
  );
}
