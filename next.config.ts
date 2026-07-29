import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Tree-shakes large icon/utility libraries so only used exports are bundled,
  // per 25_PERFORMANCE_OPTIMIZATION.md ("Tree Shaking", "Bundle Splitting").
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "date-fns"],
  },
};

export default nextConfig;
