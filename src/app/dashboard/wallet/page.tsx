"use client";
import { useConvertUsdToBrl } from "@/hooks/useConvertUsdToBrl";

import HistoryList from "@/components/organisms/history";
import { WalletOverview } from "@/components/organisms/wallet-overview";
import SectionHeader from "@/components/molecules/section-header";
import { ActionCircle, ActionCirclesRow } from "@/components/molecules/action-circle";
import { ArrowDownToLine, QrCode, Users } from "lucide-react";
import CommunityCarousel from "@/components/organisms/community-carousel";
import type { CommunityItem } from "@/components/molecules/community-card";
import { useEffect, useState } from "react";

const communityMock: CommunityItem[] = [
  {
    id: "c1",
    name: "João Santos",
    priority: "medium",
    title: "Tratamento Oncológico",
    description: "Tratamento de quimioterapia para câncer de pulmão em estágio 2. A família precisa de apoio para continuar o protocolo clínico.",
    raisedBRL: 8500,
    goalBRL: 12000,
  },
  {
    id: "c2",
    name: "Maria Oliveira",
    priority: "high",
    title: "Cirurgia Ortopédica",
    description: "Cirurgia reconstrutiva do joelho após acidente. Cada contribuição acelera a reabilitação.",
    raisedBRL: 4200,
    goalBRL: 15000,
  },
  {
    id: "c3",
    name: "Carlos Lima",
    priority: "low",
    title: "Exames Diagnósticos",
    description: "Sequência de exames laboratoriais de acompanhamento anual.",
    raisedBRL: 900,
    goalBRL: 3000,
  },
];

export default function WalletPage() {
  const { convertUsdToBrl, loading, error } = useConvertUsdToBrl();
  const [convertedBRL, setConvertedBRL] = useState<number | null>(null);

  // Valor mockado em USD
  const usdValue = 100;

  useEffect(() => {
    convertUsdToBrl(usdValue).then((result) => {
      setConvertedBRL(result);
    });
  }, [usdValue, convertUsdToBrl]);
  // Valor mockado em USD

  return (
    <div className="mx-auto w-full px-6 space-y-10">
      <WalletOverview
        balanceBRL={convertedBRL ?? 0}
        balanceUSDC={usdValue}
        yieldBRL={40}
        apyPercent={5}
      />

      {/* Ações rápidas */}
      <ActionCirclesRow>
        <ActionCircle href="/dashboard/deposit" label="Depósito" icon={<ArrowDownToLine />} />
        <ActionCircle href="/dashboard/payment" label="Pagar" icon={<QrCode />} />
        <ActionCircle href="/community" label="Comunidade" icon={<Users />} />
      </ActionCirclesRow>

      <div>
        <SectionHeader title="Ajuda da comunidade" href="/community" />
        <CommunityCarousel items={communityMock} />
      </div>

      <div>
        <SectionHeader title="Últimas atividades" href="/history" />
        <HistoryList limit={5} balanceBRL={convertedBRL ?? 0} title="" />
      </div>
    </div>
  );
}
