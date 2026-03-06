"use client";

import { useEffect, useRef, useState } from "react";

type ScannerInputProps = {
  onSubmit: (barcode: string) => void;
};

export default function ScannerInput({ onSubmit }: ScannerInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <label className="mb-1 block text-sm font-medium">Scanner / Manual Barcode</label>
      <input
        autoComplete="off"
        className="w-full rounded-lg border border-slate-300 px-3 py-3 font-mono text-lg dark:border-slate-700 dark:bg-slate-900"
        onBlur={() => setTimeout(() => inputRef.current?.focus(), 60)}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          const barcode = value.trim();
          if (!barcode) return;
          onSubmit(barcode);
          setValue("");
        }}
        placeholder="Scan barcode and press Enter"
        ref={inputRef}
        value={value}
      />
    </div>
  );
}
