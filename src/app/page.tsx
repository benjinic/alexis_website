'use client'; 

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import AiAdvisorClient from '@/app/ai-advisor/ai-advisor-client'; 

export default function Home() {
  // 追蹤目前懸停的索引
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const menuItems = [
    { label: 'CATALOG', href: '/catalog' },
    { label: 'PROCESS', href: '/process' },
    { label: 'COLLECTION', href: '/collection' },
    { label: 'AI ADVISOR', href: '/visual-intelligence' },
    { label: 'BOOK NOW', href: '/booking' },
  ];

  // 鄰近感應樣式邏輯
  const getStyle = (index: number) => {
    if (hoveredIndex === null) return "text-[#ffffff] tracking-[0.2em]";
    
    if (hoveredIndex === index) {
      // 當前懸停項目：純白高亮
      return "text-white scale-110 tracking-[0.5em] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]";
    } 

    // 上層鄰居 (Upper Neighbor)：深紫色
    if (hoveredIndex === index + 1) {
      return "text-red-900 tracking-[0.3em] opacity-100";
    }

    // 下層鄰居 (Lower Neighbor)：深紅色
    if (hoveredIndex === index - 1) {
      return "text-[#4A1D63] tracking-[0.3em] opacity-80";
    }

    // 其他遠處項目：大幅度淡化
    return "text-stone-900 opacity-20 tracking-[0.2em] scale-95";
  };

  return (
    /* 🔴 關鍵修改：將底色改為 bg-carbon-black (#1a1a1a) */
    <main className="relative min-h-screen w-full overflow-hidden bg-carbon-black flex flex-col">

      {/* 🔴 已隱藏：背景裝飾微光 
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#261132]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/10 blur-[120px] rounded-full" />
      </div>
      */}

      {/* 中央垂直導覽選單 */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-1000">

        {/* 🔴 修改後：使用 Roboto Condensed Medium 500 */}
        <div className="mb-17 text-center">
          <h2 className="font-condensed font-medium text-4xl tracking-[0.1em] text-white uppercase">
            ALEXIS BESPOKE
          </h2>
          {/* 保持下方的深紅裝飾線 */}
          <div className="mt-2 h-[1px] w-72 bg-red-900/40 mx-auto" />
        </div>

        {menuItems.map((item, index) => (
          <Link 
            key={item.href} 
            href={item.href}
            className="block py-2 transition-all duration-500"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span className={`
              font-roboto-condensed text-2xl font-bold uppercase block text-center
              transition-all duration-500 ease-out transform
              ${getStyle(index)}
            `}>
              {item.label}
            </span>
          </Link>
        ))}
    
        {/* SUMMON TAILOR 觸發按鈕 */}
        <Dialog>
          <DialogTrigger asChild>
            <button 
              className="group block mt-8 transition-all duration-500"
              onMouseEnter={() => setHoveredIndex(menuItems.length)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className={`
                font-roboto-condensed text-2xl font-bold uppercase block text-center
                transition-all duration-500 ease-out transform
                ${hoveredIndex === menuItems.length 
                  ? "text-red-500 scale-110 tracking-[0.5em] drop-shadow-[0_0_25px_rgba(239,68,68,0.6)]" 
                  : hoveredIndex === menuItems.length - 1 
                    ? "text-[#D90229] tracking-[0.3em]" 
                    : "text-[#D90229] opacity-30"}
              `}>
                SUMMON TAILOR
              </span>
            </button>
          </DialogTrigger>
          
          <DialogContent className="bg-stone-950 border-stone-800 text-stone-50 sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-amber-600 font-serif text-2xl text-center">Protocol Interface</DialogTitle>
            </DialogHeader>
            <AiAdvisorClient />
          </DialogContent>
        </Dialog>

      </div>

      {/* 右下角品牌標題 */}
      <div className={`absolute bottom-8 right-8 z-20 text-right transition-opacity duration-700 ${hoveredIndex !== null ? 'opacity-30' : 'opacity-80'}`}>
        <h1 className="font-playfair font-bold text-xl md:text-2xl tracking-tight text-white leading-none">
          <span className="block mb-1">MUSIC.</span>
          <span className="block mb-1">REBELLION.</span>
          <span className="block text-red-900">TAILORING.</span>
        </h1>
        <p className="hidden md:block font-mono text-stone-600 text-[10px] tracking-[0.3em] mt-4 border-t border-white/10 pt-2">
          EST. 2025 / HONG KONG
        </p>
      </div>

    </main>
  );
}