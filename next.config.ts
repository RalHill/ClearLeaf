import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // sharp is installed as peer dependency - Next.js 16.1 uses it automatically
    formats: ["image/avif", "image/webp"],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "X-UA-Compatible",
          value: "IE=edge",
        },
      ],
    },
  ],
  typescript: {
    // Strict type checking
    tsconfigPath: "./tsconfig.json",
  },
};

export default nextConfig;
