'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FullScreenMenu } from './full-screen-menu';
import { ShoppingBag } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // // 監聽捲動：控制 Header 背景與高度的過渡效果 // //
  useEffect(() => {
    const handleScroll = () => {
      // 當向下捲動超過 50 像素時觸發狀態切換
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // // 邏輯判斷：首頁通常有獨自的沈浸式設計，此處設定首頁不顯示此標準 Header // //
  if (pathname === '/') return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${
        isScrolled
          ? 'bg-stone-950/90 backdrop-blur-md border-stone-800 py-3' 
          : 'bg-transparent border-transparent py-6'
      }`} // 透過 isScrolled 動態切換背景與邊框顏色
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between relative">
        
        {/* // 左側區域：漢堡選單 (FullScreenMenu) // */}
        <div className="flex-1 flex justify-start">
          <FullScreenMenu />
        </div>

        {/* // 中間區域：絕對定位的 Logo，確保在任何寬度下皆完美居中 // */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-space_mono font-bold text-xl md:text-2xl tracking-tighter text-white">
              ALEXIS
            </span>
            {/* // 🔴 關鍵修改：將原本紫色文字統一改為白色以符合 Noir 風格 // */}
            <span className="text-[10px] md:text-xs font-mono font-normal tracking-[0.3em] text-white mt-1 transition-colors">
              BESPOKE
            </span>
          </Link>
        </div>

        {/* // 右側區域：功能按鈕 (預約與購物車) // */}
        <div className="flex-1 flex items-center justify-end gap-4">
          <Link href="/cart" className="text-white hover:text-stone-400 transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </Link>
          <Link href="/booking" className="hidden sm:block">
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-stone-950 font-mono tracking-widest text-[10px] h-8 px-4 transition-all"
            >
              BOOK NOW
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}