import HistoryList from "@/components/organisms/history";
import { WalletOverview } from "@/components/organisms/wallet-overview";

export default function WalletPage() {
  return(
    <div className="max-w-2xl mx-auto space-y-8 pb-4">
      <WalletOverview name="" balanceBRL={490.05} yieldBRL={40} apyPercent={5} />
      <HistoryList />
    </div>
  );
}
