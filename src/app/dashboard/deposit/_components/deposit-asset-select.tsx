"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Asset {
  code: string;
  name: string;
  icon: string;
}

interface DepositAssetSelectProps {
  assets: Asset[];
  onSelect: (code: string) => void;
}

export default function DepositAssetSelect({ assets, onSelect }: DepositAssetSelectProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = assets.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold">Depósito</h2>
        <span className="text-sm text-muted-foreground">Escolha um ativo da lista</span>
      </div>
      <Input
        placeholder="Pesquisar um ativo"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-2"
      />
      <div className="flex flex-col gap-2">
        {filtered.map(asset => (
          <button
            key={asset.code}
            type="button"
            className={`flex items-center gap-2 p-3 rounded cursor-pointer border w-full text-left ${selected === asset.code ? "bg-yellow-100 border-yellow-400" : "bg-white border-gray-200"}`}
            onClick={() => setSelected(asset.code)}
            aria-pressed={selected === asset.code}
          >
            {/* Ícone do ativo */}
            <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={`/images/assets/${asset.icon}.png`}
                alt={asset.name}
                className="w-5 h-5 object-contain"
              />
            </span>
            <span className="font-medium">{asset.name}</span>
            {selected === asset.code && <span className="ml-auto text-yellow-500">✔</span>}
          </button>
        ))}
      </div>
      <Button
        className="mt-6 w-full"
        disabled={!selected}
        onClick={() => selected && onSelect(selected)}
      >
        Continue
      </Button>
    </div>
  );
}
