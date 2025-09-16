"use client";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

interface PaymentSuccessProps {
  onRedirect?: () => void;
}

export function PaymentSuccess({ onRedirect }: PaymentSuccessProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onRedirect) onRedirect();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onRedirect]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
      <CheckCircle size={64} className="text-green-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Pagamento realizado!</h1>
      <p className="text-base text-muted-foreground mb-6">Seu pagamento foi processado com sucesso.</p>
      <span className="text-xs text-muted-foreground">Você será redirecionado para a home...</span>
    </div>
  );
}
