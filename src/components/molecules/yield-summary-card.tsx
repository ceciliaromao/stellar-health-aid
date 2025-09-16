"use client";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface YieldSummaryCardProps {
  yieldBRL: number; // rendimento acumulado
  apyPercent: number; // APY ex: 5 => 5%
  className?: string;
}

export function YieldSummaryCard({
  yieldBRL,
  apyPercent,
  className,
}: YieldSummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-primary/40 bg-white px-4 py-3 flex items-center justify-between gap-4",
        className
      )}
    >
      <div className="flex flex-col text-sm leading-tight">
        <span className="font-medium flex items-center gap-1">
          Rendimento Obtido
          <Info size={14} className="opacity-70" />
        </span>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold tracking-tight">
          {yieldBRL} BRL
        </div>
        <div className="text-[11px] text-muted-foreground font-medium">
          {apyPercent}% APY
        </div>
      </div>
    </div>
  );
}
