import { Networks } from "stellar-sdk";
import { stellarNetwork } from "./stellar-network";

export const getFriendbotUrl = () => {
  switch (stellarNetwork) {
    case Networks.TESTNET:
      return "https://friendbot.stellar.org";
    case Networks.FUTURENET:
      return "https://friendbot-futurenet.stellar.org";
    case Networks.PUBLIC:
    case Networks.SANDBOX:
    case Networks.STANDALONE:
    default:
      throw new Error(
        `Friendbot is not defined for the ${stellarNetwork} network.`
      );
  }
};