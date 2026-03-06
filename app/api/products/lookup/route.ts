import { findProductByBarcode } from "@/lib/catalog";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const barcode = request.nextUrl.searchParams.get("barcode")?.trim();

  if (!barcode) {
    return NextResponse.json({ message: "Barcode is required" }, { status: 400 });
  }

  const product = findProductByBarcode(barcode);

  if (!product) {
    return NextResponse.json({ message: "Unknown barcode" }, { status: 404 });
  }

  return NextResponse.json(product, { status: 200 });
}
