"use client";

import { ImagePlus } from "lucide-react";
import { resizeImageToDataUrl } from "@/lib/utils";

type ImageUploaderProps = {
  value?: string;
  onChange: (dataUrl?: string) => void;
};

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Shop Logo
      </label>
      <div className="flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
          <ImagePlus size={16} />
          Upload
          <input
            accept="image/*"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const dataUrl = await resizeImageToDataUrl(file);
              onChange(dataUrl);
            }}
            type="file"
          />
        </label>
        {value ? (
          <button
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700"
            onClick={() => onChange(undefined)}
            type="button"
          >
            Remove
          </button>
        ) : null}
      </div>
      {value ? (
        <img
          alt="Shop logo preview"
          className="mt-3 h-20 w-20 rounded-lg border border-slate-300 object-cover dark:border-slate-700"
          src={value}
        />
      ) : null}
    </div>
  );
}
