'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'CATALOG', href: '/catalog' },
  { label: 'PROCESS', href: '/process' },
  { label: 'COLLECTION', href: '/collection' },
  { label: 'AI ADVISOR', href: '/visual-intelligence' },
  { label: 'BOOK NOW', href: '/booking' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 鄰近感應邏輯
  const getStyle = (index: number) => {
    if (hoveredIndex === null) {
      // 初始狀態：深灰色
      return "text-stone-600 tracking-[0.2em]";
    }
    
    if (hoveredIndex === index) {
      // 懸停項目：純白、放大
      return "text-white scale-110 tracking-[0.4em] translate-x-2";
    } 
    
    if (hoveredIndex === index + 1) {
      // 上層鄰居：Midnight Violet (#261132)
      return "text-[#261132] tracking-[0.3em] opacity-100";
    }

    if (hoveredIndex === index - 1) {
      // 下層鄰居：深紅色 (Red 900)
      return "text-red-900 tracking-[0.3em] opacity-80";
    }

    // 非鄰近項目：淡化
    return "text-stone-900 opacity-20 scale-95";
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1a1a1a] border-r border-white/5 z-50 flex flex-col p-8 transition-all duration-500">
      
      {/* 頂部品牌標題 - 使用 Space Mono */}
      <div className="mb-20">
        <Link href="/">
          <h2 className="font-space font-bold text-xl tracking-tighter text-white uppercase">
            Alexis <br />
            <span className="text-[10px] text-stone-600 font-mono tracking-[0.3em]">
              // ATELIER_V1
            </span>
          </h2>
        </Link>
      </div>

      {/* 導航選單 */}
      <nav className="flex-1 flex flex-col space-y-8">
        {navItems.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative block"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* 當前頁面指示條 */}
            {pathname === item.href && (
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-6 bg-red-900" />
            )}

            <span className={`
              font-condensed text-xl font-bold uppercase block transition-all duration-500 ease-out
              ${getStyle(index)}
            `}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* 底部裝飾資訊 */}
      <div className="mt-auto border-t border-white/10 pt-6">
        <div className="font-mono text-[9px] text-stone-700 tracking-[0.2em] space-y-1">
          <p>STATUS: OPERATIONAL</p>
          <p>CODE: REBELLION_S25</p>
        </div>
      </div>
    </aside>
  );
}