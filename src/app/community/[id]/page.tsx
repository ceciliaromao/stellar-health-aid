"use client";
import { useParams, useRouter } from "next/navigation";
import { getCampaign } from "@/data/community";
import CampaignOverview from "@/components/molecules/campaign-overview";
import { Button } from "@/components/ui/button";

export default function CommunityCampaignDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const campaign = getCampaign(params.id);
  if (!campaign) return <div className="p-6">Campanha não encontrada.</div>;
  return (
    <div className="max-w-md mx-auto w-full px-6 py-6 space-y-8">
      <header className="flex items-center gap-2">
        <button onClick={() => router.back()} aria-label="Voltar" className="p-2 -ml-2 rounded-full hover:bg-black/5">←</button>
        <h1 className="text-lg font-semibold">Campanha</h1>
      </header>
      <CampaignOverview campaign={campaign} />
      <div className="space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          {campaign.description}
        </p>
      </div>
      <div className="pt-4">
        <Button onClick={() => router.push(`/community/${campaign.id}/donate`)} className="w-full h-12 rounded-full bg-yellow-400 hover:bg-yellow-400/90 text-black font-semibold">
          Fazer uma doação
        </Button>
      </div>
    </div>
  );
}