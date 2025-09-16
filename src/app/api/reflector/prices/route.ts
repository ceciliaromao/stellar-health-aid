import {
  Contract,
  Keypair,
  Networks,
  scValToNative,
  TransactionBuilder,
  nativeToScVal,
} from "@stellar/stellar-sdk";
import SorobanRpc from "@stellar/stellar-sdk/rpc";
import { NextResponse } from "next/server";

// Setup - Using mainnet RPC endpoint
const server = new SorobanRpc.Server("https://soroban-testnet.stellar.org");
// NUNCA deixe secret hardcoded; use variável de ambiente
const STELLAR_SECRET = process.env.SOROBAN_SECRET_KEY;
if (!STELLAR_SECRET) {
  console.warn("[reflector/prices] Missing SOROBAN_SECRET_KEY env var");
}
const source = STELLAR_SECRET
  ? Keypair.fromSecret(STELLAR_SECRET)
  : (() => {
    throw new Error("SOROBAN_SECRET_KEY not set");
  })();
const contractId = "CCSSOHTBL3LEWUCBBEB5NJFC2OKFRC74OWEIJIZLRJBGAAU4VMU5NV4W"; // reflector oracle contract
const contract = new Contract(contractId);

export async function GET() {
  try {
    // Build a transaction to call a contract function
    let account = await server.getAccount(source.publicKey());

    // Create an asset parameter - let's try USDT as an example
    const asset = nativeToScVal(['Other', 'BRL'], { type: 'symbol' }); // Adjust based on actual asset representation

    let tx = new TransactionBuilder(account, {
      fee: "1000",
      networkPassphrase: Networks.TESTNET, // Changed to TESTNET since you're using testnet server
    })
      .addOperation(
        contract.call("lastprice", asset) // Added the asset parameter
      )
      .setTimeout(30)
      .build();

    // Simulate transaction
    const sim = await server.simulateTransaction(tx);

    console.log("[reflector/prices] Simulation ok");

    // Read returned values
    let decodedValue: unknown = null;
    if (sim.result && sim.result.retval) {
      // console.log("Raw return value:", sim.result.retval);
      decodedValue = scValToNative(sim.result.retval);
      console.log("[reflector/prices] Decoded return type:", typeof decodedValue);
    }

    // Helper para serializar BigInt de forma segura em JSON
    const serialize = (val: any): any => {
      if (typeof val === "bigint") return val.toString();
      if (Array.isArray(val)) return val.map(serialize);
      if (val && typeof val === "object") {
        const out: Record<string, any> = {};
        for (const [k, v] of Object.entries(val)) out[k] = serialize(v);
        return out;
      }
      return val;
    };

    // Caso seja BigInt simples (ex.: preço como inteiro escalado), exponha também em campo dedicado
    const priceRaw = typeof decodedValue === "bigint" ? (decodedValue as bigint).toString() : null;

    return NextResponse.json({
      success: true,
      price: {
        raw: priceRaw, // inteiro como string (não perde precisão)
        // scale: opcional — informe a escala usada pelo contrato (ex.: 7) se aplicável
      },
      decodedValue: serialize(decodedValue),
    });
  } catch (error: any) {
    console.error("Error calling contract:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}