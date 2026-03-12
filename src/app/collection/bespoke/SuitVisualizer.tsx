'use client';

import React, { useState, useEffect } from 'react';

// ==========================================
// Types
// ==========================================
// 這裡定義了從父元件接收的設定格式。
// 如果未來增加了「內裡(lining)」或「釦子(button)」，需要先在這裡加上。
export interface SuitConfiguration {
  style: string;
  lapel: string;
  pocket: string;
  fabric: string;
}

// ==========================================
// 1. 掃描線特效 (Scanning Overlay)
// ==========================================
// 這個元件純粹是為了視覺效果，製造一種「掃描中」的科技感。
const ScanningOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {/* 這裡定義了由上往下掃描的動畫 */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          animation: scanline 3s linear infinite;
        }
      `}</style>
      
      {/* 四個角落的對準框 */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-[#71717a]/20" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-[#71717a]/20" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-[#71717a]/20" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-[#71717a]/20" />

      {/* 左下角的 "RENDERING" 閃爍文字 */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
        <span className="font-mono text-[#16a34a] text-[10px] uppercase tracking-[0.2em]">RENDERING</span>
      </div>

      {/* 紅色的雷射掃描線本體 */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#ef4444]/30 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-scanline pointer-events-none"></div>
    </div>
  );
};

// ==========================================
// 2. 沙盒虛擬圖層 (Wireframe Layer)
// ==========================================
// 當您開啟「開發者沙盒模式」時，會出現這些帶有顏色的半透明框框。
// 用途：在設計師還沒生出真實圖片前，讓工程師確認圖層的 Z 軸是否正確。
interface WireframeLayerProps {
  label: string;      // 顯示在左上角的文字 (如: "PEAK LAPEL")
  zIndex: number;     // 圖層的上下關係
  color: string;      // 框線與背景的顏色
  visible: boolean;   // 是否顯示
  offsetIndex: number;// 讓不同圖層錯開一點，避免字疊在一起
}

const WireframeLayer = ({ label, zIndex, color, visible, offsetIndex }: WireframeLayerProps) => {
  if (!visible) return null;
  const offset = offsetIndex * 16; // 每次內縮 16px
  
  return (
    <div 
      className="absolute border-2 border-dashed transition-all duration-300"
      style={{ 
        zIndex, 
        borderColor: color,
        backgroundColor: `${color}20`, // 20 是十六進制的透明度 (約 12%)
        top: `${offset}px`,
        left: `${offset}px`,
        right: `${offset}px`,
        bottom: `${offset}px`,
      }}
    >
      <div 
        className="absolute top-0 left-0 px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
        style={{ backgroundColor: color, color: '#0a0a0a' }}
      >
        Z-{zIndex} | {label}
      </div>
    </div>
  );
};

// ==========================================
// 3. 材質混合層 (Fabric Blend Layer)
// ==========================================
// 這個元件負責把「布料材質」疊加到西裝上，產生 3D 效果。
interface FabricBlendLayerProps {
  fabric: string;       // 目前選到的布料 ID
  sandboxMode: boolean; // 是否為沙盒模式
}

// 📌 【修改重點 1】：替換真實布料圖片
// 當您拍攝了新的布料圖片，請在這裡將路徑對應上去。
// 例如新增了一塊： 'red-velvet': '/images/fabrics/red-velvet.jpg'
const fabricImages: Record<string, string> = {
  'navy-wool': '/images/fabrics/navy-wool.jpg',
  'charcoal-pinstripe': '/images/fabrics/charcoal-pinstripe.jpg',
  'brown-glen-plaid': '/images/fabrics/brown-glen-plaid.jpg',
  'black-herringbone': '/images/fabrics/black-herringbone.jpg',
};

const FabricBlendLayer = ({ fabric, sandboxMode }: FabricBlendLayerProps) => {
  if (fabric === 'none') return null;

  const img = fabricImages[fabric];
  if (!img) return null;

  if (sandboxMode) {
    // 沙盒模式下的假布料層 (僅顯示文字提示)
    return (
      <div 
        className="absolute inset-0 border-2 border-dashed flex items-center justify-center transition-all duration-300"
        style={{ zIndex: 30, borderColor: '#f97316', backgroundColor: '#f9731615', mixBlendMode: 'multiply' }}
      >
        <div className="text-center">
          <div className="px-3 py-1.5 font-mono text-xs uppercase tracking-widest mb-2 inline-block bg-[#f97316] text-[#0a0a0a]">
            Z-30 | FABRIC BLEND
          </div>
        </div>
      </div>
    );
  }

  // 📌 【修改重點 2】：調整 mixBlendMode
  // 這是布料染色的核心！目前使用 'multiply' (色彩增殖)。
  // 這是最適合將布料紋理疊加在「灰階底圖」上的模式。
  return (
    <div 
      className="absolute inset-0 transition-all duration-500"
      style={{ zIndex: 30, mixBlendMode: 'multiply' }}
    >
      <img src={img} alt="fabric texture" className="w-full h-full object-cover" />
    </div>
  );
};

// ==========================================
// 4. 智能圖層 (Image Layer for base/lapel/pocket)
// ==========================================
// 這是一個聰明的元件，用來加載底圖、領子或口袋的圖片。
// 它會先嘗試找 .png，如果 404 找不到，它會自己切換去尋找 .svg。
const ImageLayer = ({ srcBase, alt, zIndex }: { srcBase: string, alt: string, zIndex: number }) => {
  const [ext, setExt] = useState('.png');
  const [error, setError] = useState(false);

  // 當 srcBase (例如從 lapel-notch 變成 lapel-peak) 改變時，重新從 .png 開始找
  useEffect(() => {
    setExt('.png');
    setError(false);
  }, [srcBase]);

  if (error) return null; // 如果 .png 和 .svg 都找不到，就直接隱藏，避免畫面上出現破圖的叉叉

  return (
    <img
      src={`${srcBase}${ext}`}
      alt={alt}
      // absolute inset-0 代表這張圖片會自動填滿並對齊父容器的四個角
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
      style={{ zIndex }}
      onError={() => {
        // 如果載入 .png 失敗，嘗試載入 .svg
        if (ext === '.png') {
          setExt('.svg');
        } else {
          // 如果 .svg 也失敗，標記為 error
          setError(true);
        }
      }}
    />
  );
};

// ==========================================
// 5. 主要視覺化元件 (Main Component)
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
  // 將設定轉換成顯示在畫面上的文字 (例如把 "notch" 變成 "NOTCH LAPEL")
  const getStyleLabel = () => config.style === 'single-breasted' ? 'SB BASE' : 'DB BASE';
  const getLapelLabel = () => config.lapel.toUpperCase() + ' LAPEL';
  const getPocketLabel = () => config.pocket.toUpperCase() + ' POCKET';

  return (
    <div className="relative w-full h-full min-h-[600px] bg-[#050505] overflow-hidden text-white">
      {/* 背景的點狀網格 (可選，純粹為了好看) */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* ★ 視覺化容器 (Visualizer container) ★
        這是真正的「畫布」範圍。我們把比例鎖定在 aspect-[3/4] (寬3高4)。
        請確保您的設計師輸出的圖片也是 3:4 (例如 1200x1600)。
      */}
      <div className="absolute inset-8 flex items-center justify-center">
        <div className="relative w-full max-w-[400px] aspect-[3/4]">
          {sandboxMode ? (
            // ===================================
            // 沙盒模式 (顯示 WireframeLayer)
            // ===================================
            <>
              <WireframeLayer label={getStyleLabel()} zIndex={0} color="#6b7280" visible={true} offsetIndex={0} />
              <WireframeLayer label={getLapelLabel()} zIndex={10} color="#3b82f6" visible={true} offsetIndex={1} />
              <WireframeLayer label={getPocketLabel()} zIndex={20} color="#22c55e" visible={true} offsetIndex={2} />
              <FabricBlendLayer fabric={config.fabric} sandboxMode={true} />
            </>
          ) : (
            // ===================================
            // 實機模式 (顯示真正的西裝圖片)
            // ===================================
            <>
              {/* 如果還沒放入真正的西裝底圖，這個漸層方塊會當作備用的假底圖 */}
              <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#999] via-[#777] to-[#555]" />
              
              {/* 📌 【修改重點 3】：新增圖層
                如果未來您想讓使用者可以選「鈕扣」，請在這裡加上：
                <ImageLayer srcBase={`/images/models/parts/button-${config.button}`} alt="Button" zIndex={25} />
                記得 zIndex 數字越大，圖層越在上面。
              */}
              {/* Z-0: 基礎西裝底圖 */}
              <ImageLayer srcBase={`/images/models/base-${config.style}`} alt="Base Suit" zIndex={0} />
              
              {/* Z-10: 領型圖層 */}
              <ImageLayer srcBase={`/images/models/parts/lapel-${config.lapel}`} alt="Lapel" zIndex={10} />
              
              {/* Z-20: 口袋圖層 */}
              <ImageLayer srcBase={`/images/models/parts/pocket-${config.pocket}`} alt="Pocket" zIndex={20} />

              {/* Z-30: 布料材質圖層 (會向下蓋過 z-0 到 z-20) */}
              <FabricBlendLayer fabric={config.fabric} sandboxMode={false} />
              
              {/* 如果選擇了「無布料 (none)」，顯示提示字樣 */}
              {config.fabric === 'none' && (
                <div className="absolute inset-0 z-0 bg-[#18181b] flex items-center justify-center" style={{ zIndex: -1 }}>
                  <div className="text-center text-[#71717a]">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] mb-2">SELECT FABRIC</p>
                    <p className="text-[10px] opacity-50">Choose a material to preview blend</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 呼叫掃描線特效 (疊在最上面) */}
      <ScanningOverlay />

      {/* 右上角的「當前設定」文字面板
        用來顯示目前選擇了哪些選項。
      */}
      <div className="absolute top-6 right-6 text-right z-40">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#71717a] mb-1">ACTIVE CONFIG</p>
        <p className="font-mono text-sm tracking-wider">
          {config.style.toUpperCase().replace('-', '_')}
        </p>
        <p className="font-mono text-sm tracking-wider text-[#ef4444]">
          {config.lapel.toUpperCase()} / {config.pocket.toUpperCase()}
        </p>
        {config.fabric !== 'none' && (
          <p className="font-mono text-[10px] text-[#16a34a] mt-1 tracking-wider">
            BLEND: {config.fabric.toUpperCase().replace('-', '_')}
          </p>
        )}
      </div>
    </div>
  );
}