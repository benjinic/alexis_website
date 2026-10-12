/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  serverExternalPackages: ['import-in-the-middle', 'require-in-the-middle', '@genkit-ai/vertexai', 'genkit'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
      // 🔴 加入信任名單，允許從 Firebase 網址發送資料給伺服器
      allowedOrigins: ['alexis-bespoke.web.app', 'localhost:3000'],
    },
  },
};

export default nextConfig;