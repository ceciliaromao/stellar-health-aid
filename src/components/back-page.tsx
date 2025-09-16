"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface BackPageProps {
  title: string;
  backHref: string;
}

export function BackPage({ title, backHref }: BackPageProps) {
  return (
    <header className="flex items-center gap-2">
      <Link href={backHref} aria-label="Voltar" className="p-2 -ml-2 rounded-full hover:bg-black/5">
        <ChevronLeft />
      </Link>
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  );
}
