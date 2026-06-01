import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  allowedDevOrigins: [
    "6aea-2a05-45c2-1043-7f00-fd58-3d20-c6dd-5c0f.ngrok-free.app",
    "huff-nape-expiring.ngrok-free.dev",
  ],
};

export default withNextIntl(nextConfig);
