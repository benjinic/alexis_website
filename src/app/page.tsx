'use client'; 

import React, { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // 🎬 狀態：用來記錄影片是否已經播完
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  const menuItems = [
    { label: 'CATALOG', href: '/catalog' },
    { label: 'BESPOKE', href: '/bespoke' },
    { label: 'PROCESS', href: '/process' }, 
    { label: 'AI ADVISOR', href: '/visual-intelligence' },
    { label: 'BOOK NOW', href: '/booking' },
    { label: 'SUMMOR TAILOR', href: '/ai-advisor' }
  ];

  // 💎 極簡選單樣式邏輯
  const getStyle = (index: number) => {
    if (hoveredIndex === null) return "text-white tracking-[0.2em] transition-all duration-500 font-bold";
    if (hoveredIndex === index) return "text-lava-red scale-110 tracking-[0.5em] transition-all duration-500 font-bold drop-shadow-lg";
    if (hoveredIndex === index + 1 || hoveredIndex === index - 1) return "text-graphite/60 tracking-[0.1em] scale-100 transition-all duration-500";
    return "text-graphite/20 tracking-[0.2em] transition-all duration-500";
  };

  return (
    // 底層背景色設定為 bg-carbon-black，影片淡出後就會顯露這個顏色
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-carbon-black transition-colors duration-1000">
      
      {/* 🎬 滿版背景短片 */}
      <video
        autoPlay
        muted
        playsInline
        onEnded={() => setIsVideoEnded(true)}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity [transition-duration:2000ms] ease-in-out ${
          isVideoEnded ? 'opacity-0' : 'opacity-50'
        }`}
      >
        <source src="/videos/home-hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🛡️ 漸層遮罩：加入淡出效果，讓影片消失後背景純色更乾淨 */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b from-carbon-black/40 via-carbon-black/20 to-carbon-black/80 z-0 pointer-events-none transition-opacity [transition-duration:2000ms] ease-in-out ${
          isVideoEnded ? 'opacity-0' : 'opacity-100'
        }`} 
      />

      {/* 中間主視覺與導覽選單群組 */}
      <div className="relative z-10 flex flex-col items-center w-full px-4">
        
        {/* 👑 正中間品牌大標題 */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-condensed tracking-[0.2em] md:tracking-[0.01em] text-white drop-shadow-2xl mb-12 md:mb-16 text-center ml-[0.3em] md:ml-[0.4em]">
          ALEXIS BESPOKE
        </h1>

        {/* 🧭 置中主導覽選單 */}
        <nav className="flex flex-col items-center gap-4 md:gap-6">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={`font-condensed text-3xl md:text-4xl uppercase cursor-pointer ${getStyle(index)}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
      </div>

      {/* 🏷️ 右下角品牌標語 */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-10 text-right">
        <h1 className="text-3xl md:text-4xl font-black font-condensed tracking-tighter text-white drop-shadow-md">
          <span className="block mb-1">MUSIC.</span>
          <span className="block mb-1">REBELLION.</span>
          <span className="block text-lava-red drop-shadow-sm">TAILORING.</span>
        </h1>
        <p className="hidden md:block font-jetbrains text-stone-400 text-[10px] tracking-[0.3em] mt-4 border-t border-carbon-black/20 pt-2">
          EST. 2026 / HONG KONG
        </p>
      </div>

    </main>
  );
}