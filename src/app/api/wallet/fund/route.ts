import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = (await req.json()) as { userId: string };
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.publicKey) return NextResponse.json({ error: "user or publicKey not found" }, { status: 404 });

    const url = new URL("https://friendbot.stellar.org");
    url.searchParams.set("addr", user.publicKey);
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "friendbot failed", detail: text }, { status: 502 });
    }
    await prisma.user.update({ where: { id: userId }, data: { accountStatus: "funded" } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/wallet/fund error", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
