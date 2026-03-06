import Link from "next/link";
import {
  ArchiveRestore,
  BookText,
  History,
  PackagePlus,
  ScanBarcode,
  UserRoundCog
} from "lucide-react";

const ACTIONS = [
  { href: "/products", label: "Add Products", icon: PackagePlus },
  { href: "/scan", label: "Scan Products", icon: ScanBarcode },
  { href: "/catalogue", label: "Catalogue List", icon: BookText },
  { href: "/bills", label: "Bill History", icon: History },
  { href: "/profile", label: "My Profile", icon: UserRoundCog },
  { href: "/backup", label: "Backup / Restore", icon: ArchiveRestore }
];

export default function DashboardActionGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            href={action.href}
            key={action.href}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
                <Icon size={18} />
              </div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {action.label}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
