import { cookies } from "next/headers";
import { createCrossmint, CrossmintAuth } from "@crossmint/server-sdk";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const jar = await cookies();
  const jwt = jar.get("crossmint-jwt")?.value;
  const refreshToken = jar.get("crossmint-refresh-token")?.value;
  if (!refreshToken) return null;
  try {
    const crossmint = createCrossmint({ apiKey: process.env.SERVER_CROSSMINT_API_KEY! });
    const crossmintAuth = CrossmintAuth.from(crossmint);
    const { userId } = await crossmintAuth.getSession({ jwt, refreshToken });
    if (!userId) return null;
    const user = await prisma.user.findUnique({ where: { crossmintUserId: userId } });
    return user;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error('UNAUTHENTICATED');
  return user;
}
