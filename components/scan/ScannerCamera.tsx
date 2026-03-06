"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import { useCallback, useEffect, useRef, useState } from "react";

type ScannerCameraProps = {
  onDetected: (barcode: string) => void;
};

export default function ScannerCamera({ onDetected }: ScannerCameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Idle");

  const cleanup = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setRunning(false);
  }, []);

  const start = useCallback(async () => {
    if (running || !videoRef.current) return;
    setStatus("Starting camera...");

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      setStatus("Camera unavailable. Use HTTPS and a supported browser.");
      return;
    }

    try {
      const reader = new BrowserMultiFormatReader();
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result) => {
          if (!result) return;
          const code = result.getText().trim();
          if (!code) return;
          onDetected(code);
          setStatus(`Scanned ${code}`);
        }
      );
      controlsRef.current = controls;
      setRunning(true);
      setStatus("Scanning...");
    } catch {
      setStatus("Camera denied/unavailable. Switch to input scanner mode.");
    }
  }, [onDetected, running]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <video className="h-64 w-full rounded-lg bg-black object-cover" playsInline ref={videoRef} />
      <div className="mt-3 flex gap-2">
        <button className="btn-primary" disabled={running} onClick={start} type="button">
          Start Camera
        </button>
        <button
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
          disabled={!running}
          onClick={cleanup}
          type="button"
        >
          Stop Camera
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{status}</p>
    </div>
  );
}
