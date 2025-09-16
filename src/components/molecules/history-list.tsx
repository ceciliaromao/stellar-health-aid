"use client";
import { ActivityCard } from "@/components/molecules/activity-card";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Plus,
  Shield,
} from "lucide-react";

export interface HistoryItem {
  id: string;
  type: "yield" | "purchase" | "deposit" | "withdraw";
  title: string;
  description: string;
  amountBRL: number;
  amountUSD: number;
  date: string;
}

export const historyData: HistoryItem[] = [
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

export interface HistoryListProps {
  title?: string;
  limit?: number;
  showMoreLink?: boolean;
  moreHref?: string;
}

export function HistoryList({
  title = "Últimas atividades",
  limit,
  showMoreLink = true,
  moreHref = "/history",
}: Readonly<HistoryListProps>) {
  const items =
    typeof limit === "number" ? historyData.slice(0, limit) : historyData;
  const truncated = !!limit && historyData.length > limit;
  return (
    <section className="w-full">
      {title && <h2 className="text-base font-semibold mb-2">{title}</h2>}
      <div className="rounded-xl bg-white">
        {items.map((item, idx) => (
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
              (idx === items.length - 1 && !truncated ? "last:border-b-0" : "")
            }
          />
        ))}
      </div>
    </section>
  );
}
