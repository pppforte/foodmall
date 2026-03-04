import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wandduk.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
