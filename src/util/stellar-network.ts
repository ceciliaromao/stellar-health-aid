import { Networks } from "stellar-sdk";

const networkEnv = process.env.NETWORK?.toLowerCase() || "testnet";

const networkKey =
  networkEnv === "mainnet" ? "PUBLIC" : networkEnv.toUpperCase();

if (!(networkKey in Networks)) {
  throw new Error(
    `Invalid NETWORK value: ${networkEnv}. Must be one of: ${Object.keys(
      Networks
    )
      .join(", ")
      .toLowerCase()}`
  );
}

export const stellarNetwork = Networks[networkKey as keyof typeof Networks];