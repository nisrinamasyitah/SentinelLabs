import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET env var is required");
}
const JWT_SECRET: string = process.env.JWT_SECRET;

export const SESSION_COOKIE = "sentinel_session";
const SESSION_TTL = "7d";

export function signSession(clientId: string): string {
  return jwt.sign({ clientId }, JWT_SECRET, { expiresIn: SESSION_TTL });
}

export function verifySession(token: string): { clientId: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { clientId: string };
    return payload;
  } catch {
    return null;
  }
}
