"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { EmbeddedAuthForm, useAuth } from "@crossmint/client-sdk-react-ui";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWalletOnboarding } from "@/hooks/useWalletOnboarding";

export function AuthCrossmint() {
  const { status: authStatus } = useAuth();
  const onboarding = useWalletOnboarding();
  const startedRef = useRef(false);
  const router = useRouter();

  const isLoggedIn = authStatus === "logged-in";

  useEffect(() => {
    if (isLoggedIn && !startedRef.current) {
      startedRef.current = true;
      // Após login, sincron'iza e cria a carteira (sem fundar ainda)
      onboarding.mutate({ storeSecret: false, deploy: false, fund: false });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (onboarding.isSuccess) {
      router.replace("/dashboard");
    }
  }, [onboarding.isSuccess, router]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <DrawerHeader>
          <Button className="bg-primary w-full text-black rounded-2xl">
            Login
          </Button>
        </DrawerHeader>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full flex flex-col justify-center items-center gap-4 p-4">
          <div className="sm:max-w-md">
            <DialogTitle className="text-lg font-semibold text-center">Welcome</DialogTitle>
            <hr className="bb-2 mt-4" />
            <EmbeddedAuthForm />
            {onboarding.isPending && (
              <div className="mt-4 text-sm text-center">Configurando sua carteira...</div>
            )}
            {onboarding.isError && (
              <div className="mt-4 text-sm text-center text-red-600">
                Falha ao configurar a carteira. Tente novamente.
              </div>
            )}
            {onboarding.isSuccess && (
              <div className="mt-4 text-sm text-center">Carteira criada com sucesso! Redirecionando...</div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
