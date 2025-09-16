"use client";
import { useMutation } from "@tanstack/react-query";

type DeployOverrides = {
  registry?: string;
  usdc?: string;
  defindex?: string;
};

async function syncAuth(email?: string) {
  const res = await fetch("/api/auth/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(email ? { email } : {}),
  });
  if (!res.ok) throw new Error(`sync failed: ${res.status}`);
  return (await res.json()) as {
    ok: boolean; 
    user: { 
      id: string; 
      email: string; 
      publicKey?: string; 
      walletContractId?: string;
    }
  };
}

async function createWallet(userId: string, storeSecret = false) {
  const res = await fetch("/api/wallet/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, storeSecret }),
  });
  if (!res.ok) throw new Error(`create wallet failed: ${res.status}`);
  return (await res.json()) as { publicKey: string; storedSecret: boolean };
}

async function fundWallet(userId: string) {
  const res = await fetch("/api/wallet/fund", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error(`fund failed: ${res.status}`);
  return (await res.json()) as { ok: true };
}

async function deployWallet(userId: string, overrides?: DeployOverrides) {
  const res = await fetch("/api/contracts/wallet/deploy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...overrides }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`deploy failed: ${res.status} ${text}`);
  }
  return (await res.json()) as { ok: boolean; contractId?: string };
}

export function useWalletOnboarding() {
  return useMutation({
    mutationKey: ["wallet-onboarding"],
    mutationFn: async (params: { email?: string; storeSecret?: boolean; overrides?: DeployOverrides; deploy?: boolean; fund?: boolean }) => {
      const { email, storeSecret = false, overrides, fund = true } = params;
      const { user } = await syncAuth(email);
      if (user.publicKey && user.walletContractId) {
        // already has a wallet
        return { userId: user.id, publicKey: user.publicKey, walletContractId: user.walletContractId };
      }

      let create;
      if (!user.publicKey) {
        console.log("Creating wallet for user without publicKey");
        create = await createWallet(user.id, storeSecret);
      } else {
        create = { publicKey: user.publicKey, storedSecret: false };
      }
      if (!user.walletContractId) {
        console.log("Deploying wallet contract for user without walletContractId");
        await deployWallet(user.id, overrides);
      }
      if (fund) {
        console.log("Funding wallet for user");
        await fundWallet(user.id);
      }
      return { userId: user.id, publicKey: create.publicKey, walletContractId: user.walletContractId };
    },
  });
}
