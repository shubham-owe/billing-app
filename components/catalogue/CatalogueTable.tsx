import CurrencyText from "@/components/common/CurrencyText";
import type { Product } from "@/lib/types";

type CatalogueTableProps = {
  products: Product[];
  currency?: string;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function CatalogueTable({
  products,
  currency,
  onEdit,
  onDelete
}: CatalogueTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="min-w-full text-sm">
        <thead className="border-b border-slate-200 dark:border-slate-800">
          <tr className="text-left">
            <th className="px-3 py-2">Barcode</th>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Category</th>
            <th className="px-3 py-2">Price</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr className="border-b border-slate-100 dark:border-slate-800" key={product.id}>
              <td className="px-3 py-2 font-mono">{product.barcode}</td>
              <td className="px-3 py-2">{product.name}</td>
              <td className="px-3 py-2">{product.category || "-"}</td>
              <td className="px-3 py-2">
                <CurrencyText currency={currency} paise={product.pricePaise} />
              </td>
              <td className="px-3 py-2">
                <div className="flex gap-2">
                  <button
                    className="rounded border border-slate-300 px-2 py-1 dark:border-slate-700"
                    onClick={() => onEdit(product)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="rounded bg-rose-100 px-2 py-1 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200"
                    onClick={() => onDelete(product)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
