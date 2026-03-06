export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center p-4 text-center">
      <div>
        <h1 className="text-2xl font-bold">You are offline</h1>
        <p className="mt-2 text-sm text-slate-600">
          The app shell is available. Reconnect for auth operations if needed.
        </p>
      </div>
    </main>
  );
}
