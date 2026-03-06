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

  const submitValue = () => {
    const barcode = value.trim();
    if (!barcode) return;
    onSubmit(barcode);
    setValue("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div className="rounded-md border border-slate-200 p-3">
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Barcode Input (USB scanner types here and ends with Enter)
      </label>
      <div className="flex gap-2">
        <input
          autoComplete="off"
          className="w-full rounded-md border border-slate-300 px-3 py-3 text-lg font-mono tracking-wider focus:border-slate-900 focus:outline-none"
          inputMode="numeric"
          onBlur={() => setTimeout(() => inputRef.current?.focus(), 50)}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submitValue();
            }
          }}
          placeholder="Scan or type barcode"
          ref={inputRef}
          value={value}
        />
        <button
          className="rounded-md bg-slate-900 px-4 py-2 text-white"
          onClick={submitValue}
          type="button"
        >
          Add
        </button>
      </div>
    </div>
  );
}
