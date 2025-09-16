"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export interface CommunityItem {
  id: string;
  name: string;
  avatarUrl?: string;
  verified?: boolean;
  priority: "low" | "medium" | "high";
  title: string; // pequena headline ou tratamento
  description: string;
  raisedBRL: number;
  goalBRL: number;
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(v).replace("R$", "").trim();
}

const priorityLabel: Record<CommunityItem["priority"], { text: string; color: string }> = {
  low: { text: "Low Priority", color: "bg-green-100 text-green-800" },
  medium: { text: "Medium Priority", color: "bg-amber-100 text-amber-800" },
  high: { text: "High Priority", color: "bg-red-100 text-red-800" },
};

export interface CommunityCardProps extends CommunityItem {
  onDonate?: (id: string) => void;
  onDetails?: (id: string) => void;
  className?: string;
}

export function CommunityCard({ id, name, avatarUrl, verified, priority, description, raisedBRL, goalBRL, onDonate, onDetails, className }: Readonly<CommunityCardProps>) {
  const percent = Math.min(100, (raisedBRL / goalBRL) * 100);
  const pr = priorityLabel[priority];
  return (
    <div className={cn("rounded-2xl border border-black/10 bg-white p-4 flex flex-col gap-3 w-full shrink-0", className)}>
      <div className="flex items-start gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
          {avatarUrl && <Image src={avatarUrl} alt={name} fill sizes="40px" className="object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-tight truncate">{name}</p>
            <span className={cn("px-2 py-[2px] rounded-full text-[10px] font-medium whitespace-nowrap", pr.color)}>{pr.text}</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-snug">{description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] font-medium text-gray-700">
        <span>Progresso</span>
        <span>{percent.toFixed(1)}%</span>
      </div>
      <Progress value={percent} className="h-2 bg-gray-200" />
      <div className="flex items-center justify-between text-[11px] text-gray-600">
        <span>Arrecadado: {formatCurrency(raisedBRL)} BRL</span>
        <span className="text-right">Objetivo: {formatCurrency(goalBRL)} BRL</span>
      </div>
      <div className="flex gap-2 pt-1">
        <Button onClick={() => onDonate?.(id)} className="flex-1 rounded-full bg-yellow-400 hover:bg-yellow-400/90 text-black text-sm font-medium h-10">
          Doe agora
        </Button>
        <Button onClick={() => onDetails?.(id)} variant="outline" className="rounded-full h-10 px-4 text-sm font-medium">
          Ver detalhes
        </Button>
      </div>
    </div>
  );
}

export default CommunityCard;