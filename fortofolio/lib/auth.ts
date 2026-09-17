import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Sistem login sederhana tanpa database:
 * - Kredensial dari env: AUTH_USERNAME & AUTH_PASSWORD (fallback admin/admin).
 * - Password disimpan sebagai hash scrypt di env (opsional), atau dibandingkan
 *   langsung untuk penggunaan personal.
 * - Session = cookie httpOnly bertanda tangan HMAC-SHA256 + timestamp kedaluwarsa.
 */

const SESSION_COOKIE = "forto_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari

// Kunci cadangan hanya untuk development. AUTH_SECRET tetap harus diset
// agar session tidak memakai kunci publik yang sama di deployment.
const FALLBACK_SECRET = "fortofolio-development-secret-change-me";

export function getCredentials() {
  return {
    username: process.env.AUTH_USERNAME || "123",
    password: process.env.AUTH_PASSWORD || "123",
  };
}

/* ── Password hashing (scrypt) ─────────────────────────────── */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [scheme, salt, hash] = stored.split(":");
    if (scheme !== "scrypt" || !salt || !hash) return false;
    const candidate = scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, "hex");
    return candidate.length === expected.length && timingSafeEqual(candidate, expected);
  } catch {
    return false;
  }
}

/* ── Session cookie bertanda tangan ────────────────────────── */

function getSecret(): string {
  // PENTING: fallback harus stabil per proses. Kalau dibuat acak setiap
  // dipanggil, tanda tangan cookie tidak akan pernah cocok saat diverifikasi
  // dan login selalu gagal. Set AUTH_SECRET di .env.local untuk produksi.
  return process.env.AUTH_SECRET || FALLBACK_SECRET;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function createSessionValue(username: string): string {
  const payload = `${username}:${Date.now() + SESSION_TTL_MS}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

function parseSessionValue(value: string): string | null {
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;
  let payload: string;
  try {
    payload = Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const idx = payload.lastIndexOf(":");
  if (idx === -1) return null;
  const username = payload.slice(0, idx);
  const expiry = Number(payload.slice(idx + 1));
  if (!Number.isFinite(expiry) || Date.now() > expiry) return null;
  return username;
}

export async function createSession(username: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionValue(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Mengembalikan username bila session valid, atau null. */
export async function getSessionUser(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  return parseSessionValue(value);
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSessionUser()) !== null;
}
