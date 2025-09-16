"use client";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { getCampaign } from "@/data/community";
import { Button } from "@/components/ui/button";

export default function DonationSuccessPage() {
  const search = useSearchParams();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const amount = search.get("amount") || "";
  const campaign = getCampaign(params.id);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white">
      <div className="w-full aspect-[9/10] bg-[linear-gradient(135deg,#6745C2_0%,#F5D22A_100%)] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)]" />
        <div className="relative text-white text-7xl">✔</div>
      </div>
      <div className="flex-1 px-8 pt-10 pb-10 space-y-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Doação confirmada</h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
          {amount && <><span className="font-semibold">{amount} BRL</span> enviada. </>}
          Obrigado por ser parte do impacto que {campaign ? campaign.name : "o beneficiário"} receberá em sua saúde!
        </p>
        <Button
          onClick={() => router.push("/dashboard/wallet")}
          className="h-14 rounded-full w-full max-w-sm mx-auto bg-yellow-400 hover:bg-yellow-400/90 text-black text-base font-medium"
        >
          Voltar para casa
        </Button>
      </div>
    </div>
  );
}