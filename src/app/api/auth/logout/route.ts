import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const jar = await cookies();
  try {
    jar.delete("crossmint-jwt");
    jar.delete("crossmint-refresh-token");
  } catch {}
  return NextResponse.json({ ok: true });
}