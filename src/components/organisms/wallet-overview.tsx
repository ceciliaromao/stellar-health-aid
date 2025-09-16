"use client";
import { BalanceCard } from "@/components/molecules/balance-card";
import { YieldSummaryCard } from "@/components/molecules/yield-summary-card";

interface WalletOverviewProps {
  name?: string; // para mensagem de boas vindas
  balanceBRL: number;
  yieldBRL: number;
  apyPercent: number;
}

export function WalletOverview({ name, balanceBRL, yieldBRL, apyPercent }: WalletOverviewProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Bem vindo de volta{name ? `, ${name}` : ""}!</h1>
        <p className="text-sm text-muted-foreground">Aqui está uma visão geral da sua carteira</p>
      </div>
      <BalanceCard balanceBRL={balanceBRL} />
      <YieldSummaryCard yieldBRL={yieldBRL} apyPercent={apyPercent} />
    </div>
  );
}
