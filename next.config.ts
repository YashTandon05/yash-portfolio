import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    // Defaults to bottom-left, which is exactly where the skill-filter pill sits.
    // Dev-only overlap, but you'd hit it every time you tested the filter.
    position: "top-left",
  },
};

export default nextConfig;
