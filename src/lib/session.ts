import "server-only";

export const SESSION_COOKIE_NAME = "tva_session";

/** Short session: browser-session cookie (cleared on browser close). */
export const SESSION_MAX_AGE_DEFAULT_SECONDS = 60 * 60 * 8; // 8 hours
/** "Remember me" session per 12_AUTHENTICATION.md. */
export const SESSION_MAX_AGE_REMEMBER_SECONDS = 60 * 60 * 24 * 30; // 30 days

interface SessionPayload {
  readonly username: string;
  readonly issuedAt: number;
  readonly expiresAt: number;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const keyData = new TextEncoder().encode(secret);
  return crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

/** Creates a signed, tamper-evident session token: base64url(payload).base64url(signature) */
export async function createSessionToken(
  username: string,
  secret: string,
  maxAgeSeconds: number
): Promise<string> {
  const now = Date.now();
  const payload: SessionPayload = {
    username,
    issuedAt: now,
    expiresAt: now + maxAgeSeconds * 1000,
  };
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, payloadBytes);

  return `${base64UrlEncode(payloadBytes)}.${base64UrlEncode(new Uint8Array(signature))}`;
}

/** Verifies signature and expiry. Returns the payload if valid, otherwise null. Never throws. */
export async function verifySessionToken(
  token: string,
  secret: string
): Promise<SessionPayload | null> {
  try {
    const [payloadPart, signaturePart] = token.split(".");
    if (!payloadPart || !signaturePart) return null;

    const payloadBytes = base64UrlDecode(payloadPart);
    const signatureBytes = base64UrlDecode(signaturePart);
    const key = await getHmacKey(secret);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as BufferSource,
      payloadBytes as BufferSource
    );
    if (!isValid) return null;

    const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as SessionPayload;
    if (payload.expiresAt < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}
