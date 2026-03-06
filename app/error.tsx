"use client";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center p-4 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-sm text-slate-600">{error.message}</p>
      <button className="btn-primary mt-4" onClick={reset} type="button">
        Try again
      </button>
    </main>
  );
}
