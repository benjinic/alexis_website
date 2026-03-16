'use client';

import React, { useState, useEffect } from 'react';

// ==========================================
// Types
// ==========================================
export interface SuitConfiguration {
  style: string;
  lapel: string;
  pocket: string;
  fabric: string;
}

// ==========================================
// 1. 掃描線特效 (Scanning Overlay)
// ==========================================
const ScanningOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          animation: scanline 3s linear infinite;
        }
      `}</style>

      <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-[#71717a]/20" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-[#71717a]/20" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-[#71717a]/20" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-[#71717a]/20" />

      <div className="absolute bottom-6 left-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
        <span className="font-mono text-[#16a34a] text-[10px] uppercase tracking-[0.2em]">RENDERING</span>
      </div>

      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#ef4444]/30 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-scanline pointer-events-none"></div>
    </div>
  );
};

// ==========================================
// 2. 沙盒虛擬圖層 (WireframeLayer)
// ==========================================
interface WireframeLayerProps {
  label: string;
  zIndex: number;
  color: string;
  visible: boolean;
  offsetIndex: number;
  highlight?: boolean; // 新增 highlight 屬性來突出特定圖層
}

const WireframeLayer = ({ label, zIndex, color, visible, offsetIndex, highlight }: WireframeLayerProps) => {
  if (!visible) return null;
  const offset = offsetIndex * 16;
  
  return (
    <div 
      className={`absolute transition-all duration-300 ${
        highlight 
          ? 'border-4 border-solid shadow-[0_0_30px_rgba(255,255,255,0.4)] animate-pulse' 
          : 'border-2 border-dashed'
      }`}
      style={{ 
        zIndex: highlight ? 45 : zIndex, // 若被 highlight，強制提升顯示層級避免被遮擋
        borderColor: color,
        backgroundColor: `${color}20`,
        top: `${offset}px`,
        left: `${offset}px`,
        right: `${offset}px`,
        bottom: `${offset}px`,
      }}
    >
      <div 
        className={`absolute top-0 left-0 px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${highlight ? 'font-black' : ''}`}
        style={{ backgroundColor: color, color: '#0a0a0a' }}
      >
        Z-{zIndex} | {label}
      </div>
      <div className="absolute top-1 right-1 w-2 h-2" style={{ borderRight: `2px solid ${color}`, borderTop: `2px solid ${color}` }} />
      <div className="absolute bottom-1 left-1 w-2 h-2" style={{ borderLeft: `2px solid ${color}`, borderBottom: `2px solid ${color}` }} />
      <div className="absolute bottom-1 right-1 w-2 h-2" style={{ borderRight: `2px solid ${color}`, borderBottom: `2px solid ${color}` }} />
    </div>
  );
};

// ==========================================
// 3. 智能圖層 (Image Layer)
// ==========================================
const ImageLayer = ({ 
  srcBase, 
  alt, 
  zIndex,
  customClass = "inset-0 w-full h-full object-cover" 
}: { 
  srcBase: string; 
  alt: string; 
  zIndex: number;
  customClass?: string;
}) => {
  const [ext, setExt] = useState('.png');
  const [error, setError] = useState(false);

  useEffect(() => {
    setExt('.png');
    setError(false);
  }, [srcBase]);

  if (error) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-red-500/50 bg-red-500/10 backdrop-blur-sm" style={{ zIndex }}>
        <p className="font-mono text-[10px] text-red-500 font-bold">Missing Asset</p>
        <p className="font-mono text-[9px] text-red-400 mt-1 break-all">{srcBase}.[png|svg]</p>
      </div>
    );
  }

  return (
    <img
      src={`${srcBase}${ext}`}
      alt={alt}
      className={`absolute transition-opacity duration-300 ${customClass}`}
      style={{ zIndex }}
      onError={() => {
        if (ext === '.png') setExt('.svg');
        else setError(true);
      }}
    />
  );
};

// ==========================================
// 4. 材質混合層 (Fabric Blend Layer)
// ==========================================
interface FabricBlendLayerProps {
  fabric: string;
  sandboxMode: boolean;
  currentStyle?: string;
}

const fabricImages: Record<string, string> = {
  'navy-wool': '/assets/fabrics/navy-wool.jpg',
  'charcoal-pinstripe': '/assets/fabrics/charcoal-pinstripe.jpg',
  'brown-glen-plaid': '/assets/fabrics/brown-glen-plaid.jpg',
  'black-herringbone': '/assets/fabrics/black-herringbone.jpg',
};

const FabricBlendLayer = ({ fabric, sandboxMode, currentStyle }: FabricBlendLayerProps) => {
  if (fabric === 'none') return null;
  const img = fabricImages[fabric];
  if (!img) return null;

  if (sandboxMode) {
    return (
      // 將 zIndex 設定為 -10 放至最底，避免遮擋 Sandbox 的操作與其他圖層
      <div className="absolute inset-0 border-2 border-dashed border-[#f97316] bg-[#f9731615] flex items-center justify-center" style={{ zIndex: -10, mixBlendMode: 'multiply' }}>
        <div className="px-3 py-1.5 font-mono text-xs uppercase tracking-widest bg-[#f97316] text-[#0a0a0a]">Z--10 | FABRIC BLEND</div>
      </div>
    );
  }

  const maskStyle = currentStyle ? {
    WebkitMaskImage: `url(/images/models/base-${currentStyle}.png)`,
    WebkitMaskSize: 'cover',
    WebkitMaskPosition: 'center',
    maskImage: `url(/images/models/base-${currentStyle}.png)`,
    maskSize: 'cover',
    maskPosition: 'center',
  } : {};

  return (
    <div 
      className="absolute inset-0 transition-all duration-500"
      style={{ 
        zIndex: -10, // 將材質層放至最底
        mixBlendMode: 'multiply',
        ...maskStyle
      }}
    >
      <img src={img} alt="fabric texture" className="w-full h-full object-cover" />
    </div>
  );
};

// ==========================================
// 主要視覺化元件 (Main Component)
// ==========================================
interface SuitVisualizerProps {
  config?: SuitConfiguration;
  sandboxMode?: boolean;
}

const defaultConfig: SuitConfiguration = {
  style: 'single-breasted',
  lapel: 'peak',
  pocket: 'flap',
  fabric: 'navy-wool'
};

export default function SuitVisualizer({ config = defaultConfig, sandboxMode = true }: SuitVisualizerProps) {
  const getStyleLabel = () => config.style === 'single-breasted' ? 'SB BASE' : 'DB BASE';
  const getLapelLabel = () => config.lapel.toUpperCase() + ' LAPEL';
  const getPocketLabel = () => config.pocket.toUpperCase() + ' POCKET';

  // --- Gemini API State ---
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  // --- Gemini API Function (含指數退避重試機制) ---
  const handleAiConsultation = async () => {
    setIsAnalyzing(true);
    setAiFeedback(null);
    
    const apiKey = ""; // 執行環境會在 runtime 自動提供 API Key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const prompt = `身為 ALEXIS BESPOKE 的首席 AI 虛擬裁縫師，請分析這套西裝配置：
    版型: ${config.style.replace('-', ' ')}
    領型: ${config.lapel} lapel
    口袋: ${config.pocket} pocket
    布料: ${config.fabric.replace('-', ' ')}

    請用繁體中文給出一段精準、洗鍊（約3-4句話）的風格評鑑，並給出搭配襯衫與領帶的具體建議。
    語氣要求：極致奢華、專業權威、並帶有一點未來賽博龐克的科技感。不要使用過多的客套話，直接給出結論。`;

    const systemPrompt = "You are an elite AI master tailor. Keep responses sophisticated, slightly cyberpunk-flavored, and expert.";
    const delays = [1000, 2000, 4000, 8000, 16000];
    let attempt = 0;

    while (attempt < 5) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        });
        
        if (!response.ok) throw new Error('API API Error');
        
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        setAiFeedback(text || "演算失敗，無法取得風格建議。");
        break;
      } catch (error) {
        attempt++;
        if (attempt >= 5) {
          setAiFeedback("連線至核心神經網路失敗。請稍後重試。");
        } else {
          await new Promise(res => setTimeout(res, delays[attempt - 1]));
        }
      }
    }
    
    setIsAnalyzing(false);
  };

  return (
    <div className="relative w-full h-full min-h-[600px] bg-zinc-950 overflow-hidden text-white">
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`, backgroundSize: '24px 24px' }} />

      {/* 視覺化容器 */}
      <div className="absolute inset-8 flex items-center justify-center">
        <div className="relative w-full max-w-[400px] aspect-[3/4]">
          {sandboxMode ? (
            <>
              {/* 布料放置在最前面渲染，但其 zIndex 為 -10 會沉至最底 */}
              <FabricBlendLayer fabric={config.fabric} sandboxMode={true} />
              
              {/* 將 Z-0 圖層設為純白色，並開啟 highlight 屬性 */}
              <WireframeLayer label={getStyleLabel()} zIndex={0} color="#ffffff" visible={true} offsetIndex={0} highlight={true} />
              
              <WireframeLayer label={getLapelLabel()} zIndex={10} color="#3b82f6" visible={true} offsetIndex={1} />
              <WireframeLayer label={getPocketLabel()} zIndex={20} color="#22c55e" visible={true} offsetIndex={2} />
            </>
          ) : (
            <>
              <div className="absolute inset-0 z-0 bg-gradient-to-b from-neutral-400 via-neutral-500 to-neutral-600" />
              <ImageLayer srcBase={`/images/models/base-${config.style}`} alt="Base Suit" zIndex={0} customClass="inset-0 w-full h-full object-cover" />
              <ImageLayer srcBase={`/images/models/parts/lapel-${config.lapel}`} alt="Lapel" zIndex={10} customClass="inset-0 w-full h-full object-cover" />
              <ImageLayer srcBase={`/images/models/parts/pocket-${config.pocket}`} alt="Pocket" zIndex={20} customClass="inset-0 w-full h-full object-cover" />
              <FabricBlendLayer fabric={config.fabric} sandboxMode={false} currentStyle={config.style} />
              
              {config.fabric === 'none' && (
                <div className="absolute inset-0 z-0 bg-zinc-900 flex items-center justify-center" style={{ zIndex: -1 }}>
                  <div className="text-center text-zinc-500">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] mb-2">SELECT FABRIC</p>
                    <p className="text-[10px] opacity-50">Choose a material to preview blend</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ScanningOverlay />

      {/* 右上角的「當前設定」文字面板與 ✨ AI 顧問按鈕 */}
      <div className="absolute top-6 right-6 flex flex-col items-end z-50 pointer-events-none">
        <div className="text-right mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-1">ACTIVE CONFIG</p>
          <p className="font-mono text-sm tracking-wider">{config.style.toUpperCase().replace('-', '_')}</p>
          <p className="font-mono text-sm tracking-wider text-red-500">{config.lapel.toUpperCase()} / {config.pocket.toUpperCase()}</p>
          {config.fabric !== 'none' && (
            <p className="font-mono text-[10px] text-green-500 mt-1 tracking-wider">
              BLEND: {config.fabric.toUpperCase().replace('-', '_')}
            </p>
          )}
        </div>
        
        {/* Gemini AI 按鈕 */}
        <button 
          onClick={handleAiConsultation}
          disabled={isAnalyzing}
          className="pointer-events-auto px-4 py-2 border border-[#16a34a] bg-[#16a34a]/10 hover:bg-[#16a34a]/20 text-[#16a34a] font-mono text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2 backdrop-blur-sm shadow-[0_0_10px_rgba(22,163,74,0.1)]"
        >
          {isAnalyzing ? (
            <span className="animate-pulse">ANALYZING_SPECS...</span>
          ) : (
            <span>✨ AI_CONSULTANT</span>
          )}
        </button>
      </div>

      {/* ✨ AI 顧問結果面板 (Terminal Style) */}
      {aiFeedback && (
        <div className="absolute bottom-6 left-6 right-6 md:left-auto md:w-96 bg-zinc-950/95 border border-[#16a34a] p-5 z-50 shadow-[0_0_20px_rgba(22,163,74,0.15)] backdrop-blur-md">
          <div className="flex justify-between items-start mb-3 border-b border-[#16a34a]/30 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
              <span className="font-mono text-[10px] text-[#16a34a] uppercase tracking-widest">✨ SYS.AI_TAILOR_LOG</span>
            </div>
            <button 
              onClick={() => setAiFeedback(null)} 
              className="text-zinc-500 hover:text-red-500 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="font-mono text-xs text-zinc-300 leading-relaxed max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {aiFeedback.split('\n').map((line, i) => (
              <p key={i} className="mb-2">{line}</p>
            ))}
          </div>
        </div>
      )}

      {/* 針對 AI 彈窗的自訂卷軸樣式 */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #16a34a; border-radius: 2px; }
      `}</style>
    </div>
  );
}