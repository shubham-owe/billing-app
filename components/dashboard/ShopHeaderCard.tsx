import type { ShopProfile } from "@/lib/types";

type ShopHeaderCardProps = {
  profile: ShopProfile;
  productsCount: number;
  billsCount: number;
};

export default function ShopHeaderCard({
  profile,
  productsCount,
  billsCount
}: ShopHeaderCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-4">
        {profile.shopLogo ? (
          <img
            alt={profile.shopName}
            className="h-16 w-16 rounded-lg object-cover"
            src={profile.shopLogo}
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-200 text-lg font-semibold dark:bg-slate-700">
            {profile.shopName.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {profile.shopName}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{profile.shopAddress}</p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
            Owner: {profile.ownerName}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800">
          <p className="text-slate-500 dark:text-slate-400">Products</p>
          <p className="text-xl font-bold">{productsCount}</p>
        </div>
        <div className="rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800">
          <p className="text-slate-500 dark:text-slate-400">Bills</p>
          <p className="text-xl font-bold">{billsCount}</p>
        </div>
      </div>
    </div>
  );
}
