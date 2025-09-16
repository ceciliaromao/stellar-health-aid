import { getFriendbotUrl } from "./friendbot-url";

export const initializeWithFriendbot = async (
  publicKey: string
): Promise<void> => {
  const friendbotUrl = getFriendbotUrl();

  try {
    await fetch(`${friendbotUrl}?addr=${encodeURIComponent(publicKey)}`);

    return;
  } catch (e) {
    throw new Error(
      `Failed to initialize account ${publicKey} with Friendbot: ${
        (<Error>e).message
      }`
    );
  }
};