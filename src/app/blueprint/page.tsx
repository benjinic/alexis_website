'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Ruler, Loader2 } from 'lucide-react';
import { useBlueprintStore } from '@/store/useBlueprintStore';
import { Fabric } from '@/types/blueprint';
import { useToast } from "@/hooks/use-toast"; // 假設您有這個 hook (shadcn/ui)

// --- 元件：樣式選擇卡片 (保持不變) ---
const StyleOption = ({ 
  label, value, selected, onClick 
}: { 
  label: string; value: string; selected: boolean; onClick: () => void; 
}) => (
  <button
    onClick={onClick}
    className={`relative group flex flex-col items-center p-4 border transition-all duration-300 ${
      selected 
        ? 'border-yellow-600 bg-yellow-600/10' 
        : 'border-white/10 bg-neutral-800 hover:border-white/30'
    }`}
  >
    <div className={`w-16 h-16 mb-3 rounded-full border-2 flex items-center justify-center bg-neutral-900 ${selected ? 'border-yellow-600' : 'border-neutral-700'}`}>
       <span className="text-xs font-mono text-gray-400">{value.toUpperCase().slice(0, 3)}</span>
    </div>
    <span className={`text-sm font-bold tracking-widest ${selected ? 'text-yellow-600' : 'text-gray-400'}`}>
      {label}
    </span>
    {selected && <div className="absolute top-2 right-2"><Check className="w-4 h-4 text-yellow-600" /></div>}
  </button>
);

export default function BlueprintStudio() {
  const { step, config, measurements, setFabric, updateStyle, updateMeasurements, nextStep, prevStep } = useBlueprintStore();
  const { toast } = useToast();
  
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // 送出狀態

  // 載入布料 API
  useEffect(() => {
    async function fetchFabrics() {
      try {
        const res = await fetch('/api/fabrics');
        const data = await res.json();
        setFabrics(data.fabrics || []);
      } catch (error) {
        console.error('Failed to load fabrics', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFabrics();
  }, []);

  const handleSelectFabric = (fabric: Fabric) => {
    setFabric(fabric);
    nextStep();
  };

  // 處理訂單送出 (模擬)
  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // TODO: 這裡未來要串接 Firebase 寫入 orders 集合
    console.log("Order Submitted:", { config, measurements });
    
    toast({
      title: "Commission Received",
      description: "Your blueprint has been sent to the atelier.",
    });
    
    setIsSubmitting(false);
    // 可以在這裡跳轉到 /success 頁面
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
      
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* STEP 1: FABRIC SELECTION (同上一步) */}
        {step === 1 && (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-4xl font-light mb-2">Select Your Fabric</h1>
              <p className="text-gray-500 mb-8">The foundation of your masterpiece.</p>

              {loading ? (
                <div className="text-center py-20 text-gray-500 animate-pulse">Loading Fabric Library...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {fabrics.map((fabric) => (
                    <button
                      key={fabric.id}
                      onClick={() => handleSelectFabric(fabric)}
                      className="group relative text-left bg-neutral-800 border border-white/5 hover:border-yellow-600/50 transition-all duration-300"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-neutral-700 relative">
                         <img src={fabric.imageUrl} alt={fabric.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="border border-white/30 px-6 py-2 tracking-widest text-sm bg-black/50 backdrop-blur-sm">SELECT</span>
                         </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-white">{fabric.name}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-yellow-600 font-mono">${fabric.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: ARCHITECTURE (同上一步) */}
        {step === 2 && (
          <div className="flex-1 flex h-full animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Left: Preview */}
            <div className="hidden lg:flex w-3/5 bg-black items-center justify-center relative border-r border-white/10">
              <div className="absolute top-8 left-8 z-10">
                <h2 className="text-2xl font-serif text-white">Visual Prototype</h2>
                <p className="text-sm text-gray-500 font-mono mt-1">
                  {config.fabric?.name} / {config.style.lapel.toUpperCase()} LAPEL
                </p>
              </div>
              <div className="relative w-[400px] h-[600px] bg-neutral-800 rounded-lg overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center text-neutral-700 font-mono text-xs">[MANNEQUIN BASE]</div>
                {config.fabric && (
                  <div className="absolute inset-0 opacity-50 mix-blend-overlay pointer-events-none">
                    <img src={config.fabric.imageUrl} className="w-full h-full object-cover" alt="texture" />
                  </div>
                )}
                <div className="absolute inset-0 border-[20px] border-transparent border-t-neutral-800/80"></div>
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center">
                   <div className="text-6xl text-white/10 font-serif">
                     {config.style.lapel === 'peak' ? '⚡' : config.style.lapel === 'shawl' ? '⚪' : '▼'}
                   </div>
                </div>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex-1 lg:w-2/5 bg-neutral-900 p-8 overflow-y-auto">
              <div className="max-w-md mx-auto space-y-12">
                <div className="space-y-2">
                  <h3 className="text-xl font-serif text-white">The Architecture</h3>
                  <p className="text-sm text-gray-500">Define the silhouette of your armor.</p>
                </div>
                {/* ... Options (Lapel, Buttons, Vents) ... */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lapel Style</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <StyleOption label="Notch" value="notch" selected={config.style.lapel === 'notch'} onClick={() => updateStyle({ lapel: 'notch' })} />
                    <StyleOption label="Peak" value="peak" selected={config.style.lapel === 'peak'} onClick={() => updateStyle({ lapel: 'peak' })} />
                    <StyleOption label="Shawl" value="shawl" selected={config.style.lapel === 'shawl'} onClick={() => updateStyle({ lapel: 'shawl' })} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Button Stance</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <StyleOption label="One" value="1" selected={config.style.button === '1'} onClick={() => updateStyle({ button: '1' })} />
                    <StyleOption label="Two" value="2" selected={config.style.button === '2'} onClick={() => updateStyle({ button: '2' })} />
                    <StyleOption label="Double" value="double" selected={config.style.button === 'double'} onClick={() => updateStyle({ button: 'double' })} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vents (Back)</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <StyleOption label="Double" value="double" selected={config.style.vent === 'double'} onClick={() => updateStyle({ vent: 'double' })} />
                    <StyleOption label="Single" value="single" selected={config.style.vent === 'single'} onClick={() => updateStyle({ vent: 'single' })} />
                    <StyleOption label="None" value="none" selected={config.style.vent === 'none'} onClick={() => updateStyle({ vent: 'none' })} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: THE METRICS (New!) */}
        {step === 3 && (
          <div className="flex-1 flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="max-w-2xl w-full bg-black border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
              
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Ruler className="w-32 h-32 text-white" />
              </div>

              <h2 className="text-3xl font-serif text-yellow-600 mb-2">The Metrics</h2>
              <p className="text-gray-500 mb-8 font-mono text-sm">CALIBRATING YOUR DIGITAL TWIN.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Height (cm)</label>
                  <input 
                    type="number" 
                    value={measurements.height}
                    onChange={(e) => updateMeasurements({ height: parseInt(e.target.value) || 0 })}
                    className="w-full bg-neutral-900 border border-white/20 text-white p-4 font-mono text-xl focus:border-yellow-600 outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={measurements.weight}
                    onChange={(e) => updateMeasurements({ weight: parseInt(e.target.value) || 0 })}
                    className="w-full bg-neutral-900 border border-white/20 text-white p-4 font-mono text-xl focus:border-yellow-600 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4 mb-12">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Fit Preference</label>
                <div className="grid grid-cols-3 gap-4">
                  {(['slim', 'regular', 'comfort'] as const).map((fit) => (
                    <button
                      key={fit}
                      onClick={() => updateMeasurements({ fit })}
                      className={`p-4 border font-mono text-sm uppercase ${
                        measurements.fit === fit 
                          ? 'border-yellow-600 bg-yellow-600 text-black font-bold' 
                          : 'border-white/20 text-gray-400 hover:border-white'
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left">
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Final Commission</div>
                  <div className="text-white font-bold">{config.fabric?.name}</div>
                  <div className="text-sm text-gray-400">
                    {config.style.lapel} lapel, {config.style.button} button, {config.style.vent} vent
                  </div>
                </div>
                
                <button 
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-white text-black px-8 py-4 font-bold tracking-widest hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> PROCESSING</>
                  ) : (
                    <>CONFIRM ORDER <span className="font-mono ml-2">${(config.fabric?.price || 0).toLocaleString()}</span></>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer (Step 3 不顯示 Footer，因為確認按鈕在卡片裡) */}
      {step < 3 && (
        <footer className="h-20 bg-neutral-900 border-t border-white/10 flex items-center px-8 justify-between z-50">
          <div className="flex flex-col">
             <span className="text-xs text-gray-500 uppercase tracking-widest">Estimated Total</span>
             <span className="text-2xl font-mono text-white">
               ${(config.fabric?.price || 0).toLocaleString()}
             </span>
          </div>
          
          <div className="flex gap-4">
            {step > 1 && (
               <button onClick={prevStep} className="text-gray-400 hover:text-white px-6 py-3 font-mono text-sm">
                 BACK
               </button>
            )}
            {step === 2 && (
               <button onClick={nextStep} className="bg-white text-black px-8 py-3 font-bold tracking-widest hover:bg-yellow-600 transition-colors flex items-center gap-2">
                 NEXT: MEASUREMENTS <ChevronRight className="w-4 h-4" />
               </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}