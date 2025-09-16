"use client";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface ActivityCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  amountBRL: number; // valor em BRL (positivo ou negativo)
  amountUSD: number; // valor em USD correspondente
  positive?: boolean; // força cor positiva (override de sinal)
  negative?: boolean; // força cor negativa
  className?: string;
  onClick?: () => void;
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function ActivityCard({
  icon,
  title,
  description,
  amountBRL,
  amountUSD,
  positive,
  negative,
  className,
  onClick,
}: ActivityCardProps) {
  const isPositive = positive ?? (!negative && amountBRL >= 0);
  const isNegative = negative ?? (!positive && amountBRL < 0);

  const Wrapper: any = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      type={onClick ? "button" : undefined}
      className={cn(
        "flex w-full items-center gap-3 py-3 px-3 rounded-md transition-colors select-none",
        onClick
          ? "cursor-pointer hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
          : "cursor-default",
        className
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground truncate">
          {title}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {description}
        </div>
      </div>
      <div className="text-right leading-tight">
        <div
          className={cn(
            "text-sm font-semibold",
            isPositive && "text-emerald-600",
            isNegative && "text-red-600"
          )}
        >
          {`${isPositive ? "+" : isNegative ? "-" : ""} ${Math.abs(
            amountBRL
          ).toLocaleString("pt-BR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })} BRL`}
        </div>
        <div className="text-[11px] text-muted-foreground">
          {`${formatCurrency(amountUSD, "USD")}`.replace("US$", "USD ")}
        </div>
      </div>
    </Wrapper>
  );
}
