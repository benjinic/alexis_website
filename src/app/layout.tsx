import type { Metadata } from "next";
import { Inter, Roboto_Condensed, Space_Mono } from "next/font/google";
import "./globals.css";
// // 引入統一後的 Header 組件 // //
import Header from "@/components/layout/header";

// // 設定品牌專用的字體 // //
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const robotoCondensed = Roboto_Condensed({ 
  subsets: ["latin"], 
  weight: ['400', '700'],
  variable: "--font-roboto-condensed" 
});
const spaceMono = Space_Mono({ 
  subsets: ["latin"], 
  weight: ['400', '700'],
  variable: "--font-space-mono" 
});

export const metadata: Metadata = {
  title: "ALEXIS BESPOKE | Visual Archive",
  description: "Digital Protocol for Modern Bespoke Tailoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${robotoCondensed.variable} ${spaceMono.variable} antialiased bg-stone-950 text-stone-50`}
      >
        {/* // --- 全站統一 Header --- // */}
        {/* // 此組件已包含滾動變色邏輯與置中 Logo // */}
        <Header />

        {/* // --- 主要內容區塊 --- // */}
        {/* // 使用 min-h-screen 確保背景顏色填滿整個螢幕 // */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* // 這裡可以放置全站統一的 Toaster 或 Footer (選配) // */}
      </body>
    </html>
  );
}