import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "d2u1z1lopyfwlx.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
