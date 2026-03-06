import { format } from "date-fns";
import CurrencyText from "@/components/common/CurrencyText";
import type { BillWithItems, ShopProfile } from "@/lib/types";

type BillDetailsProps = {
  data: BillWithItems;
  profile?: ShopProfile;
};

export default function BillDetails({ data, profile }: BillDetailsProps) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-xl font-bold">{data.bill.billNumber}</h2>
        <p className="text-sm text-slate-500">
          {format(new Date(data.bill.createdAt), "dd MMM yyyy, hh:mm a")}
        </p>
      </div>

      {profile ? (
        <div className="rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800">
          <p className="font-semibold">{profile.shopName}</p>
          <p>{profile.shopAddress}</p>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="px-2 py-1 text-left">Item</th>
              <th className="px-2 py-1 text-left">Qty</th>
              <th className="px-2 py-1 text-left">Rate</th>
              <th className="px-2 py-1 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr className="border-b border-slate-100 dark:border-slate-800" key={item.id}>
                <td className="px-2 py-1">{item.nameSnapshot}</td>
                <td className="px-2 py-1">{item.qty}</td>
                <td className="px-2 py-1">
                  <CurrencyText currency={profile?.currency} paise={item.unitPricePaise} />
                </td>
                <td className="px-2 py-1">
                  <CurrencyText currency={profile?.currency} paise={item.lineTotalPaise} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <CurrencyText currency={profile?.currency} paise={data.bill.subtotalPaise} />
        </div>
        <div className="flex justify-between">
          <span>Tax ({data.bill.taxPercent}%)</span>
          <CurrencyText currency={profile?.currency} paise={data.bill.taxAmountPaise} />
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <CurrencyText currency={profile?.currency} paise={data.bill.totalPaise} />
        </div>
      </div>
    </div>
  );
}
