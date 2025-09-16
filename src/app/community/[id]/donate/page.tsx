"use client";
import { BackPage } from "@/components/back-page";
import CampaignOverview from "@/components/molecules/campaign-overview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCampaign } from "@/data/community";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function DonatePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const campaign = getCampaign(params.id);
  const [amount, setAmount] = useState("100.00");

  if (!campaign) return <div className="p-6">Campanha não encontrada.</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular processamento e redirecionar
    setTimeout(
      () =>
        router.push(
          `/community/${campaign.id}/donate/success?amount=${amount}`
        ),
      600
    );
  };

  return (
    <div className="max-w-md mx-auto w-full px-6 py-6 space-y-8">
      <BackPage title="Faça uma doação" backHref="/dashboard/wallet" />
      <div>
        <h2 className="text-sm font-semibold mb-3">Visão geral da campanha</h2>
        <CampaignOverview campaign={campaign} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Valor da doação</label>
          <div className="rounded-xl border p-3 flex items-center gap-3">
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 p-0 h-8 text-base font-semibold"
              inputMode="decimal"
            />
            <div className="text-xs text-muted-foreground ml-auto">
              Saldo total: 1.390,05 BRL
            </div>
            <button
              type="button"
              onClick={() => setAmount("100.00")}
              className="px-3 py-1 rounded-full border text-xs font-medium hover:bg-black/5"
            >
              Max
            </button>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-full h-12"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 rounded-full h-12 bg-yellow-400 hover:bg-yellow-400/90 text-black font-semibold"
          >
            Confirmar doação
          </Button>
        </div>
      </form>
    </div>
  );
}
