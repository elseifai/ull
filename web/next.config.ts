import type { NextConfig } from "next";

// Public site is a static export, synced to S3 and served by CloudFront.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
