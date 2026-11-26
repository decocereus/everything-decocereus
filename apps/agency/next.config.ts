import type { NextConfig } from "next";

const region = process.env.NEXT_PUBLIC_POSTHOG_REGION === "eu" ? "eu" : "us";

const nextConfig: NextConfig = {
  // PostHog goes through the site's own domain, so ad blockers don't drop it.
  rewrites: () =>
    Promise.resolve([
      {
        destination: `https://${region}-assets.i.posthog.com/static/:path*`,
        source: "/ingest/static/:path*",
      },
      {
        destination: `https://${region}.i.posthog.com/:path*`,
        source: "/ingest/:path*",
      },
    ]),
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
