import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  experimental: {
    allowedDevOrigins: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://192.168.1.33:3000",
      "http://192.168.1.33:3001",
    ],
  },
};

export default nextConfig;