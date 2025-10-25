import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vff1aakf0a.ufs.sh",
        port: "",
        pathname: "/**",
      },
    ],
  },
  transpilePackages: ["@react-pdf/renderer"],
  // PPR disabled due to auth headers conflicts
  // cacheComponents: true,
  // Skip proxy URL normalization (was skipMiddlewareUrlNormalize)
  skipProxyUrlNormalize: true,
  // Turbopack configuration for Next.js 16
  turbopack: {
    // Turbopack handles ESM packages automatically
  },
  // Temporarily ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
