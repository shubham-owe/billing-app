export function normalizeBarcode(raw: string): string {
  return raw.trim();
}

export function isLikelyBarcode(value: string): boolean {
  return /^[0-9A-Za-z\-_.]{4,32}$/.test(value.trim());
}

export class BarcodeDebouncer {
  private lastMap: Record<string, number> = {};
  constructor(private windowMs: number) {}

  shouldSkip(code: string): boolean {
    const now = Date.now();
    const last = this.lastMap[code] ?? 0;
    if (now - last < this.windowMs) return true;
    this.lastMap[code] = now;
    return false;
  }
}
