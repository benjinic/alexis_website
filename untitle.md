'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface SuitConfiguration {
  style: string;
  lapel: string;
  pocket: string;
  fabric: string;
}

interface SuitVisualizerProps {
  config?: SuitConfiguration;
  sandboxMode?: boolean;
  useCanvasRenderer?: boolean;
}

const defaultConfig: SuitConfiguration = {
  style: 'single-breasted',
  lapel: 'peak',
  pocket: 'flap',
  fabric: 'navy-wool',
};

type PanelKey = 'fabric' | 'style' | 'details';

type LayerKey =
  | 'mannequin'
  | 'shirt'
  | 'lining'
  | 'jacketBase'
  | 'fabricTint'
  | 'shadows'
  | 'jacketBody'
  | 'lapel'
  | 'hipPockets'
  | 'breastPocket'
  | 'buttons'
  | 'satinLapel'
  | 'handkerchief'
  | 'stitching'
  | 'fxOverlay';

type CanvasLayer = {
  key: LayerKey;
  z: number;
  alpha?: number;
  blendMode?: GlobalCompositeOperation;
  imageSrc?: string;
  fillColor?: string;
};

const fabricOptions = [
  { key: 'black-herringbone', label: 'Midnight', swatch: '#1c1b1b' },
  { key: 'navy-wool', label: 'Navy', swatch: '#2a3c5a' },
  { key: 'charcoal-pinstripe', label: 'Charcoal', swatch: '#2a2a2f' },
  { key: 'brown-glen-plaid', label: 'Brown', swatch: '#4a3c2f' },
];

const styleOptions = [
  { key: 'single-breasted', label: 'Single Breasted' },
  { key: 'double-breasted', label: 'Double Breasted' },
];

const lapelOptions = [
  { key: 'peak', label: 'Peak' },
  { key: 'notch', label: 'Notch' },
  { key: 'shawl', label: 'Shawl' },
];

const pocketOptions = [
  { key: 'flap', label: 'Flap' },
  { key: 'patch', label: 'Patch' },
  { key: 'jetted', label: 'Jetted' },
];

const fabricPreviewImage: Record<string, string> = {
  'black-herringbone': '/images/models/base-single-breasted.png',
  'navy-wool': '/images/models/base-single-breasted.png',
  'charcoal-pinstripe': '/images/models/base-single-breasted.png',
  'brown-glen-plaid': '/images/models/base-single-breasted.png',
};

const fabricTintMap: Record<string, string> = {
  'black-herringbone': '#1b1b1b',
  'navy-wool': '#2a3c5a',
  'charcoal-pinstripe': '#2d2d33',
  'brown-glen-plaid': '#4a3c2f',
};

const buildCanvasLayers = (config: SuitConfiguration): CanvasLayer[] => [
  { key: 'mannequin', z: 10, alpha: 0.2, imageSrc: '/images/models/layers/mannequin.png' },
  { key: 'shirt', z: 20, alpha: 0.8, blendMode: 'screen', imageSrc: '/images/models/layers/shirt.png' },
  { key: 'lining', z: 95 },
  { key: 'jacketBase', z: 100, alpha: 0.95, imageSrc: '/images/models/layers/jacket-base.png' },
  { key: 'fabricTint', z: 110, alpha: 0.42, blendMode: 'multiply', fillColor: fabricTintMap[config.fabric] || '#2a3c5a' },
  { key: 'shadows', z: 130 },
  { key: 'jacketBody', z: 140, alpha: 0.92, imageSrc: `/images/models/base-${config.style}.png` },
  { key: 'lapel', z: 150, alpha: 0.9, blendMode: 'screen', imageSrc: `/images/models/layers/neck-${config.lapel}.png` },
  { key: 'hipPockets', z: 160, alpha: 0.9, blendMode: 'screen', imageSrc: `/images/models/layers/pocket-${config.pocket}.png` },
  { key: 'breastPocket', z: 165 },
  { key: 'buttons', z: 170 },
  { key: 'satinLapel', z: 180, alpha: 0.85, blendMode: 'screen', imageSrc: `/images/models/layers/satin-lapel-${config.lapel}.png` },
  { key: 'handkerchief', z: 185 },
  { key: 'stitching', z: 188 },
  { key: 'fxOverlay', z: 195, alpha: 0.06, fillColor: '#ffffff', blendMode: 'soft-light' },
];

export default function SuitVisualizer({ config = defaultConfig, useCanvasRenderer = false }: SuitVisualizerProps) {
  const [currentConfig, setCurrentConfig] = useState<SuitConfiguration>(config);
  const [activePanel, setActivePanel] = useState<PanelKey>('fabric');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [canvasError, setCanvasError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const renderTokenRef = useRef(0);

  const canvasLayers = useMemo(() => buildCanvasLayers(currentConfig), [currentConfig]);

  useEffect(() => {
    setCurrentConfig(config);
  }, [config]);

  const updateConfig = (key: keyof SuitConfiguration, value: string) => {
    setCurrentConfig((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!useCanvasRenderer) {
      setCanvasError(null);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      setCanvasError('Renderer initialization failed.');
      return;
    }

    let cancelled = false;
    const token = ++renderTokenRef.current;

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      const cached = imageCacheRef.current.get(src);
      if (cached) {
        return Promise.resolve(cached);
      }

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          imageCacheRef.current.set(src, img);
          resolve(img);
        };
        img.onerror = () => reject(new Error(`Failed to load layer asset: ${src}`));
        img.src = src;
      });
    };

    const render = async () => {
      setCanvasError(null);
      const width = canvas.width;
      const height = canvas.height;
      context.clearRect(0, 0, width, height);

      const orderedLayers = [...canvasLayers].sort((a, b) => a.z - b.z);

      for (const layer of orderedLayers) {
        if (cancelled || token !== renderTokenRef.current) {
          return;
        }

        context.save();
        context.globalAlpha = layer.alpha ?? 1;
        context.globalCompositeOperation = layer.blendMode ?? 'source-over';

        if (layer.fillColor) {
          context.fillStyle = layer.fillColor;
          context.fillRect(0, 0, width, height);
        }

        if (layer.imageSrc) {
          try {
            const image = await loadImage(layer.imageSrc);
            if (cancelled || token !== renderTokenRef.current) {
              context.restore();
              return;
            }
            context.drawImage(image, 0, 0, width, height);
          } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(error);
            }
          }
        }

        context.restore();
      }
    };

    render().catch(() => {
      if (!cancelled) {
        setCanvasError('Layer rendering failed.');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [canvasLayers, useCanvasRenderer]);

  const handleAiConsultation = async () => {
    setIsAnalyzing(true);
    setAiFeedback(null);

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const prompt = `身為 ALEXIS BESPOKE 的首席 AI 虛擬裁縫師，請分析這套西裝配置：
    版型: ${currentConfig.style.replace('-', ' ')}
    領型: ${currentConfig.lapel} lapel
    口袋: ${currentConfig.pocket} pocket
    布料: ${currentConfig.fabric.replace('-', ' ')}

    請用繁體中文給出一段精準、洗鍊（約3-4句話）的風格評鑑，並給出搭配襯衫與領帶的具體建議。
    語氣要求：極致奢華、專業權威、並帶有一點未來賽博龐克的科技感。不要使用過多的客套話，直接給出結論。`;

    const systemPrompt =
      'You are an elite AI master tailor. Keep responses sophisticated, slightly cyberpunk-flavored, and expert.';
    const delays = [1000, 2000, 4000, 8000, 16000];
    let attempt = 0;

    while (attempt < 5) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
          }),
        });

        if (!response.ok) {
          throw new Error('Gemini API Error');
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        setAiFeedback(text || '演算失敗，無法取得風格建議。');
        break;
      } catch {
        attempt += 1;
        if (attempt >= 5) {
          setAiFeedback('連線至核心神經網路失敗。請稍後重試。');
        } else {
          await new Promise((resolve) => setTimeout(resolve, delays[attempt - 1]));
        }
      }
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="relative min-h-[860px] bg-[#0a0a0a] text-[#f5f5f5] overflow-hidden">
      <header className="bg-[#0a0a0a]/80 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-white/10">
        <div className="flex justify-between items-center px-8 py-4 max-w-full mx-auto">
          <div className="text-2xl font-serif tracking-tight text-white">
            The Digital Atelier
            <span className="font-mono text-[10px] text-[#F42B26] ml-2 tracking-widest opacity-80">// Bespoke_Protocol_v.1.0</span>
          </div>
          <nav className="hidden md:flex items-center space-x-12">
            <a className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors" href="#">
              Collections
            </a>
            <a className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F42B26] border-b border-[#F42B26] pb-1" href="#">
              Configurator
            </a>
            <a className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors" href="#">
              Heritage
            </a>
          </nav>
          <div className="flex items-center space-x-6 text-white/70">
            <button className="hover:text-[#F42B26] transition-colors text-sm">person</button>
            <button className="hover:text-[#F42B26] transition-colors text-sm">shopping_bag</button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">
        <aside className="w-full lg:w-20 bg-[#141414] border-r border-white/5 flex lg:flex-col items-center py-8 z-40 shrink-0">
          <div className="flex lg:flex-col items-center space-y-10">
            <button className="flex flex-col items-center space-y-2 group">
              <span className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F42B26] text-white text-xs font-mono font-bold shadow-[0_0_15px_rgba(244,43,38,0.4)]">01</span>
              <span className="text-[8px] uppercase tracking-widest font-mono text-[#F42B26]">Design</span>
            </button>
            <button className="flex flex-col items-center space-y-2 group opacity-30">
              <span className="w-10 h-10 rounded-full flex items-center justify-center border border-white/20 text-xs font-mono text-white">02</span>
              <span className="text-[8px] uppercase tracking-widest font-mono text-white">Metrics</span>
            </button>
            <button className="flex flex-col items-center space-y-2 group opacity-30">
              <span className="w-10 h-10 rounded-full flex items-center justify-center border border-white/20 text-xs font-mono text-white">03</span>
              <span className="text-[8px] uppercase tracking-widest font-mono text-white">Confirm</span>
            </button>
          </div>
        </aside>

        <section className="flex-grow relative bg-[#0f0f0f] atelier-grid-bg overflow-hidden flex flex-col items-center justify-center">
          <div className="atelier-scanning-line" />

          <div className="absolute top-10 left-10 font-mono text-[9px] text-[#F42B26]/40 space-y-1 z-30">
            <p>{'> RENDERING: CYBER_CORE_v4'}</p>
            <p>{'> LIGHTING: NEON_VOID'}</p>
            <p>{'> STATUS: SYNC_STABLE'}</p>
          </div>

          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative max-h-[75%] aspect-[3/4] flex items-center justify-center">
              {useCanvasRenderer ? (
                <>
                  <canvas
                    ref={canvasRef}
                    aria-label="Suit layered render preview"
                    className="h-full w-auto object-contain"
                    width={800}
                    height={1067}
                  />
                  {canvasError && (
                    <div className="absolute bottom-2 left-2 right-2 border border-red-500/50 bg-black/70 p-2 text-[10px] font-mono text-red-300">
                      {canvasError}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* 1. 人台底影 */}
                  <img
                    alt="Mannequin"
                    className="absolute inset-0 h-full w-auto object-contain opacity-20 grayscale pointer-events-none"
                    src="/images/models/base-single-breasted.png"
                    style={{ zIndex: 10 }}
                  />

                  {/* 2. 西裝白模 + 布料紋理疊加 */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 107 }}>
                    {/* A. 白模底圖 */}
                    <img
                      alt="Jacket Base Mask"
                      className="absolute h-full w-auto object-contain"
                      src="/images/models/layers/jacket-base.png"
                    />

                    {/* B. 布料圖層：Multiply 混合 + CSS Mask 裁切成西裝形狀 */}
                    <img
                      alt="Fabric Texture"
                      src={`/fabrics/${currentConfig.fabric}.jpg`}
                      className="absolute h-full w-auto object-contain opacity-95"
                      style={{
                        mixBlendMode: 'multiply',
                        WebkitMaskImage: 'url(/images/models/layers/jacket-base.png)',
                        WebkitMaskSize: 'contain',
                        WebkitMaskPosition: 'center',
                        WebkitMaskRepeat: 'no-repeat',
                        maskImage: 'url(/images/models/layers/jacket-base.png)',
                        maskSize: 'contain',
                        maskPosition: 'center',
                        maskRepeat: 'no-repeat',
                      }}
                    />
                  </div>

                  {/* 3. 領型層 */}
                  <img
                    alt="Lapel Layer"
                    className="absolute inset-0 h-full w-auto object-contain opacity-90 pointer-events-none"
                    src={`/images/models/parts/lapel-${currentConfig.lapel}.png`}
                    style={{ zIndex: 119 }}
                  />
                </>
              )}

              <button
                onClick={() => setActivePanel('style')}
                className="absolute top-[28%] left-[42%] w-5 h-5 rounded-full bg-[#F42B26] flex items-center justify-center text-white atelier-hotspot-pulse z-[119] shadow-[0_0_15px_rgba(244,43,38,0.5)]"
              >
                <span className="text-[10px]">architecture</span>
              </button>
              <button
                onClick={() => setActivePanel('fabric')}
                className="absolute bottom-[40%] right-[35%] w-5 h-5 rounded-full bg-white flex items-center justify-center text-black atelier-hotspot-pulse z-[119]"
              >
                <span className="text-[10px]">texture</span>
              </button>
            </div>

          </div>
        </section>

        <aside className="w-full lg:w-[420px] bg-[#141414] border-l border-white/5 flex flex-col z-40">
          <div className="flex border-b border-white/5 font-mono text-[9px] tracking-[0.2em]">
            <button
              onClick={() => setActivePanel('fabric')}
              className={`flex-1 py-5 transition-colors ${
                activePanel === 'fabric' ? 'text-[#F42B26] border-b border-[#F42B26] bg-white/5' : 'text-white/40 hover:text-white'
              }`}
            >
              FABRIC
            </button>
            <button
              onClick={() => setActivePanel('style')}
              className={`flex-1 py-5 transition-colors ${
                activePanel === 'style' ? 'text-[#F42B26] border-b border-[#F42B26] bg-white/5' : 'text-white/40 hover:text-white'
              }`}
            >
              STYLE
            </button>
            <button
              onClick={() => setActivePanel('details')}
              className={`flex-1 py-5 transition-colors ${
                activePanel === 'details' ? 'text-[#F42B26] border-b border-[#F42B26] bg-white/5' : 'text-white/40 hover:text-white'
              }`}
            >
              ACCENTS
            </button>
          </div>

          <div className="flex-grow overflow-y-auto atelier-no-scrollbar p-8 space-y-10">
            <header>
              <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#F42B26] mb-2 block">Current Selection Archive</span>
              <h2 className="text-3xl font-serif text-white">Master Collection</h2>
              <p className="text-xs text-white/40 mt-3 leading-relaxed uppercase tracking-tight">Premium wools sourced from Northern Italian mills.</p>
            </header>

            <section className="space-y-4">
              {activePanel === 'fabric' && (
                <>
                  <h3 className="text-[9px] font-mono uppercase tracking-widest text-white/20">Signature Materials</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {fabricOptions.map((fabric) => {
                      const selected = currentConfig.fabric === fabric.key;
                      return (
                        <button
                          key={fabric.key}
                          onClick={() => updateConfig('fabric', fabric.key)}
                          className={`group transition-opacity ${selected ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                        >
                          <div
                            className={`aspect-square p-1 bg-[#0a0a0a] ${
                              selected
                                ? 'border-2 border-[#F42B26] shadow-[0_0_10px_rgba(244,43,38,0.3)]'
                                : 'border border-white/10'
                            }`}
                          >
                            <div className="w-full h-full" style={{ backgroundColor: fabric.swatch }} />
                          </div>
                          <span className={`text-[8px] font-mono block text-center mt-2 uppercase ${selected ? 'text-[#F42B26]' : 'text-white/70'}`}>
                            {fabric.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {activePanel === 'style' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[9px] font-mono uppercase tracking-widest text-white/20 mb-3">Suit Style</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {styleOptions.map((item) => {
                        const selected = currentConfig.style === item.key;
                        return (
                          <button
                            key={item.key}
                            onClick={() => updateConfig('style', item.key)}
                            className={`px-3 py-3 text-[10px] font-mono uppercase tracking-widest border transition-colors ${
                              selected ? 'border-[#F42B26] text-[#F42B26] bg-[#F42B26]/10' : 'border-white/10 text-white/70 hover:text-white'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[9px] font-mono uppercase tracking-widest text-white/20 mb-3">Lapel</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {lapelOptions.map((item) => {
                        const selected = currentConfig.lapel === item.key;
                        return (
                          <button
                            key={item.key}
                            onClick={() => updateConfig('lapel', item.key)}
                            className={`px-2 py-3 text-[10px] font-mono uppercase tracking-widest border transition-colors ${
                              selected ? 'border-[#F42B26] text-[#F42B26] bg-[#F42B26]/10' : 'border-white/10 text-white/70 hover:text-white'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[9px] font-mono uppercase tracking-widest text-white/20 mb-3">Pocket</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {pocketOptions.map((item) => {
                        const selected = currentConfig.pocket === item.key;
                        return (
                          <button
                            key={item.key}
                            onClick={() => updateConfig('pocket', item.key)}
                            className={`px-2 py-3 text-[10px] font-mono uppercase tracking-widest border transition-colors ${
                              selected ? 'border-[#F42B26] text-[#F42B26] bg-[#F42B26]/10' : 'border-white/10 text-white/70 hover:text-white'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activePanel === 'details' && (
                <div className="space-y-3 border border-white/10 bg-black/30 p-4">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-white/40">Current Protocol</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/80">STYLE: {currentConfig.style.replace('-', '_')}</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/80">LAPEL: {currentConfig.lapel}</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/80">POCKET: {currentConfig.pocket}</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/80">FABRIC: {currentConfig.fabric.replace('-', '_')}</p>
                </div>
              )}
            </section>

            <section className="bg-white/5 p-6 border-l border-[#F42B26]/50">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
                <h3 className="font-mono text-[9px] text-[#16a34a] uppercase tracking-widest">AI_ADVISOR_LOG // v.1.0</h3>
              </div>
              <div className="font-mono text-[10px] text-white/60 leading-relaxed uppercase space-y-2">
                <p>
                  {'> Protocol: '}<span className="text-white">Formal Executive</span>
                </p>
                <p>
                  {'> Analysis: '}
                  <span className="text-white">
                    {`${fabricOptions.find((item) => item.key === currentConfig.fabric)?.label || 'Selected'} wool paired with ${currentConfig.lapel} lapel signals authority.`}
                  </span>
                </p>
              </div>
            </section>
          </div>

          <div className="p-5 border-t border-white/5 bg-background">
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-[8px] font-mono uppercase tracking-widest text-white/30 block mb-0.5">Total Commission</span>
                <div className="text-xl font-serif text-white">$1,250.00</div>
              </div>
              <div className="text-right font-mono">
                <div className="text-[8px] text-lava-red border border-lava-red/30 px-1.5 py-0.5 uppercase tracking-tighter">4_Week_Build</div>
              </div>
            </div>

            <button className="w-full bg-lava-red text-white py-3.5 px-5 flex justify-between items-center group relative overflow-hidden transition-all hover:bg-white hover:text-black">
              <span className="relative z-10 font-mono font-bold tracking-[0.1em] uppercase text-[10px]">Initialize Order Protocol</span>
              <span className="relative z-10 text-sm">arrow_forward</span>
            </button>
          </div>
        </aside>
      </main>

      <footer className="bg-[#0f0f0f] border-t border-white/5 py-2 px-8 flex justify-between items-center">
        <div className="font-mono text-[8px] text-white/20 uppercase tracking-[0.3em]">System Status: Rendering_Active // Archive_v.26</div>
        <div className="flex space-x-6 font-mono text-[8px] text-white/20 uppercase tracking-widest">
          <a href="#" className="hover:text-[#F42B26] transition-colors">System_Log</a>
          <a href="#" className="hover:text-[#F42B26] transition-colors">Secure_Support</a>
        </div>
      </footer>

      {aiFeedback && (
        <div className="absolute bottom-6 left-6 right-6 md:left-auto md:w-96 bg-[#0a0a0a]/95 border border-[#16a34a] p-5 z-50 shadow-[0_0_20px_rgba(22,163,74,0.15)] backdrop-blur-md">
          <div className="flex justify-between items-start mb-3 border-b border-[#16a34a]/30 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
              <span className="font-mono text-[10px] text-[#16a34a] uppercase tracking-widest">SYS.AI_TAILOR_LOG</span>
            </div>
            <button onClick={() => setAiFeedback(null)} className="text-zinc-500 hover:text-red-500 transition-colors">
              X
            </button>
          </div>
          <div className="font-mono text-xs text-zinc-300 leading-relaxed max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {aiFeedback.split('\n').map((line, i) => (
              <p key={i} className="mb-2">{line}</p>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .atelier-grid-bg {
          background-image: radial-gradient(circle, #222 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .atelier-scanning-line {
          background: linear-gradient(to bottom, transparent 0%, rgba(244, 43, 38, 0.2) 50%, transparent 100%);
          height: 2px;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 20;
          pointer-events: none;
          animation: scan 3s linear infinite;
        }

        .atelier-no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .atelier-hotspot-pulse::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid #F42B26;
          animation: pulse 2s infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #16a34a;
          border-radius: 2px;
        }

        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
