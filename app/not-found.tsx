import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center p-4 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">The requested route does not exist.</p>
      <Link className="btn-primary mt-4" href="/dashboard">
        Go to dashboard
      </Link>
    </main>
  );
}
