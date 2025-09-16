import crypto from "crypto";

// ENCRYPTION_KEY deve ser uma chave de 32 bytes em base64 (AES-256-GCM)
function getKey() {
  const b64 = process.env.ENCRYPTION_KEY;
  if (!b64) return null;
  const buf = Buffer.from(b64, "base64");
  if (buf.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes base64 (AES-256)");
  }
  return buf;
}

export function encryptToCiphertext(plainText: string): string {
  const key = getKey();
  if (!key) throw new Error("ENCRYPTION_KEY not set");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // Formato: base64(iv).base64(tag).base64(ciphertext)
  return `${iv.toString("base64")}.${tag.toString("base64")}.${enc.toString("base64")}`;
}

export function decryptCiphertext(ciphertext: string): string {
  const key = getKey();
  if (!key) throw new Error("ENCRYPTION_KEY not set");
  const [ivB64, tagB64, dataB64] = ciphertext.split(".");
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const data = Buffer.from(dataB64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return dec.toString("utf8");
}
