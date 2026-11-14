import type { NextConfig } from "next";

// Public site is a static export, synced to S3 and served by CloudFront.
// `/_next` on the shared hostname belongs to the CMS. Site assets are requested from `/_site`.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  assetPrefix: "/_site",
  images: { unoptimized: true },
};

export default nextConfig;
