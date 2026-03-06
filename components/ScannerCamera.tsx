"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import { useCallback, useEffect, useRef, useState } from "react";

type ScannerCameraProps = {
  onDetected: (barcode: string) => void;
  onCameraError?: (message: string) => void;
};

export default function ScannerCamera({
  onDetected,
  onCameraError
}: ScannerCameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("Camera is idle");
  const [lastBarcode, setLastBarcode] = useState("");
  const [errorText, setErrorText] = useState<string | null>(null);

  const cleanupScanner = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setIsRunning(false);
  }, []);

  const stopScanning = useCallback(() => {
    cleanupScanner();
    setStatus("Camera stopped");
  }, [cleanupScanner]);

  const startScanning = useCallback(async () => {
    if (isRunning || !videoRef.current) return;

    setErrorText(null);
    setStatus("Requesting camera permission...");

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      const guidance =
        typeof window !== "undefined" && !window.isSecureContext
          ? "Camera is unavailable because this page is not secure. Open the app using HTTPS (for example, an ngrok HTTPS URL) and try again."
          : "Camera API is unavailable in this browser context. Open the app in Chrome or Safari (not an in-app browser) and allow camera access.";

      setErrorText(guidance);
      setStatus("Camera unavailable");
      onCameraError?.(guidance);
      return;
    }

    try {
      const reader = new BrowserMultiFormatReader();

      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, error) => {
          if (result) {
            const text = result.getText().trim();
            if (!text) return;
            setLastBarcode(text);
            setStatus(`Scanned: ${text}`);
            onDetected(text);
          }

          if (error) {
            const errorName = (error as { name?: string }).name ?? "";
            if (
              errorName &&
              errorName !== "NotFoundException" &&
              errorName !== "ChecksumException" &&
              errorName !== "FormatException"
            ) {
              setStatus(`Scanner status: ${errorName}`);
            }
          }
        }
      );

      controlsRef.current = controls;
      setIsRunning(true);
      setStatus("Camera scanning started");
    } catch (error) {
      cleanupScanner();

      const errorName = (error as { name?: string }).name ?? "";
      const message =
        error instanceof Error ? error.message : "Unable to access camera";
      const permissionDenied =
        errorName === "NotAllowedError" || /permission|denied/i.test(message);

      const guidance = permissionDenied
        ? "Camera permission denied. Allow camera access and retry, or use Scanner/Input mode."
        : message;

      setErrorText(guidance);
      setStatus("Camera unavailable");
      onCameraError?.(guidance);
    }
  }, [cleanupScanner, isRunning, onCameraError, onDetected]);

  useEffect(() => {
    return () => cleanupScanner();
  }, [cleanupScanner]);

  return (
    <div className="rounded-md border border-slate-200 p-3">
      <video
        className="h-64 w-full rounded-md bg-black object-cover"
        muted
        playsInline
        ref={videoRef}
      />

      <div className="mt-3 flex gap-2">
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          disabled={isRunning}
          onClick={startScanning}
          type="button"
        >
          Start Camera
        </button>
        <button
          className="rounded-md bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-300"
          disabled={!isRunning}
          onClick={stopScanning}
          type="button"
        >
          Stop Camera
        </button>
      </div>

      <div className="mt-3 text-sm text-slate-700">
        <p>
          <span className="font-semibold">Camera status:</span> {status}
        </p>
        <p className="mt-1">
          <span className="font-semibold">Last camera scan:</span>{" "}
          {lastBarcode || "-"}
        </p>
        {errorText ? <p className="mt-2 text-amber-700">{errorText}</p> : null}
      </div>
    </div>
  );
}
