import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  env: {
    SERVER_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
