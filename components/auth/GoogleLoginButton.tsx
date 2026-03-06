"use client";

import { toast } from "react-hot-toast";
import { Chrome } from "lucide-react";
import { signInWithGoogle } from "@/lib/auth";

type GoogleLoginButtonProps = {
  onSuccess: () => void;
};

export default function GoogleLoginButton({ onSuccess }: GoogleLoginButtonProps) {
  return (
    <button
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
      onClick={async () => {
        try {
          await signInWithGoogle();
          onSuccess();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Google sign-in failed");
        }
      }}
      type="button"
    >
      <Chrome size={18} />
      Continue with Google
    </button>
  );
}
