"use client";
import { communityCampaigns } from "@/data/community";
import SectionHeader from "@/components/molecules/section-header";
import { CommunityCard } from "@/components/molecules/community-card";
import Link from "next/link";

export default function CommunityPage() {
  const featured = communityCampaigns.slice(0, 2);
  const latest = communityCampaigns.slice(2);
  return (
    <div className="max-w-md mx-auto w-full px-6 py-6 space-y-10">
      <header className="flex items-center gap-2">
        <Link href="/dashboard/wallet" aria-label="Voltar" className="p-2 -ml-2 rounded-full hover:bg-black/5">←</Link>
        <h1 className="text-lg font-semibold">Comunidade</h1>
      </header>

      <section>
        <SectionHeader title="Campanhas em Destaque" />
        <div className="flex flex-col gap-4">
          {featured.map(c => (
            <Link key={c.id} href={`/community/${c.id}`} className="block">
              <CommunityCard
                id={c.id}
                name={c.name}
                priority={c.priority}
                title=""
                description={c.description}
                raisedBRL={c.raisedBRL}
                goalBRL={c.goalBRL}
              />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Últimas Campanhas" />
        <div className="flex flex-col gap-4">
          {latest.map(c => (
            <Link key={c.id} href={`/community/${c.id}`} className="block">
              <CommunityCard
                id={c.id}
                name={c.name}
                priority={c.priority}
                title=""
                description={c.description}
                raisedBRL={c.raisedBRL}
                goalBRL={c.goalBRL}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}