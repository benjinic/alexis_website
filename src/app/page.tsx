'use client'; // <--- 1. 轉為客戶端組件以支援互動

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, X } from 'lucide-react'; 
// 注意：請確保您有安裝 ChatInterface，路徑依您的檔案結構而定
import ChatInterface from '@/components/ChatInterface'; 

export default function Home() {
  // 2. 控制聊天室顯示/隱藏的狀態
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <main className="relative h-[calc(100vh-4rem)] md:h-screen w-full overflow-hidden bg-deep-noir flex flex-col justify-center items-center">
      
      {/* ==========================================
          1. 背景影音層 (保持不變)
         ========================================== */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover grayscale contrast-[1.15] brightness-75"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          <img 
             src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2600&auto=format&fit=crop" 
             alt="Tailor working in dark room"
             className="h-full w-full object-cover grayscale contrast-125 brightness-50"
          />
        </video>
      </div>

      {/* ==========================================
          2. 核心內容層 (保持不變)
         ========================================== */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto space-y-8 animate-in fade-in duration-1000 zoom-in-95">
        
        <h1 className="font-playfair font-bold text-5xl md:text-7xl lg:text-9xl tracking-tight text-white drop-shadow-2xl leading-[0.9]">
          <span className="block mb-2 md:mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
            MUSIC.
          </span>
          <span className="block mb-2 md:mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
            REBELLION.
          </span>
          <span className="block text-champagne-gold">
            TAILORING.
          </span>
        </h1>

        <p className="font-mono text-concrete-grey text-xs md:text-sm lg:text-base uppercase tracking-[0.3em] max-w-lg mx-auto border-t border-white/20 pt-6 mt-6">
          Sartorial armor for the concrete jungle
        </p>

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-md mt-12">
          <Button 
            asChild 
            size="lg" 
            className="group relative bg-champagne-gold text-deep-noir hover:bg-white hover:text-deep-noir border-0 rounded-none h-14 px-8 text-base tracking-widest font-bold transition-all duration-500 overflow-hidden"
          >
            <Link href="/blueprint" className="flex items-center justify-center gap-2">
              <span className="relative z-10">ENTER BLUEPRINT</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 h-full w-full scale-0 rounded-none transition-all duration-300 group-hover:scale-100 group-hover:bg-white/20" />
            </Link>
          </Button>

          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white hover:text-white rounded-none h-14 px-8 text-base tracking-widest font-mono transition-all duration-300 backdrop-blur-sm"
          >
            <Link href="/booking">
              SUMMON TAILOR
            </Link>
          </Button>
        </div>
      </div>

      {/* ==========================================
          3. AI Style Advisor 懸浮視窗 (新增部分)
         ========================================== */}
      
      {/* 3.1 懸浮按鈕 (當聊天室關閉時顯示) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-4 bg-champagne-gold text-deep-noir font-bold tracking-widest shadow-2xl hover:scale-105 transition-transform duration-300 animate-in slide-in-from-bottom-10"
        >
          <MessageSquare className="w-5 h-5" />
          <span>AI STYLIST</span>
        </button>
      )}

      {/* 3.2 聊天室容器 (當聊天室開啟時顯示) */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 w-[90vw] md:w-[400px] h-[500px] md:h-[600px] bg-white shadow-2xl rounded-lg overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 flex flex-col border border-white/20">
          
          {/* 標題列 + 關閉按鈕 */}
          <div className="flex justify-between items-center p-4 bg-deep-noir text-white border-b border-gray-800">
            <h3 className="font-playfair text-lg tracking-wider text-champagne-gold">Alexis AI Advisor</h3>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 引入 ChatInterface 元件 (這裡就是您上次寫的包含 Loading 的元件) */}
          <div className="flex-1 bg-gray-50 overflow-hidden">
             <ChatInterface />
          </div>
        </div>
      )}

      {/* 底部裝飾 (保持不變) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden md:block">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-concrete-grey to-transparent" />
      </div>
    </main>
  );
} 