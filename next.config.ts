import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Force cache busting on each build to prevent stale JavaScript
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
