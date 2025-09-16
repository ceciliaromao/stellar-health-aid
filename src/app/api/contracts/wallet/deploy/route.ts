import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setupHealthAidWallet } from "@/util/smart-wallet-setup";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, publicKey: overridePublic, registry, usdc, defindex } = (body ?? {}) as {
      userId?: string;
      email?: string;
      publicKey?: string;
      registry?: string;
      usdc?: string;
      defindex?: string;
    };

    let user = null as any;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    } else if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    }
    if (!user) return NextResponse.json({ error: "user not found" }, { status: 404 });

    const userPublic = overridePublic || user.publicKey;
    if (!userPublic) return NextResponse.json({ error: "user publicKey not found" }, { status: 400 });

  // Executa deploy via Soroban RPC helper (com overrides opcionais)
  const contractId = await setupHealthAidWallet(userPublic, { registry, usdc, defindex });

    if (contractId) {
      await prisma.user.update({ where: { id: user.id }, data: { walletContractId: contractId, deployStatus: "deployed" } });
    } else {
      await prisma.user.update({ where: { id: user.id }, data: { deployStatus: "deployed" } });
    }

    return NextResponse.json({ ok: true, contractId });
  } catch (err) {
    console.error("/api/contracts/wallet/deploy error", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
