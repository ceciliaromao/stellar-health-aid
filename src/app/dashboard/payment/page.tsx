"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QrScanner } from "./_components/qr-scanner";
import { useToast } from "@/hooks/use-toast";

export default function PaymentPage() {
  const [scannedData, setScannedData] = useState<null | {
    provider: string; valueBRL: number; valueUSD: number; concept: string; address: string;
  }>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const parsePayload = (text: string) => {
    // Exemplo de payload esperado: provider|valueBRL|valueUSD|concept|address
    const parts = text.split("|");
    if (parts.length >= 5) {
      return {
        provider: parts[0] || "Comerciante",
        valueBRL: Number(parts[1]) || 100,
        valueUSD: Number(parts[2]) || 18.8,
        concept: parts[3] || "Compra",
        address: parts.slice(4).join("|") || "GB5R3CLOMWDVKPGTKUZQPHDKNKIWI3I64L2CBL7DZA4ECKS3BYREDDMN"
      };
    }
    // fallback mock
    return {
      provider: "Farmácia do João",
      valueBRL: 100,
      valueUSD: 18.8,
      concept: "Farmácia - Medicamentos",
      address: "GB5R3CLOMWDVKPGTKUZQPHDKNKIWI3I64L2CBL7DZA4ECKS3BYREDDMN"
    };
  };

  const handleScanSuccess = (decoded: string) => {
    const data = parsePayload(decoded);
    setScannedData(data);
  };

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Pagamento concluído", description: "Transação confirmada." });
      router.push("/dashboard/wallet");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
      {!scannedData ? (
        <div className="flex flex-col items-center gap-5 w-full max-w-md">
          <div className="relative">
            <div className="relative bg-white rounded-[28px] shadow-md p-2">
              <div className="relative rounded-2xl border-4 border-yellow-400/90 p-2 bg-black">
                <div className="absolute inset-0 pointer-events-none">
                  {/* cantos decorativos */}
                  <span className="absolute top-2 left-2 w-5 h-1 bg-yellow-400 rounded" />
                  <span className="absolute top-2 right-2 w-5 h-1 bg-yellow-400 rounded" />
                  <span className="absolute bottom-2 left-2 w-5 h-1 bg-yellow-400 rounded" />
                  <span className="absolute bottom-2 right-2 w-5 h-1 bg-yellow-400 rounded" />
                </div>
                <div className="w-[260px] h-[260px] overflow-hidden rounded-lg">
                  <QrScanner onResult={handleScanSuccess} onError={(e) => console.warn("QR error", e)} qrbox={240} />
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs bg-amber-50 text-amber-900 border border-amber-200 rounded-md p-3 w-full max-w-[300px]">
              Você só pode pagar em estabelecimentos autorizados. Saiba mais <button type="button" className="underline font-medium">aqui</button>.
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center px-4">Escaneie o código QR</p>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{scannedData.provider}</span>
          </div>
          <div className="text-4xl font-bold text-primary">
            R$ {scannedData.valueBRL.toFixed(2)} <span className="text-base text-muted-foreground">({scannedData.valueUSD} USD)</span>
          </div>
          <div className="text-sm text-muted-foreground mb-2">{scannedData.concept}</div>
          <div className="text-xs break-all mb-4">
            <span className="font-semibold">Endereço de pagamento:</span><br />
            {scannedData.address}
          </div>
          <Button className="w-full" onClick={handlePayment} disabled={loading}>
            {loading ? "Processando..." : "Confirmar"}
          </Button>
        </div>
      )}
    </div>
  );
}
