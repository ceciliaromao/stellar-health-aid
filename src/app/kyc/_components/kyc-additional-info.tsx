"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface KYCAdditionalInfoProps {
  onContinue: (data: { activity: string; industry: string }) => void;
  onBack: () => void;
}

const activities = [
  "Design Services",
  "Software Development",
  "Consultoria",
  "Educação",
];
const industries = ["Software Development", "Educação", "Saúde", "Financeiro"];

export default function KYCAdditionalInfo({
  onContinue,
  onBack,
}: Readonly<KYCAdditionalInfoProps>) {
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const activity = formData.get("activity") as string;
    const industry = formData.get("industry") as string;
    onContinue({ activity, industry });
  };

  return (
    <form
      ref={formRef}
      className="p-6 flex flex-col gap-6"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" type="button" onClick={onBack}>
          ←
        </Button>
        <h2 className="text-xl font-bold">Informações adicionais</h2>
      </div>
      <span className="text-sm text-muted-foreground">
        Preencha as informações necessárias
      </span>
      <select className="border rounded p-2" name="activity" defaultValue="">
        <option value="">Selecione uma opção da lista</option>
        {activities.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
      <select className="border rounded p-2" name="industry" defaultValue="">
        <option value="">Selecione uma opção da lista</option>
        {industries.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
      <Button className="mt-6 w-full" type="submit">
        Continue
      </Button>
    </form>
  );
}
