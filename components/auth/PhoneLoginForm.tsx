"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { sendPhoneOtp, verifyPhoneOtp } from "@/lib/auth";

type PhoneLoginFormProps = {
  onSuccess: () => void;
};

export default function PhoneLoginForm({ onSuccess }: PhoneLoginFormProps) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-3">
      <input
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+91XXXXXXXXXX"
        value={phone}
      />
      <div id="recaptcha-container" />
      {!otpSent ? (
        <button
          className="w-full rounded-lg bg-slate-900 px-4 py-3 text-white hover:bg-slate-800"
          disabled={loading}
          onClick={async () => {
            try {
              setLoading(true);
              await sendPhoneOtp(phone, "recaptcha-container");
              setOtpSent(true);
              toast.success("OTP sent");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Failed to send OTP");
            } finally {
              setLoading(false);
            }
          }}
          type="button"
        >
          Send OTP
        </button>
      ) : (
        <>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            value={otp}
          />
          <button
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700"
            disabled={loading}
            onClick={async () => {
              try {
                setLoading(true);
                await verifyPhoneOtp(otp);
                onSuccess();
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Invalid OTP");
              } finally {
                setLoading(false);
              }
            }}
            type="button"
          >
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}
