"use client";
import { ActivityCard } from "@/components/molecules/activity-card";
import { Plus, Shield, ArrowDownRight, ArrowUpRight } from "lucide-react";

interface HistoryItem {
  id: string;
  type: "yield" | "purchase" | "deposit" | "withdraw";
  title: string;
  description: string;
  amountBRL: number;
  amountUSD: number;
  date: string; // ISO ou formato legível (já formatado aqui)
}

// Mock: substituir depois por fetch/prop externa
const historyData: HistoryItem[] = [
  {
    id: "1",
    type: "yield",
    title: "Rendimentos",
    description: "4 de setembro",
    amountBRL: 10,
    amountUSD: 1.88,
    date: "2025-09-04",
  },
  {
    id: "2",
    type: "purchase",
    title: "Farmácia - Medicamentos",
    description: "3 de setembro",
    amountBRL: -50,
    amountUSD: 9.4,
    date: "2025-09-03",
  },
  {
    id: "3",
    type: "yield",
    title: "Rendimentos",
    description: "3 de setembro",
    amountBRL: 15,
    amountUSD: 2.82,
    date: "2025-09-03",
  },
  {
    id: "4",
    type: "purchase",
    title: "Farmácia - Medicamentos",
    description: "2 de setembro",
    amountBRL: -500,
    amountUSD: 94,
    date: "2025-09-02",
  },
  {
    id: "5",
    type: "yield",
    title: "Rendimentos",
    description: "2 de setembro",
    amountBRL: 15,
    amountUSD: 2.82,
    date: "2025-09-02",
  },
  {
    id: "6",
    type: "deposit",
    title: "Poupança Mensal em Saúde",
    description: "2 de setembro",
    amountBRL: 1000,
    amountUSD: 188,
    date: "2025-09-02",
  },
];

function getIcon(t: HistoryItem["type"]) {
  switch (t) {
    case "yield":
      return <Plus size={22} strokeWidth={2} />;
    case "purchase":
      return <Shield size={22} strokeWidth={2} />;
    case "deposit":
      return <ArrowDownRight size={22} strokeWidth={2} />;
    case "withdraw":
      return <ArrowUpRight size={22} strokeWidth={2} />;
    default:
      return <Plus size={22} strokeWidth={2} />;
  }
}

export default function HistoryList() {
  return (
    <section className="w-full">
      <h2 className="text-base font-semibold mb-2">Últimas atividades</h2>
      <div className="rounded-xl bg-white">
        {historyData.map((item, idx) => (
          <ActivityCard
            key={item.id}
            icon={getIcon(item.type)}
            title={item.title}
            description={item.description}
            amountBRL={item.amountBRL}
            amountUSD={item.amountUSD}
            positive={item.amountBRL > 0}
            negative={item.amountBRL < 0}
            className={
              "first:pt-4 last:pb-4 border-b border-border " +
              (idx === historyData.length - 1 ? "last:border-b-0" : "")
            }
          />
        ))}
      </div>
    </section>
  );
}
