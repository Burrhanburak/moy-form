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
  // Turbopack configuration for Next.js 16
  turbopack: {
    // Turbopack handles ESM packages automatically
  },
};

export default nextConfig;
