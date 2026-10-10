import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Projects live in the homepage carousel; old archive and detail URLs land there.
  async redirects() {
    return [
      { source: "/projects", destination: "/#projects", permanent: true },
      { source: "/projects/:slug*", destination: "/#projects", permanent: true },
    ];
  },
};

export default nextConfig;
