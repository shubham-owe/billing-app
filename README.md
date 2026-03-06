# Offline POS Billing (Next.js + IndexedDB + Firebase Auth)

Offline-first barcode POS/billing app for small shops.

## Stack

- Next.js App Router + TypeScript
- TailwindCSS
- IndexedDB via Dexie.js (all business data)
- Firebase Authentication (Google + Phone OTP)
- `@zxing/browser` barcode scanning
- PWA manifest + service worker

## Features

- Auth screen with Google and Mobile OTP tabs
- Onboarding with shop profile, logo, tax and receipt settings
- Dashboard with quick actions
- Add products manually or by scanned barcode
- Scan products for billing (camera + scanner input mode)
- Quick-add unknown products during billing
- Save bills in IndexedDB and print receipts
- Bill history and bill detail view
- Editable profile and receipt footer
- JSON backup/restore + CSV product import/export
- Clear-all-data safety action
- Dark mode toggle
- Seeded demo products on first use

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env.local
```

3. Fill Firebase values in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

4. Run app:

```bash
npm run dev
```

## Firebase Phone Auth Notes

- Enable **Phone** provider in Firebase Authentication.
- Add allowed domains in Firebase Auth settings.
- For OTP on localhost and custom domains, ensure reCAPTCHA can load.
- For mobile camera scanning, use HTTPS URL (or localhost).

## Data Storage Model

- No backend database.
- Products, bills, profile, settings are all stored in IndexedDB on the user’s device.
- Authentication uses Firebase only for user identity.

## Backup Safety

- Export JSON backup regularly from `/backup`.
- Browser storage clear/uninstall can erase IndexedDB data.
