"use client";
import { BalanceCard } from "@/components/molecules/balance-card";
import { YieldSummaryCard } from "@/components/molecules/yield-summary-card";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@crossmint/client-sdk-react-ui";
import { UserCircle } from "lucide-react";

interface WalletOverviewProps {
  name?: string;
  balanceBRL: number;
  yieldBRL: number;
  apyPercent: number;
}

export function WalletOverview({
  name,
  balanceBRL,
  yieldBRL,
  apyPercent,
}: Readonly<WalletOverviewProps>) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Bem vindo de volta!</h1>
          <p className="text-sm text-muted-foreground">
            Aqui está uma visão geral da sua carteira
          </p>
        </div>
        <Link
          href="/dashboard/profile"
          className="shrink-0"
          aria-label="Ir para o perfil"
        >
          <span className="relative inline-block h-12 w-12 rounded-full ring-2 ring-white overflow-hidden bg-gray-100">
            <Image src="/images/assets/xlm.png" alt="Logo Stellar" fill sizes="48px" className="object-cover" />
          </span>
        </Link>
      </div>
      <BalanceCard balanceBRL={balanceBRL} />
      <YieldSummaryCard yieldBRL={yieldBRL} apyPercent={apyPercent} />
    </div>
  );
}
