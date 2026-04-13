import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // GitHub Pages 部署在 /catsdogs/ 子路径下
  basePath: isGitHubPages ? "/catsdogs" : "",
  assetPrefix: isGitHubPages ? "/catsdogs/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
