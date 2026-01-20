import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000',
    NEXT_PUBLIC_API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000',
  },
};

export default nextConfig;
