// next.config.ts - Enhanced with performance optimizations

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // Security headers
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
        {
          key: "Content-Security-Policy",
          value:
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'",
        },
      ],
    },
  ],

  // Redirects for old routes
  redirects: async () => [
    {
      source: "/old-path",
      destination: "/new-path",
      permanent: true,
    },
  ],

  // Rewrites for API routes
  rewrites: async () => ({
    beforeFiles: [],
    afterFiles: [],
  }),

  // TypeScript configuration
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },

  // Webpack configuration for bundle optimization
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        // Vendor libraries
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 10,
          reuseExistingChunk: true,
        },
        // Common code
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      };
    }

    return config;
  },

  // Experimental features (use with caution)
  experimental: {
    // Enable partial pre-rendering for better performance
    ppr: false, // Set to true after testing
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  // Trailing slashes
  trailingSlash: false,

  // Skip trailing slash redirect
  skipTrailingSlashRedirect: false,

  // Internationalization (if needed later)
  i18n: undefined, // Not using i18n at MVP

  // Output format
  output: "standalone",

  // Memory optimization
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
