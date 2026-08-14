import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      { hostname: "aot-portal.com", protocol: "https" },
      { hostname: "haikyu.jp", protocol: "https" },
      { hostname: "i.ytimg.com", protocol: "https" },
      { hostname: "naruto-official.com", protocol: "https" },
      { hostname: "one-piece.com", protocol: "https" },
      { hostname: "publish.realmadrid.com", protocol: "https" },
      { hostname: "widgets.availproject.org", protocol: "https" },
      { hostname: "www.availproject.org", protocol: "https" },
      { hostname: "www.shieldtx.xyz", protocol: "https" },
      { hostname: "yanisuu.com", protocol: "https" },
    ],
  },
};

export default nextConfig;
