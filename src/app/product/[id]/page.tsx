'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Ruler, Scissors, Box, TerminalSquare } from 'lucide-react';

// ==========================================
// 模擬商品資料庫 (Mock Database)
// 未來可替換為從 API 或 Firebase 獲取資料
// ==========================================
const MOCK_PRODUCT = {
  id: 'p_001',
  title: 'The Signature Navy Suit',
  base_price: 850.00,
  description: '我們最具代表性的海軍藍西裝。採用義大利頂級 Super 110s 羊毛織造，具備出色的抗皺性與優雅的垂墜感。無論是商務會議或晚宴，都能展現絕對的專業與自信。',
  images: [
    'https://images.unsplash.com/photo-1594938298596-70f56fb3cecb?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1598808503746-f34c53b93f3e?auto=format&fit=crop&q=80&w=1200'
  ],
  specs: {
    mill: 'Vitale Barberis Canonico (VBC)',
    weight: '260g / 四季款',
    composition: '100% Merino Wool',
    origin: 'Woven in Italy',
  }
};

export default function ProductDetailPage({ params: _params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // 處理「啟動客製化」按鈕點擊
  const handleCustomize = () => {
    setIsInitializing(true);
    
    // 模擬終端機啟動的科技感延遲，然後導向您的 2D 視覺化引擎頁面
    setTimeout(() => {
      // 這裡導向您現有的 Configurator 頁面 (例如 /collection 或 /design/[id])
      // 實際專案中，您可以把商品 ID 當作參數傳過去：`/collection?fabric=${MOCK_PRODUCT.id}`
      router.push('/collection'); 
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-[#ef4444] selection:text-white">
      
      {/* 頂部導覽列 */}
      <nav className="fixed top-0 w-full flex items-center justify-between px-6 py-4 bg-[#050505]/80 backdrop-blur-md border-b border-zinc-900 z-40">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-[10px] uppercase tracking-widest"
        >
          <ChevronLeft size={14} />
          Return_To_Catalog
        </button>
        <div className="font-mono text-[10px] text-zinc-500 tracking-[0.3em] uppercase">
          SYS.PDP // {MOCK_PRODUCT.id}
        </div>
      </nav>

      {/* 主要內容區塊 */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* 左側：高畫質商品靜態展示區 (佔 7 欄) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 border border-zinc-800 rounded-sm">
            <img 
              src={MOCK_PRODUCT.images[activeImage]} 
              alt={MOCK_PRODUCT.title}
              className="w-full h-full object-cover"
            />
            {/* 照片切換指示器 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {MOCK_PRODUCT.images.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-8 h-1 transition-all ${activeImage === idx ? 'bg-white' : 'bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 右側：商品資訊與操作台 (佔 5 欄) */}
        <div className="lg:col-span-5 flex flex-col pt-8 lg:pt-12">
          
          {/* 標題與價格 */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 leading-none">
              {MOCK_PRODUCT.title}
            </h1>
            <div className="flex items-end gap-4">
              <span className="text-2xl text-white font-mono">$ {MOCK_PRODUCT.base_price.toFixed(2)}</span>
              <span className="text-[10px] font-mono text-[#ef4444] uppercase tracking-widest mb-1">Base Price</span>
            </div>
          </div>

          {/* 敘述 */}
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            {MOCK_PRODUCT.description}
          </p>

          {/* 布料規格面板 (Terminal Style) */}
          <div className="bg-[#09090b] border border-zinc-800 rounded-sm p-5 mb-10 space-y-4">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#71717a] border-b border-zinc-800 pb-2 mb-4 flex items-center gap-2">
              <Box size={12} /> Fabric_Specifications
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Mill (布廠)</div>
                <div className="text-zinc-200">{MOCK_PRODUCT.specs.mill}</div>
              </div>
              <div>
                <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Weight (克重)</div>
                <div className="text-zinc-200">{MOCK_PRODUCT.specs.weight}</div>
              </div>
              <div>
                <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Composition (成分)</div>
                <div className="text-zinc-200">{MOCK_PRODUCT.specs.composition}</div>
              </div>
              <div>
                <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Origin (產地)</div>
                <div className="text-zinc-200">{MOCK_PRODUCT.specs.origin}</div>
              </div>
            </div>
          </div>

          {/* 行動呼籲 (CTAs) */}
          <div className="space-y-4 mt-auto">
            
            {/* 1. 直接購買標準版 */}
            <button className="w-full py-4 border border-zinc-700 bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-3">
              <Box size={16} />
              Purchase_Standard_Build
            </button>

            {/* 2. 啟動客製化引擎 (主要按鈕) */}
            <button 
              onClick={handleCustomize}
              disabled={isInitializing}
              className="relative w-full py-4 bg-white text-black hover:bg-zinc-200 transition-all font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-3 overflow-hidden group"
            >
              {isInitializing ? (
                <>
                  <TerminalSquare size={16} className="animate-pulse" />
                  INITIALIZING_ENGINE...
                </>
              ) : (
                <>
                  <Scissors size={16} className="group-hover:scale-110 transition-transform" />
                  INITIALIZE_CUSTOMIZATION
                </>
              )}
              {/* 按鈕點擊時的掃描特效 */}
              {isInitializing && (
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#ef4444] shadow-[0_0_10px_#ef4444] animate-[scanline_1s_linear_infinite]"></div>
              )}
            </button>
            <p className="text-center font-mono text-[9px] text-zinc-600 uppercase tracking-widest mt-2">
              Launch 2D Visualizer Engine
            </p>
          </div>

        </div>
      </div>

      {/* 全螢幕載入過場特效 (Terminal Boot Sequence) */}
      {isInitializing && (
        <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center">
           <div className="w-64">
             <div className="flex justify-between font-mono text-[10px] text-[#ef4444] uppercase tracking-widest mb-2">
               <span>Booting System</span>
               <span className="animate-pulse">100%</span>
             </div>
             <div className="h-1 bg-zinc-900 w-full overflow-hidden">
               <div className="h-full bg-[#ef4444] w-full animate-[slideRight_1.5s_ease-out]"></div>
             </div>
             <div className="mt-4 space-y-1 font-mono text-[9px] text-zinc-600 uppercase tracking-wider">
               <p className="animate-[fadeIn_0.2s_ease-out_forwards]">&gt; Loading Configurator Modules...</p>
               <p className="animate-[fadeIn_0.5s_ease-out_forwards] opacity-0">&gt; Fetching Base Silhouette: {MOCK_PRODUCT.id}...</p>
               <p className="animate-[fadeIn_0.8s_ease-out_forwards] opacity-0">&gt; Establishing 2D Rendering Context...</p>
               <p className="animate-[fadeIn_1.1s_ease-out_forwards] opacity-0 text-[#16a34a]">&gt; SYSTEM READY.</p>
             </div>
           </div>
        </div>
      )}

      {/* 內聯動畫樣式 */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes scanline { 0% { transform: translateY(0); } 100% { transform: translateY(50px); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}} />

    </div>
  );
}