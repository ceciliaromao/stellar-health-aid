import { Server } from "stellar-sdk/rpc";

if (!process.env.STELLAR_RPC_URL) {
  throw new Error("STELLAR_RPC_URL env var is not set");
}

export const getRpc = () => {
  return new Server(process.env.STELLAR_RPC_URL!, { allowHttp: true });
};