"use client";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { EmbeddedAuthForm } from "@crossmint/client-sdk-react-ui";
import { Button } from "@/components/ui/button";
import { Carousel } from "./carousel/carousel";
import { AuthCrossmint } from "./auth-crossmint";

export interface StepDef {
  title: string;
  subtitle: string;
  img: string;
}

const steps: StepDef[] = [
  {
    title: "Sua saúde, seu dinheiro",
    subtitle:
      "Deposite em poucos passos e seja sempre o dono dos seus recursos.",
    img: "/images/login/step1.png",
  },
  {
    title: "Proteja e faça seu dinheiro crescer",
    subtitle:
      "Mantenha o valor contra a inflação e gere rendimentos automáticos.",
    img: "/images/login/step2.png",
  },
  {
    title: "Pague em pontos de saúde",
    subtitle: "Use seu saldo em farmácias e centros médicos autorizados.",
    img: "/images/login/step3.png",
  },
  {
    title: "Conecte com segurança",
    subtitle: "Faça login com Google para continuar.",
    img: "/images/login/step4.png",
  },
];

export default function Steps() {
  return (
    <div className="h-dvh max-h-dvh w-full max-w-xl flex flex-col justify-between items-center">
      <Carousel slides={steps} />
      <div className="mx-auto w-full max-w-sm pb-6 text-center">
        <AuthCrossmint />
        <p className="text-muted-foreground text-xs text-center">
          Ao efetuar login ou registrar-se, você concorda com nosso{" "}
          <a
            href="/contrato-de-servico"
            className="font-semibold underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contrato de Serviço
          </a>{" "}
          e{" "}
          <a
            href="/termos-e-condicoes"
            className="font-semibold underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Termos e Condições
          </a>
        </p>
      </div>
    </div>
  );
}
