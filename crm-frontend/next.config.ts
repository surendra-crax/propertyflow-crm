import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "s3.amazonaws.com" },
      { protocol: "https", hostname: "*.s3.amazonaws.com" },
      { protocol: "https", hostname: "*.s3.ap-south-1.amazonaws.com" },
    ],
  },

  // Improve cold-start performance on Render/Vercel
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "@radix-ui/react-dialog"],
  },

  // Compress responses
  compress: true,

  // Strict mode helps catch bugs early
  reactStrictMode: true,
}

export default nextConfig
