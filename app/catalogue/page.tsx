"use client";

import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "react-hot-toast";
import AppShell from "@/components/common/AppShell";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ProductEditDialog from "@/components/products/ProductEditDialog";
import CatalogueTable from "@/components/catalogue/CatalogueTable";
import { db } from "@/lib/dexie";
import { deleteProduct } from "@/lib/db";
import type { Product } from "@/lib/types";
import { useAppProfile } from "@/lib/hooks";

type SortBy = "newest" | "name" | "price";

export default function CataloguePage() {
  const profile = useAppProfile();
  const products = useLiveQuery(() => db.products.toArray(), []) ?? [];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [editing, setEditing] = useState<Product>();
  const [deleting, setDeleting] = useState<Product>();

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[],
    [products]
  );

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchQuery =
        !lower ||
        product.name.toLowerCase().includes(lower) ||
        product.barcode.toLowerCase().includes(lower) ||
        (product.category ?? "").toLowerCase().includes(lower);
      const matchCategory = category === "all" || product.category === category;
      return matchQuery && matchCategory;
    });

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price") {
      result.sort((a, b) => a.pricePaise - b.pricePaise);
    } else {
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    return result;
  }, [category, products, query, sortBy]);

  return (
    <AppShell title="Catalogue List">
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-2 md:grid-cols-4">
            <input
              className="input md:col-span-2"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by barcode, name, category"
              value={query}
            />
            <select
              className="input"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="all">All categories</option>
              {categories.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <select className="input" onChange={(e) => setSortBy(e.target.value as SortBy)} value={sortBy}>
              <option value="newest">Newest</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
          <p className="mt-2 text-xs text-slate-500">Total products: {filtered.length}</p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No products found" description="Add products or adjust your search filters." />
        ) : (
          <CatalogueTable
            currency={profile?.currency}
            onDelete={setDeleting}
            onEdit={setEditing}
            products={filtered}
          />
        )}
      </div>

      <ProductEditDialog onClose={() => setEditing(undefined)} open={Boolean(editing)} product={editing} />

      <ConfirmDialog
        confirmLabel="Delete Product"
        dangerous
        description={`Delete ${deleting?.name ?? "this product"} from catalogue?`}
        onCancel={() => setDeleting(undefined)}
        onConfirm={async () => {
          if (!deleting?.id) return;
          await deleteProduct(deleting.id);
          toast.success("Product deleted");
          setDeleting(undefined);
        }}
        open={Boolean(deleting)}
        title="Confirm Delete"
      />
    </AppShell>
  );
}
