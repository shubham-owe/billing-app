import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Barcode Billing App",
  description: "Barcode billing and invoicing with camera and USB scanner support"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
