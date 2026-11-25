// Single-user auth. The browser logs in with DRAW_PASSWORD and gets a signed
// session cookie; agents send DRAW_MCP_TOKEN as a bearer token; the headless
// renderer gets a short-lived signed token for one board.
export const SESSION_COOKIE = "draw_session";
const SESSION_DAYS = 30;

const enc = new TextEncoder();

function secret() {
  const s = process.env.DRAW_SESSION_SECRET;
  if (!s) {
    if (process.env.VERCEL) throw new Error("DRAW_SESSION_SECRET is not set");
    return "dev-session-secret";
  }
  return s;
}

async function hmac(data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
  return btoa(String.fromCharCode(...sig)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function signed(payload: string) {
  return `${payload}.${await hmac(payload)}`;
}

async function verifySigned(token: string | undefined, prefix: string) {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  if (!payload.startsWith(prefix + ":")) return null;
  if (!safeEqual(await hmac(payload), token.slice(dot + 1))) return null;
  const parts = payload.split(":");
  const expires = Number(parts.at(-1));
  if (!Number.isFinite(expires) || expires < Date.now()) return null;
  return parts;
}

export async function createSession() {
  const expires = Date.now() + SESSION_DAYS * 24 * 3600 * 1000;
  return { value: await signed(`session:${expires}`), expires: new Date(expires) };
}

export async function verifySession(cookie: string | undefined) {
  return (await verifySigned(cookie, "session")) !== null;
}

export function checkPassword(input: string) {
  const expected = process.env.DRAW_PASSWORD ?? (process.env.VERCEL ? undefined : "dev");
  return !!expected && safeEqual(input, expected);
}

export function verifyMcpToken(token: string | undefined) {
  const expected = process.env.DRAW_MCP_TOKEN ?? (process.env.VERCEL ? undefined : "dev-mcp-token");
  return !!token && !!expected && safeEqual(token, expected);
}

/** A token that lets the headless renderer read one board for two minutes. */
export async function createRenderToken(boardId: string) {
  return signed(`render:${boardId}:${Date.now() + 120_000}`);
}

export async function verifyRenderToken(token: string | undefined, boardId: string) {
  const parts = await verifySigned(token, "render");
  return !!parts && parts[1] === boardId;
}

function cookieFrom(req: Request) {
  const header = req.headers.get("cookie") ?? "";
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf("=");
    if (eq > 0 && part.slice(0, eq) === SESSION_COOKIE) return decodeURIComponent(part.slice(eq + 1));
  }
  return undefined;
}

export function bearerFrom(req: Request) {
  const h = req.headers.get("authorization");
  return h?.toLowerCase().startsWith("bearer ") ? h.slice(7).trim() : undefined;
}

/** True if the request carries a valid session cookie or the agent token. */
export async function isAuthorized(req: Request) {
  return verifyMcpToken(bearerFrom(req)) || (await verifySession(cookieFrom(req)));
}

export function unauthorized() {
  return Response.json({ error: "unauthorized" }, { status: 401 });
}
