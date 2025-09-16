import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createCrossmint, CrossmintAuth } from "@crossmint/server-sdk";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const jar = await cookies();
  const jwt = jar.get("crossmint-jwt")?.value;
  const refreshToken = jar.get("crossmint-refresh-token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  // 1) Validate/refresh the Crossmint session using the Server SDK
  const crossmint = createCrossmint({ apiKey: process.env.SERVER_CROSSMINT_API_KEY! });
  const crossmintAuth = CrossmintAuth.from(crossmint);

  // getSession returns the trusted userId and (if needed) refreshed tokens
  const { userId } = await crossmintAuth.getSession({ jwt, refreshToken });

  // Optional: pull profile to store email (nice to have)
  const profile = await crossmintAuth.getUser(userId); // requires users.read scope

  if (!profile.email) {
    // If no email is found, we can't proceed
    return NextResponse.json({ ok: false, error: "No email found" }, { status: 401 });
  }

  // 2) Upsert user in your DB and capture the record
  const user = await prisma.user.upsert({
    where: { crossmintUserId: userId },
    update: { email: profile.email },
    create: {
      crossmintUserId: userId,
      email: profile.email,
    },
  });

  return NextResponse.json({ success: true, userId });
}
