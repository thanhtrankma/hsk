// Uses the Web Crypto API (not `node:crypto`) so this works both in
// middleware.ts (Edge runtime by default) and in server actions (Node
// runtime) without needing to force a runtime either way.

export const ADMIN_COOKIE = "hb_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h

const encoder = new TextEncoder();

function bytesToHex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET is not set");
  return s;
}

async function sign(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bytesToHex(sig);
}

/** Roughly constant-time string compare (no node:crypto.timingSafeEqual on Edge). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Builds the signed cookie value for a freshly authenticated admin session. */
export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${expires}`;
  return `${payload}.${await sign(payload)}`;
}

/** Verifies a cookie value: correct signature and not expired. */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expiresStr, sig] = parts;
  const payload = `${role}.${expiresStr}`;
  const expected = await sign(payload);
  if (!safeEqual(sig, expected)) return false;

  const expires = Number(expiresStr);
  return role === "admin" && Number.isFinite(expires) && Date.now() < expires;
}

export function checkPassword(candidate: string): boolean {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  return safeEqual(candidate, real);
}
