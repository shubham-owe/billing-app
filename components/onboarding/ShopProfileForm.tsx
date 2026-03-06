"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { upsertProfile } from "@/lib/db";
import { DEFAULT_CURRENCY, DEFAULT_RECEIPT_PREFIX } from "@/lib/constants";
import { profileSchema } from "@/lib/validators";
import type { ShopProfile } from "@/lib/types";
import ImageUploader from "@/components/common/ImageUploader";
import { z } from "zod";

type ProfileInput = z.infer<typeof profileSchema>;

type ShopProfileFormProps = {
  existing?: ShopProfile;
  defaultPhone?: string;
  onSaved: () => void;
  submitLabel?: string;
};

export default function ShopProfileForm({
  existing,
  defaultPhone,
  onSaved,
  submitLabel = "Save Profile"
}: ShopProfileFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ownerName: existing?.ownerName ?? "",
      shopName: existing?.shopName ?? "",
      shopLogo: existing?.shopLogo,
      shopAddress: existing?.shopAddress ?? "",
      gstNumber: existing?.gstNumber ?? "",
      phoneNumber: existing?.phoneNumber ?? defaultPhone ?? "",
      email: existing?.email ?? "",
      currency: existing?.currency ?? DEFAULT_CURRENCY,
      taxEnabled: existing?.taxEnabled ?? false,
      taxPercent: existing?.taxPercent ?? 0,
      receiptFooterMessage: existing?.receiptFooterMessage ?? "Thank you visit again",
      receiptPrefix: existing?.receiptPrefix ?? DEFAULT_RECEIPT_PREFIX,
      businessCategory: existing?.businessCategory ?? ""
    }
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        try {
          await upsertProfile({
            ownerName: values.ownerName,
            shopName: values.shopName,
            shopLogo: values.shopLogo,
            shopAddress: values.shopAddress,
            gstNumber: values.gstNumber || undefined,
            phoneNumber: values.phoneNumber,
            email: values.email || undefined,
            currency: values.currency || DEFAULT_CURRENCY,
            taxEnabled: values.taxEnabled,
            taxPercent: values.taxPercent,
            receiptFooterMessage: values.receiptFooterMessage || undefined,
            receiptPrefix: values.receiptPrefix,
            businessCategory: values.businessCategory || undefined
          });
          toast.success("Profile saved");
          onSaved();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Failed to save profile");
        }
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm">Owner Name *</label>
          <input className="input" {...register("ownerName")} />
          {errors.ownerName ? <p className="error">{errors.ownerName.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm">Shop Name *</label>
          <input className="input" {...register("shopName")} />
          {errors.shopName ? <p className="error">{errors.shopName.message}</p> : null}
        </div>
      </div>

      <ImageUploader value={watch("shopLogo")} onChange={(value) => setValue("shopLogo", value)} />

      <div>
        <label className="mb-1 block text-sm">Shop Address *</label>
        <textarea className="input min-h-20" {...register("shopAddress")} />
        {errors.shopAddress ? <p className="error">{errors.shopAddress.message}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm">GST Number</label>
          <input className="input" {...register("gstNumber")} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Phone Number *</label>
          <input className="input" {...register("phoneNumber")} />
          {errors.phoneNumber ? <p className="error">{errors.phoneNumber.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm">Email</label>
          <input className="input" {...register("email")} />
          {errors.email ? <p className="error">{errors.email.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm">Currency</label>
          <input className="input" {...register("currency")} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Receipt Prefix</label>
          <input className="input" {...register("receiptPrefix")} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Business Category</label>
          <input className="input" {...register("businessCategory")} />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" {...register("taxEnabled")} />
          Enable GST/Tax
        </label>
        <div className="mt-3">
          <label className="mb-1 block text-sm">Default Tax %</label>
          <input className="input w-40" type="number" step="0.01" {...register("taxPercent")} />
          {errors.taxPercent ? <p className="error">{errors.taxPercent.message}</p> : null}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm">Receipt Footer Message</label>
        <input className="input" {...register("receiptFooterMessage")} />
      </div>

      <button className="btn-primary w-full md:w-auto" disabled={isSubmitting} type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
