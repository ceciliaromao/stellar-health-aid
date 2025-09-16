"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { HistoryList } from "@/components/molecules/history-list";

export default function HistoryFullPage() {
  return (
    <div className="max-w-md mx-auto w-full space-y-6 pb-24">
      <header className="flex items-center gap-2 pt-4 px-4">
        <Link href="/dashboard/wallet" aria-label="Voltar" className="p-2 -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base font-semibold">Histórico de transações</h1>
      </header>
      <div className="px-4">
        <HistoryList title="Setembro" showMoreLink={false} />
      </div>
    </div>
  );
}
