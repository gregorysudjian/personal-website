import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // 90 is for app screenshots, where small text blurs at the default 75
    qualities: [75, 90],
  },
};

export default nextConfig;
