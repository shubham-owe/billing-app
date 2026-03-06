# Barcode Billing App (Next.js + TypeScript)

Barcode-based billing/invoicing MVP with:
- Camera barcode scanning (`@zxing/browser`)
- USB scanner keyboard-wedge input (Enter-terminated)
- Product lookup API (`/api/products/lookup`)
- Cart with quantity controls and totals
- Tax toggle + editable tax percent
- Unknown barcode custom-item flow (current bill only)
- Printable receipt route (`/print`) with `window.print()`

## Run

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## Test Flows

1. Camera scan:
- Open `Camera Scan` tab
- Click `Start Camera`
- Allow camera permission
- Scan a barcode from seeded catalog (example: `8901030865012`)

2. USB scanner input:
- Open `Scanner / Input` tab
- Keep the input focused
- Scan with USB scanner (it should type barcode + Enter)
- Item should auto-add

3. Unknown barcode:
- Scan/type a barcode not in catalog
- Dialog opens
- Add custom name + price
- It is added only for current bill session

4. Print:
- Add items
- Click `Print Bill`
- App stores bill in localStorage and navigates to `/print`
- Print dialog auto-opens
