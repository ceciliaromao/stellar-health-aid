"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import InputMask from "react-input-mask";
import { Button } from "@/components/ui/button";

interface KYCIdentificationProps {
  onContinue: (data: { cpf: string; email: string }) => void;
}

export default function KYCIdentification({
  onContinue,
}: KYCIdentificationProps) {
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(e.target.value);
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <h2 className="text-xl font-bold">Identificação</h2>
      <span className="text-sm text-muted-foreground">
        Preencha as informações necessárias
      </span>
      <InputMask mask="999.999.999-99" value={cpf} onChange={handleCpfChange}>
        {(inputProps: any) => <Input {...inputProps} placeholder="CPF" />}
      </InputMask>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        className="mt-6 w-full"
        disabled={!cpf || !email}
        onClick={() => onContinue({ cpf, email })}
      >
        Continue
      </Button>
    </div>
  );
}
