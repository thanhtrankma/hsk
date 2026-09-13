import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" output is for the self-hosted Docker deployment
  // (docker-compose.yml / Dockerfile) -- it conflicts with how Vercel
  // packages routes into serverless functions, so skip it there. Vercel
  // sets its own VERCEL env var during builds.
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;
