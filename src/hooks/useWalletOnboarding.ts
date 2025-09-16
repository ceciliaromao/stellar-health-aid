"use client";
import { useMutation } from "@tanstack/react-query";

type DeployOverrides = {
  registry?: string;
  usdc?: string;
  defindex?: string;
};

async function syncAuth() {
  const res = await fetch("/api/auth/sync", {
    method: "POST",
    next: { revalidate: 0 },  // desabilita cache
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`sync failed: ${res.status}`);
  return (await res.json()) as {
    ok: boolean;
    user: {
      id: string;
      email: string;
      publicKey?: string;
      walletContractId?: string;
    };
  };
}

async function createWallet(userId: string, storeSecret = false) {
  const res = await fetch("/api/wallet/create", {
    method: "POST",
        next: { revalidate: 0 },  // desabilita cache
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, storeSecret }),
    credentials: "include",
  });
  if (!res.ok) throw new Error(`create wallet failed: ${res.status}`);
  return (await res.json()) as { publicKey: string; storedSecret: boolean };
}

async function fundWallet(userId: string) {
  const res = await fetch("/api/wallet/fund", {
    method: "POST",
    next: { revalidate: 0 },  // desabilita cache
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
    credentials: "include",
  });
  if (!res.ok) throw new Error(`fund failed: ${res.status}`);
  return (await res.json()) as { ok: true };
}

async function deployWallet(userId: string, overrides?: DeployOverrides) {
  const res = await fetch("/api/contracts/wallet/deploy", {
    method: "POST",
    next: { revalidate: 0 },  // desabilita cache
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...overrides }),
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`deploy failed: ${res.status} ${text}`);
  }
  return (await res.json()) as { ok: boolean; contractId?: string };
}

async function logout() {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } catch { }
}

export function useWalletOnboarding() {
  return useMutation({
    mutationKey: ["wallet-onboarding"],
    mutationFn: async (params: {
      email?: string;
      storeSecret?: boolean;
      overrides?: DeployOverrides;
      deploy?: boolean;
      fund?: boolean;
      forceDeploy?: boolean;
    }) => {
      const { email, storeSecret = false, overrides, forceDeploy = false } = params;

      const { user } = await syncAuth();
      console.log("useWalletOnboarding user", user);

      // Se email foi selecionado e não bate com a sessão atual, faz logout para limpar estado
      if (email && user.email && email !== user.email) {
        await logout();
        throw new Error(
          `Sessão ativa pertence a ${user.email}. Saí e entre novamente com ${email}.`
        );
      }

      if (!user) throw new Error("user not found after sync");

      if (user.publicKey && user.walletContractId) {
        // já possui wallet/contrato; não força deploy
        return { userId: user.id, publicKey: user.publicKey, walletContractId: user.walletContractId };
      }

      let create;
      if (!user.publicKey) {
        console.log("Creating wallet for user without publicKey");
        create = await createWallet(user.id, storeSecret);
      } else {
        create = { publicKey: user.publicKey, storedSecret: false };
      }

      let deployedContractId: string | undefined = user.walletContractId;
      if (!deployedContractId) {
        console.log("Deploying wallet contract");
        const res = await deployWallet(user.id, overrides);
        if (res.contractId) deployedContractId = res.contractId;

        console.log("Funding wallet for user");
        await fundWallet(user.id);
      }

      return { userId: user.id, publicKey: create.publicKey, walletContractId: deployedContractId };
    },
  });
}
