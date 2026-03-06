import {
  RecaptchaVerifier,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  type ConfirmationResult,
  type User
} from "firebase/auth";
import { getFirebaseAuth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";

let phoneConfirmation: ConfirmationResult | null = null;

export function subscribeAuthState(callback: (user: User | null) => void) {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => undefined;
  }
  return onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle() {
  const auth = getFirebaseAuth();
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase config is missing. Add env values first.");
  }
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function sendPhoneOtp(phoneNumber: string, containerId: string) {
  const auth = getFirebaseAuth();
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase config is missing. Add env values first.");
  }
  if (typeof window === "undefined") return;

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible"
  });
  phoneConfirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
}

export async function verifyPhoneOtp(otp: string) {
  if (!phoneConfirmation) {
    throw new Error("Please request OTP first.");
  }
  const credential = await phoneConfirmation.confirm(otp);
  return credential.user;
}

export async function logoutUser() {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await signOut(auth);
}
