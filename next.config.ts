import type { NextConfig } from "next";

/**
 * When building for GitHub Pages (GITHUB_PAGES=true, set by the deploy
 * workflow) we statically export to `out/` and serve under /portfolio.
 * Local dev and Vercel builds are unaffected — no basePath, server-capable.
 */
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? "/portfolio" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(isPages
    ? { output: "export", basePath, trailingSlash: true }
    : {}),
};

export default nextConfig;
