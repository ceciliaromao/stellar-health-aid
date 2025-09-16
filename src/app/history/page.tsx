"use client";
import { BackPage } from "@/components/back-page";
import { HistoryList } from "@/components/molecules/history-list";

export default function HistoryFullPage() {
  return (
    <div className="max-w-md mx-auto w-full space-y-6 pb-24">
      <BackPage title="Histórico de transações" backHref="/dashboard/wallet" />
      <div className="px-4">
        <HistoryList title="Setembro" showMoreLink={false} />
      </div>
    </div>
  );
}
