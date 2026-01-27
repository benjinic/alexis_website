'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useBlueprintStore } from '@/store/useBlueprintStore';
import { Fabric } from '@/types/blueprint';

export default function BlueprintStudio() {
  // 從 Store 讀取狀態
  const { step, config, setFabric, nextStep, prevStep } = useBlueprintStore();
  
  // 本地狀態：布料列表
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 載入布料 API
  useEffect(() => {
    let active = true;

    async function fetchFabrics() {
      try {
        const res = await fetch('/api/fabrics');
        if (!res.ok) throw new Error('Failed to fetch fabrics');
        const data = await res.json();
        if (active) setFabrics(data.fabrics || []);
      } catch (err) {
        if (active) setError((err as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchFabrics();
    return () => {
      active = false;
    };
  }, []);

  // 處理布料選擇
  const handleSelectFabric = (fabric: Fabric) => {
    setFabric(fabric); // 1. 存入 Store
    nextStep();        // 2. 自動跳下一步
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
      
      {/* 頂部導航列 */}
      <header className="h-16 border-b border-white/10 flex items-center px-8 bg-neutral-900 z-50">
        <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm tracking-widest">
          <ArrowLeft className="w-4 h-4" /> ATELIER
        </Link>
        <div className="ml-auto flex items-center gap-8">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1 w-8 rounded-full ${step >= s ? 'bg-yellow-600' : 'bg-gray-800'}`} />
            ))}
          </div>
          <span className="font-serif text-yellow-600 tracking-widest">STEP {step} / 3</span>
        </div>
      </header>

      {/* 主要內容區 - 根據 Step 切換顯示 */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* STEP 1: 選布料 */}
        {step === 1 && (
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-light mb-2">Select Your Fabric</h1>
            <p className="text-gray-500 mb-8">The foundation of your masterpiece.</p>

            {loading ? (
              <div className="text-center py-20 text-gray-500 animate-pulse">Loading Fabric Library...</div>
            ) : error ? (
              <div className="text-center py-20 text-red-400 font-mono">{error}</div>
            ) : fabrics.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-700 rounded-lg">
                <p className="text-xl text-gray-400">No fabrics available online.</p>
                <p className="text-sm text-gray-600 mt-2">
                  (Please check Firebase: inventory collection needs 'isOnline: true')
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {fabrics.map((fabric) => (
                  <button
                    key={fabric.id}
                    onClick={() => handleSelectFabric(fabric)}
                    disabled={fabric.inStock === false}
                    className={`group relative text-left bg-neutral-800 border border-white/5 hover:border-yellow-600/50 transition-all duration-300 ${fabric.inStock === false ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-neutral-700 relative">
                       <img src={fabric.imageUrl} alt={fabric.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="border border-white/30 px-6 py-2 tracking-widest text-sm bg-black/50 backdrop-blur-sm">SELECT</span>
                       </div>
                       {fabric.inStock === false && (
                         <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                           <span className="text-red-500 font-bold tracking-widest border border-red-500 px-3 py-1">SOLD OUT</span>
                         </div>
                       )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-white">{fabric.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">{fabric.category || 'Fabric'}</span>
                        <span className="text-yellow-600 font-mono">${fabric.price.toLocaleString()}</span>
                      </div>
                    </div>
                    {config.fabric?.id === fabric.id && (
                      <div className="absolute top-3 right-3 bg-yellow-600 text-black rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: 選剪裁 (暫時顯示，下一步我們來做這個) */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto text-center py-20 animate-in fade-in slide-in-from-right-8">
            <h2 className="text-3xl font-serif text-yellow-600 mb-4">Architecture & Cut</h2>
            <p className="text-gray-400 mb-8">
              Selected Fabric: <span className="text-white">{config.fabric?.name}</span>
            </p>
            <div className="p-8 border border-dashed border-gray-700 rounded-lg">
              <p className="text-xl text-gray-500">Styling options coming next...</p>
            </div>
            <button onClick={prevStep} className="mt-8 text-gray-400 hover:text-white underline">
              Back to Fabrics
            </button>
          </div>
        )}

      </main>

      {/* 底部狀態列 (Sticky Footer) */}
      <footer className="h-20 bg-neutral-900 border-t border-white/10 flex items-center px-8 justify-between">
        <div className="flex flex-col">
           <span className="text-xs text-gray-500 uppercase tracking-widest">Estimated Total</span>
           <span className="text-2xl font-mono text-white">
             ${(config.fabric?.price || 0).toLocaleString()}
           </span>
        </div>
        
        {step > 1 && (
           <button className="bg-white text-black px-8 py-3 font-bold tracking-widest hover:bg-yellow-600 transition-colors">
             CONTINUE
           </button>
        )}
      </footer>
    </div>
  );
}