import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // 保留 Unsplash (如果有用到的話)
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // ✅ 新增這行：允許 Firebase 圖片
      },
    ],
  },
};

export default nextConfig;