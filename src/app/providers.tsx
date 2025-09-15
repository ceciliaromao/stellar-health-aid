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

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <CrossmintProvider apiKey={process.env.NEXT_PUBLIC_CROSSMINT_API_KEY || ""}>
      <CrossmintAuthProvider
        authModalTitle="Welcome"
        loginMethods={["google"]}
        appearance={customAppearance}
        termsOfServiceText={
          <p>
            By continuing, you accept the{" "}
            <a
              href="https://www.crossmint.com/legal/terms-of-service"
              target="_blank"
            >
              Wallet's Terms of Service
            </a>
            {", and to recieve marketing communications from Crossmint."}
          </p>
        }
      >
        <CrossmintWalletProvider
          appearance={customAppearance}
          createOnLogin={{
            chain: "stellar",
            signer: {
              type: "email",
            },
          }}
        >
          {/* <SyncProvider> */}
            {children}
          {/* </SyncProvider> */}
        </CrossmintWalletProvider>
      </CrossmintAuthProvider>
    </CrossmintProvider>
  );
}
