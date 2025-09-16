"use client";

import { SyncProvider } from "@/context/sync-provider";
import { CrossmintAuthProvider, CrossmintProvider, CrossmintWalletProvider } from "@crossmint/client-sdk-react-ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

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
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <CrossmintProvider apiKey={CLIENT_CROSSMINT_API_KEY}>
        <CrossmintAuthProvider loginMethods={["google"]} appearance={customAppearance}>
          <CrossmintWalletProvider appearance={customAppearance}>
            <SyncProvider>{children}</SyncProvider>
          </CrossmintWalletProvider>
        </CrossmintAuthProvider>
      </CrossmintProvider>
    </QueryClientProvider>
  );
}
