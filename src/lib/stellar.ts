import { Keypair } from "stellar-sdk";

export function createStellarKeypair() {
  const kp = Keypair.random();
  return {
    publicKey: kp.publicKey(),
    secret: kp.secret(),
  };
}
