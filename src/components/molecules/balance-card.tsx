"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  balanceBRL: number;
  currency?: string; // padrão BRL
  className?: string;
}

export function BalanceCard({
  balanceBRL,
  currency = "BRL",
  className,
}: BalanceCardProps) {
  const [visible, setVisible] = useState(true);

  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  })
    .format(balanceBRL)
    .replace("R$", "$")
    .replace(/\s/g, " ");

  return (
    <div
      className={cn(
        "relative rounded-2xl p-5 text-black overflow-hidden shadow-sm",
        // Gradient customizado solicitado
        "bg-[linear-gradient(135deg,#F7E06D_0%,#F2D43D_100%)]",
        className
      )}
    >
      <div className="text-sm font-medium mb-2">Saldo total</div>
      <div className="flex items-end gap-2">
        <div className="text-4xl font-bold tracking-tight tabular-nums">
          {visible ? formatted.split(",")[0] : "****"}
          <span className="text-gray-700 font-semibold">
            ,{visible ? formatted.split(",")[1] : "**"}
          </span>
          <span className="ml-2 text-sm font-semibold">{currency}</span>
        </div>
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/70 hover:bg-white focus:outline-none focus:ring-2 focus:ring-black/30 transition"
          aria-label={visible ? "Ocultar saldo" : "Mostrar saldo"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
