import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import ServiceWorkerRegister from "@/components/common/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "Offline POS Billing",
  description: "Offline-first barcode billing app with IndexedDB",
  manifest: "/manifest.json"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegister />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
