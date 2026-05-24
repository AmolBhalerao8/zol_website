import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY_SALT = "zol-integration-credentials";

function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY?.trim();

  if (!secret) {
    throw new Error("ENCRYPTION_KEY is not configured");
  }

  return scryptSync(secret, KEY_SALT, 32);
}

export function hasEncryptionConfigured(): boolean {
  return Boolean(process.env.ENCRYPTION_KEY?.trim());
}

export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

export function decrypt(payload: string): string {
  const key = getEncryptionKey();
  const [ivBase64, authTagBase64, encryptedBase64] = payload.split(":");

  if (!ivBase64 || !authTagBase64 || !encryptedBase64) {
    throw new Error("Invalid encrypted payload format");
  }

  const iv = Buffer.from(ivBase64, "base64");
  const authTag = Buffer.from(authTagBase64, "base64");
  const encrypted = Buffer.from(encryptedBase64, "base64");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
