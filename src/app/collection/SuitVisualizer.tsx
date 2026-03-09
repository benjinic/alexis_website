'use client';

import React, { useEffect, useMemo, useState } from 'react';

interface VisualizerProps {
  selectedFabricImage: string;
  selectedStyle: string;
  selectedLapel: string;
  selectedPocket: string;
  isTestMode: boolean;
  enableBlend: boolean;
}

export default function SuitVisualizer({
  selectedFabricImage,
  selectedStyle,
  selectedLapel,
  selectedPocket,
  isTestMode,
  enableBlend
}: VisualizerProps) {
  const FALLBACK_IMAGE = '/ALEXIS%20BESPOKE.png';

  const baseCandidates = useMemo(
    () => [
      `/images/models/base-${selectedStyle}.png`,
      selectedFabricImage,
      FALLBACK_IMAGE,
    ].filter(Boolean),
    [selectedStyle, selectedFabricImage]
  );

  const [baseIndex, setBaseIndex] = useState(0);
  const [baseHidden, setBaseHidden] = useState(false);
  
  const [lapelSrc, setLapelSrc] = useState(`/images/models/parts/${selectedLapel}.svg`);
  const [pocketSrc, setPocketSrc] = useState(`/images/models/parts/${selectedPocket}.svg`);

  const [lapelError, setLapelError] = useState(false);
  const [pocketError, setPocketError] = useState(false);

  useEffect(() => {
    setBaseIndex(0);
    setBaseHidden(false);
  }, [baseCandidates]);

  useEffect(() => {
    setLapelSrc(`/images/models/parts/${selectedLapel}.svg`);
    setLapelError(false);
  }, [selectedLapel]);

  useEffect(() => {
    setPocketSrc(`/images/models/parts/${selectedPocket}.svg`);
    setPocketError(false);
  }, [selectedPocket]);

  const handleBaseError = () => {
    if (baseIndex < baseCandidates.length - 1) {
      setBaseIndex((prev) => prev + 1);
      return;
    }
    setBaseHidden(true);
  };

  return (
    <div className="relative w-full aspect-[3/4] bg-[#09090b] overflow-hidden flex items-center justify-center border border-zinc-800">
      
      {/* =======================
          層級 0: 基礎底圖 (z-0)
          ======================= */}
      {!baseHidden ? (
        <img
          src={baseCandidates[baseIndex]}
          alt="Base Suit"
          onError={handleBaseError}
          className="object-cover w-full h-full absolute inset-0 z-0 transition-opacity duration-300"
        />
      ) : (
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          {isTestMode ? (
            /* 👇 這裡把 w-3/4 h-5/6 改成了 w-[60%] h-[70%]，讓衣服整體變小 */
            <div className="w-[80%] h-[90%] bg-[#18181b] rounded-[40px] border border-zinc-800 flex flex-col items-center justify-center shadow-inner transition-all duration-300">
               <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Base Layer (z-0)</span>
               <span className="text-zinc-300 font-bold mt-2 text-xs">{selectedStyle}</span>
            </div>
          ) : (
            <div className="text-zinc-600 text-[10px] tracking-widest uppercase font-mono">No Preview Asset</div>
          )}
        </div>
      )}

      {/* =======================
          層級 1: 領型 (z-10)
          ======================= */}
      {lapelSrc && !lapelError ? (
        <img
          src={lapelSrc}
          alt="Lapel"
          onError={() => setLapelError(true)}
          className="object-cover w-full h-full absolute inset-0 z-10"
        />
      ) : (
        isTestMode && (
          /* 👇 這裡把領型縮小，改為 w-[25%] h-[15%]，並微調 top 距離 */
           <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[20%] h-[12%] bg-[#3b82f6]/20 border border-dashed border-[#3b82f6]/50 z-10 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm transition-all duration-300">
             <span className="text-[#93c5fd] font-mono text-[9px] uppercase font-bold text-center tracking-wider">Lapel (z-10)</span>
             <span className="text-white font-bold text-[10px] mt-1">{selectedLapel.replace('lapel-', '')}</span>
          </div>
        )
      )}

      {/* =======================
          層級 2: 口袋 (z-20)
          ======================= */}
      {pocketSrc && !pocketError ? (
        <img
          src={pocketSrc}
          alt="Pocket"
          onError={() => setPocketError(true)}
          className="object-cover w-full h-full absolute inset-0 z-20 transition-opacity duration-300"
        />
      ) : (
        isTestMode && (
          /* 👇 這裡把口袋縮小，改為 w-[15%] h-[10%]，並往內部移動 right-[30%] */
           <div className="absolute bottom-[24%] right-[22%] w-[20%] h-[12%] bg-[#f97316]/20 border border-dashed border-[#f97316]/50 z-20 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm transition-all duration-300">
             <span className="text-[#fdba74] font-mono text-[9px] uppercase font-bold text-center tracking-wider">Pocket (z-20)</span>
             <span className="text-white font-bold text-[10px] mt-1">{selectedPocket.replace('pocket-', '')}</span>
          </div>
        )
      )}

      {/* =======================
          層級 3: 材質混合疊加 (z-30)
          ======================= */}
      {enableBlend && (
        <div
          className="absolute inset-0 z-30 mix-blend-multiply opacity-80 pointer-events-none transition-opacity duration-500"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
            backgroundColor: '#1c2841', 
          }}
        />
      )}

      {/* 頂層: 掃描線特效 (z-50) */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#ef4444]/30 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-[slide_4s_linear_infinite] z-50 pointer-events-none"></div>
    </div>
  );
}