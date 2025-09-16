"use client";
import { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

interface QrScannerProps {
  onResult: (text: string) => void;
  /** Chamado apenas para erros relevantes (não para cada frame sem código). */
  onError?: (err: string) => void;
  fps?: number;
  qrbox?: number | { width: number; height: number };
  /** Intervalo mínimo em ms entre chamadas de erro contínuo (evita spam). */
  frameErrorIntervalMs?: number;
}

export function QrScanner({ onResult, onError, fps = 10, qrbox = 250, frameErrorIntervalMs = 1500 }: Readonly<QrScannerProps>) {
  // Gera id apenas no client para evitar mismatch SSR
  const containerId = useRef(`qr-reader-container-${Math.random().toString(36).slice(2)}`);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const lastFrameErrorRef = useRef<number>(0);

  useEffect(() => {
    const id = containerId.current;
    const start = async () => {
      if (html5QrCodeRef.current) return;
      try {
        const html5QrCode = new Html5Qrcode(id, { verbose: false });
        html5QrCodeRef.current = html5QrCode;
        const safeStop = () => { html5QrCode.stop().catch(() => undefined); };
        const onDecode = (decoded: string) => {
          onResult(decoded);
          safeStop();
        };
        const onFrameError = (err: any) => {
          const msg = typeof err === "string" ? err : JSON.stringify(err);
          if (msg.includes("NotFoundException")) {
            const now = Date.now();
            if (now - lastFrameErrorRef.current > frameErrorIntervalMs) {
              lastFrameErrorRef.current = now;
            }
            return;
          }
            const now = Date.now();
            if (now - lastFrameErrorRef.current < frameErrorIntervalMs) return;
            lastFrameErrorRef.current = now;
            if (onError) onError(msg);
        };

        await html5QrCode.start(
          { facingMode: "environment" },
          { fps, qrbox },
          onDecode,
          onFrameError
        );
      } catch (e: any) {
        if (onError) onError(e.message || "Erro ao iniciar câmera");
      }
    };
    start();

    return () => {
      if (html5QrCodeRef.current) {
        const state = (html5QrCodeRef.current as any).getState?.();
        if (state === (Html5QrcodeScannerState.SCANNING as any)) {
          html5QrCodeRef.current.stop().catch(() => undefined);
        }
        try { html5QrCodeRef.current.clear(); } catch {}
      }
    };
  }, [fps, qrbox, onResult, onError]);

  return <div id={containerId.current} className="w-full" />;
}
