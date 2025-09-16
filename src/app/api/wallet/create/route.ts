import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createStellarKeypair } from "@/lib/stellar";
import { encryptToCiphertext } from "@/lib/crypto";

export async function POST(req: NextRequest) {
  try {
    const { userId, storeSecret = false } = (await req.json()) as {
      userId: string;
      storeSecret?: boolean;
    };
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "user not found" }, { status: 404 });

    const { publicKey, secret } = createStellarKeypair();

    const data: Record<string, any> = {
      publicKey,
      accountStatus: "created",
    };
    if (storeSecret) {
      try {
        data.secretKeyCiphertext = encryptToCiphertext(secret);
      } catch (e) {
        return NextResponse.json({ error: "ENCRYPTION_KEY invalid or missing" }, { status: 500 });
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
      }
    });
    return NextResponse.json({ publicKey, storedSecret: !!data.secretKeyCiphertext, user: updated });
  } catch (err) {
    console.error("/api/wallet/create error", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
