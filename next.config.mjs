/** @type {import('next').NextConfig} */
const nextConfig = {
  // permite gerar um build de teste numa pasta separada sem afetar o "npm run dev"
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
