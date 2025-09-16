"use client";
import { CommunityCampaign } from "@/data/community";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function CampaignOverview({ campaign, className }: { campaign: CommunityCampaign; className?: string }) {
  const percent = Math.min(100, (campaign.raisedBRL / campaign.goalBRL) * 100);
  return (
    <div className={cn("rounded-xl border border-black/10 bg-white p-4 space-y-3", className)}>
      <div>
        <p className="text-sm font-semibold">{campaign.name}</p>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{campaign.description}</p>
      </div>
      <div className="flex items-center justify-between text-[11px] font-medium text-gray-700">
        <span>Progresso</span>
        <span>{percent.toFixed(1)}%</span>
      </div>
      <Progress value={percent} className="h-2 bg-gray-200" />
      <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
        <span>Arrecadado: {campaign.raisedBRL.toLocaleString("pt-BR", { minimumFractionDigits: 0 })} BRL</span>
        <span className="text-right">Objetivo: {campaign.goalBRL.toLocaleString("pt-BR", { minimumFractionDigits: 0 })} BRL</span>
      </div>
      <ul className="mt-1 space-y-1 text-[11px] text-gray-600">
        <li>📄 {campaign.verifiedDocs} Documento médico verificado</li>
        <li>👥 {campaign.donors} Doadores</li>
      </ul>
    </div>
  );
}

export default CampaignOverview;