import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@tiptap/react",
      "@tiptap/starter-kit",
    ],
  },
  compress: true,
  images: {
    unoptimized: false,
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;