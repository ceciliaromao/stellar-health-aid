"use client";

import { CrossmintAuthProvider, CrossmintProvider, CrossmintWalletProvider } from "@crossmint/client-sdk-react-ui";

if (!process.env.NEXT_PUBLIC_CROSSMINT_API_KEY) {
  throw new Error("NEXT_PUBLIC_CROSSMINT_API_KEY is not set");
}

const customAppearance = {
  colors: {
    accent: "#020617",
  },
};

const CLIENT_CROSSMINT_API_KEY = process.env.NEXT_PUBLIC_CROSSMINT_API_KEY || "";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <CrossmintProvider 
      apiKey={CLIENT_CROSSMINT_API_KEY}
    >
      <CrossmintAuthProvider
        loginMethods={["email"]} // Incluir email também
        appearance={customAppearance}
      >
        {/* Remover createOnLogin temporariamente para isolar o problema */}
        <CrossmintWalletProvider
          appearance={customAppearance}
        >
          {children}
        </CrossmintWalletProvider>
      </CrossmintAuthProvider>
    </CrossmintProvider>
  );
}
