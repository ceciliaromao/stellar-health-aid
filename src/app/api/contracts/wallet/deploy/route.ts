import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exec } from "child_process";

function run(cmd: string, cwd?: string): Promise<{ stdout: string; stderr: string; code: number | null }> {
  return new Promise((resolve) => {
    const child = exec(cmd, { cwd, env: process.env }, (error, stdout, stderr) => {
      resolve({ stdout, stderr, code: (error as any)?.code ?? 0 });
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      email,
      publicKey: overridePublic,
      registry,
      usdc,
  defindex,
  source,
    } = (body ?? {}) as {
      userId?: string;
      email?: string;
      publicKey?: string;
      registry?: string;
      usdc?: string;
  defindex?: string;
  source?: string; // alias configurado no CLI (ex.: "alice") ou seed ("seed:S..." ou "S...")
    };

  const WASM_PATH = `${process.cwd()}/target/wasm32v1-none/release/health_aid_wallet.wasm`;
  const SOURCE_ACCOUNT = source || process.env.STELLAR_SOURCE_ACCOUNT || process.env.STELLAR_SOURCE_ACCOUNT_ALIAS || "alice";
    const NETWORK = process.env.STELLAR_NETWORK || "testnet";
    const REGISTRY = registry || process.env.REGISTRY_ADDRESS;
    const USDC = usdc || process.env.USDC_TOKEN_ADDRESS;
    const DEFINDEX = defindex || process.env.DEFINDEX_CONTRACT;
    const CLI = process.env.STELLAR_CLI || "stellar";

  if (!WASM_PATH || !REGISTRY || !USDC || !DEFINDEX) {
      return NextResponse.json(
    { error: "Missing env or params: REGISTRY_ADDRESS, USDC_TOKEN_ADDRESS, DEFINDEX_CONTRACT" },
        { status: 400 },
      );
    }

    let user = null as any;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    } else if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    }
    if (!user) return NextResponse.json({ error: "user not found" }, { status: 404 });

    const userPublic = overridePublic || user.publicKey;
    if (!userPublic) return NextResponse.json({ error: "user publicKey not found" }, { status: 400 });

    const cmd = `${CLI} contract deploy --wasm ${WASM_PATH} --source-account ${SOURCE_ACCOUNT} --network ${NETWORK} -- --user ${userPublic} --registry_address ${REGISTRY} --usdc_token ${USDC} --defindex_contract ${DEFINDEX}`;
    const maskedCmd = SOURCE_ACCOUNT && (SOURCE_ACCOUNT.startsWith("S") || SOURCE_ACCOUNT.includes("seed:S")) ? cmd.replace(SOURCE_ACCOUNT, "******") : cmd;
    const { stdout, stderr, code } = await run(cmd, `${process.cwd()}/contracts`);
    if (code !== 0) {
      const hint = stderr.includes("Failed to find config identity")
        ? "A conta de origem não foi encontrada no CLI. Crie/importe um alias (ex.: 'alice') com 'stellar keys generate alice' ou 'stellar keys add --seed S...', e opcionalmente funda no testnet. Alternativamente, envie 'source' no body como 'seed:S...' ou defina STELLAR_SOURCE_ACCOUNT."
        : undefined;
      return NextResponse.json({ ok: false, cmd: maskedCmd, stdout, stderr, hint }, { status: 500 });
    }

    // Try to parse contract id from output
    const contractId = stdout;

    if (contractId) {
      await prisma.user.update({ where: { id: user.id }, data: { walletContractId: contractId, deployStatus: "deployed" } });
    } else {
      await prisma.user.update({ where: { id: user.id }, data: { deployStatus: "deployed" } });
    }

  return NextResponse.json({ ok: true, cmd: maskedCmd, contractId, stdout });
  } catch (err) {
    console.error("/api/contracts/wallet/deploy error", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
