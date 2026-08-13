import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn-proxy.globalcontentcloud.com" },
      { protocol: "https", hostname: "cdn.globalcontentcloud.com" },
      { protocol: "https", hostname: "photoku.io" },
      { protocol: "https", hostname: "imgku.io" }
    ]
  }
};

export default nextConfig;
