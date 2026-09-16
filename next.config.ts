import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The root layout lives under [locale], so unknown URLs need app/global-not-found.tsx for a branded 404.
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
