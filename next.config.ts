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
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Handle ESM packages
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
      },
    };

    return config;
  },
  transpilePackages: ["@react-pdf/renderer"],
};

export default nextConfig;
