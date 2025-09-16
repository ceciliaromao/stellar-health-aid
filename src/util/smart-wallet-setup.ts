import {
  Account,
  Address,
  Asset,
  Keypair,
  nativeToScVal,
  Operation,
  TransactionBuilder,
  xdr,
} from "stellar-sdk";
import { Buffer } from "buffer";
import { getRpc } from "./rcp";
import { initializeWithFriendbot } from "./initialize-with-friendbot";
import { loadWasmFile } from "./load-wasm";
import { stellarNetwork } from "./stellar-network";
import { sendTransaction } from "./send-transaction-fn";
import { generateRandomSalt } from "./generate-random-salt";

const rpc = getRpc();
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
if (!ADMIN_PRIVATE_KEY) {
  console.warn("[reflector/prices] Missing ADMIN_PRIVATE_KEY env var");
}
const sourceKeypair = ADMIN_PRIVATE_KEY
  ? Keypair.fromSecret(ADMIN_PRIVATE_KEY)
  : (() => {
    throw new Error("ADMIN_PRIVATE_KEY not set");
  })();

export async function setupHealthAidWallet(
  userAddress: string,
  opts?: { registry?: string; usdc?: string; defindex?: string }
): Promise<string> {
  console.log(
    `
=============================================
Setup of Stellar Smart Wallet
=============================================
`
  );
  console.log("Initializing Issuer Account:", sourceKeypair.publicKey(), "...");
  await initializeWithFriendbot(sourceKeypair.publicKey());

  console.log("Loading WASM file...");
  const wasm = await loadWasmFile(
    "./target/wasm32v1-none/release/health_aid_wallet.wasm"
  );

  const inclusionFee = 1000;

  let issuerAccount: Account;
  try {
    issuerAccount = await rpc.getAccount(sourceKeypair.publicKey());
  } catch (error) {
    console.error("Error checking source account:", error);
    throw error;
  }

  console.log("Uploading WASM...");
  const uploadWasmtx = new TransactionBuilder(issuerAccount, {
    fee: inclusionFee.toString(),
    networkPassphrase: stellarNetwork,
  })
    .addOperation(
      Operation.uploadContractWasm({
        wasm,
      })
    )
    .setTimeout(90)
    .build();

  const uploadWasmtxPrep = await rpc.prepareTransaction(uploadWasmtx);

  uploadWasmtxPrep.sign(sourceKeypair);

  const uploadResult = await sendTransaction(uploadWasmtxPrep);

  const wasmHash = (
    uploadResult.resultMetaXdr
      .v3()
      .sorobanMeta()
      ?.returnValue()
      ?.value() as Buffer
  ).toString("hex") as string;

  console.log("WASM uploaded with hash:", wasmHash);
  console.log("Deploying contract...");

  const REGISTRY = opts?.registry || process.env.REGISTRY_ADDRESS!;
  const USDC = opts?.usdc || process.env.USDC_TOKEN_ADDRESS!;
  const DEFINDEX = opts?.defindex || process.env.DEFINDEX_CONTRACT!;

  // Se USDC começar com 'C', assume que é o contractId; se começar com 'G', assume issuer
  const usdcContractId = USDC.startsWith("C")
    ? USDC
    : new Asset("USDC", USDC).contractId(stellarNetwork);

  const toAddr = (s: string) => nativeToScVal(s, { type: "address" });

  const deployTx = new TransactionBuilder(issuerAccount, {
    fee: inclusionFee.toString(),
    networkPassphrase: stellarNetwork,
  })
    .addOperation(
      Operation.createCustomContract({
        address: new Address(sourceKeypair.publicKey()),
        wasmHash: Buffer.from(wasmHash!, "hex"),
        salt: generateRandomSalt(),
        constructorArgs: [
          toAddr(userAddress),
          toAddr(REGISTRY),
          toAddr(usdcContractId),
          toAddr(DEFINDEX),
        ],
      }),
    )
    .setTimeout(90)
    .build();

  const deployTxPrep = await rpc.prepareTransaction(deployTx);

  deployTxPrep.sign(sourceKeypair);

  const deployResult = await sendTransaction(deployTxPrep);

  const contractId = Address.fromScAddress(
    deployResult.resultMetaXdr
      .v3()
      .sorobanMeta()
      ?.returnValue()
      ?.address() as xdr.ScAddress
  ).toString();

  console.log("Contract deployed with ID:", contractId);
  return contractId;
}