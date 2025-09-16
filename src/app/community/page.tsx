"use client";
import { communityCampaigns } from "@/data/community";
import SectionHeader from "@/components/molecules/section-header";
import { CommunityCard } from "@/components/molecules/community-card";
import Link from "next/link";
import { BackPage } from "@/components/back-page";

export default function CommunityPage() {
  const featured = communityCampaigns.slice(0, 2);
  const latest = communityCampaigns.slice(2);
  return (
    <div className="max-w-md mx-auto w-full px-6 py-6 space-y-10">
      <BackPage title="Comunidade" backHref="/dashboard/wallet" />
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