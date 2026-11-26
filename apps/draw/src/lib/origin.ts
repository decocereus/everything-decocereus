const TRAILING_SLASH_RE = /\/$/;

/** The public URL of the app, used in links handed to agents and by the renderer. */
export function appOrigin() {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(TRAILING_SLASH_RE, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
