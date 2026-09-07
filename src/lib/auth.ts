export const ADMIN_COOKIE_NAME = "ayman_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const DEFAULT_SECRET = "ayman_store_ultra_secure_secret_key_2026_luxury_ecommerce";

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

export async function createAdminToken(username: string): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET || DEFAULT_SECRET;
  const timestamp = Date.now().toString();
  const dataToSign = `${username}:${timestamp}`;

  const key = await getCryptoKey(secret);
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(dataToSign));
  const signatureHex = bufferToHex(signatureBuffer);

  // Payload format: base64(username:timestamp):signatureHex
  const payload = btoa(dataToSign);
  return `${payload}.${signatureHex}`;
}

export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token || !token.includes(".")) return false;

  try {
    const [payloadB64, signatureHex] = token.split(".");
    if (!payloadB64 || !signatureHex) return false;

    const dataToSign = atob(payloadB64);
    const [username, timestampStr] = dataToSign.split(":");
    if (!username || !timestampStr) return false;

    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return false;

    // Check expiration (7 days)
    const now = Date.now();
    if (now - timestamp > SESSION_MAX_AGE_SECONDS * 1000) {
      return false; // Expired
    }

    const secret = process.env.ADMIN_SESSION_SECRET || DEFAULT_SECRET;
    const key = await getCryptoKey(secret);
    const enc = new TextEncoder();
    const signatureBuffer = hexToBuffer(signatureHex);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      enc.encode(dataToSign)
    );

    return isValid;
  } catch {
    return false;
  }
}
