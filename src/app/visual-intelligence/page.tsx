'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// 請確保這個路徑下真的有這個組件，若還沒寫，稍後我們需要建立它
import LookDecoderModal from '@/components/catalog/look-decoder-modal'; 
import { ArrowLeft, Lock } from 'lucide-react';

export default function VisualIntelligencePage() {
  return (
    <div className="min-h-screen bg-deep-noir text-stone-50 flex flex-col relative overflow-hidden">
      
      {/* --- 背景特效層 (延續首頁風格) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        {/* 右上角紫色光暈 */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-midnight-violet/20 blur-[120px] rounded-full" />
      </div>

      {/* --- 頂部導覽 --- */}
      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-sm">
        <Link href="/">
          <Button variant="ghost" className="text-stone-400 hover:text-white hover:bg-white/5 font-mono tracking-wider">
            <ArrowLeft className="mr-2 h-4 w-4" /> BACK TO BASE
          </Button>
        </Link>
        <h1 className="font-condensed font-bold text-xl tracking-[0.3em] text-autumn-ember uppercase">
          A.I. Protocol
        </h1>
      </header>

      {/* --- 主要內容 --- */}
      <main className="relative z-10 flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        
        {/* 功能入口區塊 */}
        <section className="mb-20 text-center space-y-8 max-w-4xl">
          <div className="space-y-2">
            <p className="font-mono text-xs text-midnight-violet tracking-widest uppercase mb-4 animate-in fade-in slide-in-from-bottom-2">
              // Module: Visual Analysis
            </p>
            <h2 className="text-5xl md:text-7xl font-condensed font-bold text-white tracking-tight uppercase animate-in fade-in slide-in-from-bottom-4 duration-700">
              Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-stone-500">Intelligence</span>
            </h2>
          </div>

          <p className="font-geist text-stone-400 text-lg max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Before access to the Archives is granted, the algorithm must analyze your current sartorial state. 
            Upload a photo to receive a <span className="text-white font-bold">brutally honest assessment</span> and corrective protocols.
          </p>
          
          {/* 引入 Modal - 加上光暈特效強調它是核心功能 */}
          <div className="flex justify-center mt-12 animate-in zoom-in-95 duration-700 delay-200 relative">
             <div className="absolute inset-0 bg-autumn-ember/20 blur-xl rounded-full animate-pulse" />
             <div className="relative">
                <LookDecoderModal />
             </div>
          </div>
        </section>

        {/* --- 鎖定的目錄展示 (Locked Archive) --- */}
        <div className="w-full max-w-5xl">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] flex-1 bg-stone-800" />
                <span className="font-mono text-xs text-stone-600 tracking-[0.2em] flex items-center gap-2">
                    <Lock className="w-3 h-3" /> SECURE ARCHIVES DETECTED
                </span>
                <div className="h-[1px] flex-1 bg-stone-800" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40 pointer-events-none select-none">
                {/* 示意圖 Placeholder */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="group relative aspect-[3/4] bg-stone-900/50 border border-stone-800 flex flex-col items-center justify-center overflow-hidden">
                        {/* 這裡模擬一種數位雜訊的遮罩 */}
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] opacity-20" />
                        
                        <Lock className="w-8 h-8 text-stone-700 mb-4" />
                        <span className="font-condensed font-bold text-2xl text-stone-700 tracking-widest uppercase">
                            CLASSIFIED 0{i}
                        </span>
                        <p className="font-mono text-[10px] text-stone-700 mt-2">ACCESS DENIED</p>
                    </div>
                ))}
            </div>
            
            <p className="text-center font-mono text-autumn-ember/60 mt-8 text-xs tracking-widest animate-pulse">
                &gt; AWAITING BIOMETRIC SCAN INPUT...
            </p>
        </div>

      </main>
    </div>
  );
}