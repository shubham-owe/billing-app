"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { clearAuthMeta, ensureSeededProducts } from "@/lib/db";
import { logoutUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useRouteGuards } from "@/lib/hooks";
import ThemeToggle from "@/components/common/ThemeToggle";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Add Products" },
  { href: "/scan", label: "Scan Bill" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/bills", label: "Bills" },
  { href: "/profile", label: "Profile" },
  { href: "/backup", label: "Backup" }
];

type AppShellProps = {
  title: string;
  children: React.ReactNode;
  requireProfile?: boolean;
};

export default function AppShell({
  title,
  children,
  requireProfile = true
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready } = useRouteGuards({ requireAuth: true, requireProfile });

  useEffect(() => {
    if (!ready) return;
    void ensureSeededProducts();
  }, [ready]);

  if (!ready) {
    return (
      <main className="mx-auto max-w-6xl p-4">
        <div className="h-28 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-4 pb-24 md:pb-8">
      <header className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
              onClick={async () => {
                await logoutUser();
                await clearAuthMeta();
                toast.success("Logged out");
                router.replace("/auth");
              }}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="mb-4 hidden grid-cols-7 gap-2 md:grid">
        {NAV_ITEMS.map((item) => (
          <Link
            className={cn(
              "rounded-lg border px-3 py-2 text-center text-sm",
              pathname === item.href
                ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
            )}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <section>{children}</section>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 gap-1 border-t border-slate-200 bg-white p-2 md:hidden dark:border-slate-800 dark:bg-slate-900">
        {NAV_ITEMS.slice(0, 4).map((item) => (
          <Link
            className={cn(
              "rounded-md px-2 py-2 text-center text-xs",
              pathname === item.href
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            )}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
