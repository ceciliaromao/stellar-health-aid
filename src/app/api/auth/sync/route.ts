import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createCrossmint, CrossmintAuth } from "@crossmint/server-sdk";

export async function POST(req: NextRequest) {
  try {
    // 1) Read cookies and validate session with Crossmint
    const jar = await cookies();
    const jwt = jar.get("crossmint-jwt")?.value;
    const refreshToken = jar.get("crossmint-refresh-token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    if (!process.env.SERVER_CROSSMINT_API_KEY) {
      return NextResponse.json({ ok: false, error: "SERVER_CROSSMINT_API_KEY not set" }, { status: 500 });
    }

    const crossmint = createCrossmint({ apiKey: process.env.SERVER_CROSSMINT_API_KEY });
    const crossmintAuth = CrossmintAuth.from(crossmint);

    const session = await crossmintAuth.getSession({ jwt, refreshToken });
    const userId = session.userId;
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Invalid session" }, { status: 401 });
    }

    const profile = await crossmintAuth.getUser(userId);

    if (!profile.email) {
      return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
    }

    // 3) Upsert user by crossmintUserId and update email
    const user = await prisma.user.upsert({
      where: { crossmintUserId: userId },
      update: { email: profile.email, updatedAt: new Date() },
      create: { crossmintUserId: userId, email: profile.email },
      select: { id: true, email: true, publicKey: true, walletContractId: true },
    });

    // 4) Build response and refresh cookies if tokens rotated
    const res = NextResponse.json({ ok: true, user });
    const cookieOptions = { path: "/", httpOnly: true, sameSite: "lax" as const };
    if ((session as any).jwt) res.cookies.set("crossmint-jwt", (session as any).jwt, cookieOptions);
    if ((session as any).refreshToken) res.cookies.set("crossmint-refresh-token", (session as any).refreshToken, cookieOptions);

    return res;
  } catch (err) {
    console.error("/api/auth/sync error", err);
    return NextResponse.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}

