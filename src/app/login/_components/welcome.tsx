"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function WelcomeCard() {
  return (
    <div className="w-full max-w-sm flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="w-full h-64 relative">
        <Image
          src="/images/login/step4.png"
          alt="Bem-vindo ao Stellar Health Aid"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 400px"
        />
      </div>
      <div className="p-6 space-y-5 text-center">
        <h1 className="text-2xl font-semibold leading-tight">Bem-vindo ao<br/>Stellar Health Aid</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Comece a depositar e cuidar da sua saúde em minutos.
        </p>
        <Link href="/dashboard/wallet" className="block">
          <Button className="w-full h-14 rounded-full text-base font-medium">Vamos!</Button>
        </Link>
      </div>
    </div>
  );
}
