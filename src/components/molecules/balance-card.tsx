"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  balanceBRL: number;
  balanceUSDC: number;
  currency?: string; // padrão BRL
  className?: string;
}

export function BalanceCard({
  balanceBRL,
  balanceUSDC,
  currency = "BRL",
  className,
}: BalanceCardProps) {
  const [visible, setVisible] = useState(true);

  const formattedBRL = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(balanceBRL);

  const formattedUSDC = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(balanceUSDC);

  return (
    <div
      className={cn(
        "relative rounded-2xl p-5 text-black overflow-hidden shadow-sm",
        "bg-[linear-gradient(135deg,#F7E06D_0%,#F2D43D_100%)]",
        className
      )}
    >
      <div className="text-sm font-medium mb-2"></div>
      <div className="flex flex-col items-start gap-1">
        <div className="w-full flex justify-between items-end gap-2">
          <span className="text-4xl font-bold tracking-tight tabular-nums">
            {visible ? formattedBRL : "****"}
          </span>
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/70 hover:bg-white focus:outline-none focus:ring-2 focus:ring-black/30 transition"
            aria-label={visible ? "Ocultar saldo" : "Mostrar saldo"}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <span className="text-xs text-muted-foreground ml-1">{visible ? formattedUSDC : "****"} USDC</span>
      </div>
    </div>
  );
}
