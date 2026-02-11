import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ 1. 開啟 Standalone 模式 (這是解決檔案過大、部署失敗的關鍵！)
  output: "standalone",

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // 保持您原本的設定
    },
  },

  // // 啟用圖片優化設定，授權外部網域 // //
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      // // 🔴 新增此段：允許從 Firebase Storage 載入圖片 // //
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '**',
      },
    ],
  },
  // // 如果有其他現有的設定請保留在此下方 // //

  // ✅ 2. Webpack 設定 (這是解決 "Module not found: fs, net" 錯誤的關鍵)
  // 這能確保 Genkit 等後端套件不會被誤打包到瀏覽器端
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        process: false,
      };
    }
    return config;
  },
};

export default nextConfig;