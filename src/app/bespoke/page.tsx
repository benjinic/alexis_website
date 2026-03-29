'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// --- 1. 定義型別與圖層架構 ---
type Step = 'GARMENT' | 'FABRIC' | 'CUSTOMIZE'; // 新增：流程狀態
type GarmentType = 'SUIT' | 'JACKET' | 'TROUSERS' | 'VEST' | 'SHIRT';
type FabricCategory = string;

type FabricKey = string;
type FabricData = {
  id: FabricKey;
  name: string;
  imageUrl: string;
  composition: string;
  weight: string;
  price: number;
};

type LayerKey = 'mannequin' | 'shirt' | 'jacketBase' | 'lining' | 'shadows' | 'lapel' | 'hipPockets' | 'breastPocket' | 'buttons' | 'satinLapel' | 'handkerchief';
type Layer = { src: string; z: number };
type LayerMap = Record<LayerKey, Layer>;

// --- 約束引擎型別 ---
type SystemNode = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  restrict: string[];    // 選擇此項時，哪些 ID 必須被鎖定 (Disabled)
  autoChange: string[];  // 選擇此項時，強制連動選取哪些 ID
};

type ProtocolCategory = {
  id: string;
  title: string;
  options: SystemNode[];
};

// --- 系統終端資料庫 (約束引擎) ---
const TERMINAL_DATABASE: Record<string, ProtocolCategory> = {
  jacket_construction: {
    id: 'jacket_construction',
    title: 'JACKET_CONSTRUCTION',
    options: [
      { id: 'c_half_canvas', name: 'STRUCTURED HALF-CANVAS', description: '標準半毛襯，適合商務。', price: 0, imageUrl: '/assets/c-half.jpg', restrict: [], autoChange: [] },
      { id: 'c_full_canvas', name: 'PREMIUM FULL-CANVAS', description: '頂級全毛襯，極致立體感。', price: 100, imageUrl: '/assets/c-full.jpg', restrict: [], autoChange: [] },
      { id: 'c_uncanvassed', name: 'UNSTRUCTURED', description: '無結構休閒剪裁。', price: -50, imageUrl: '/assets/c-un.jpg', restrict: ['lapel_tuxedo'], autoChange: [] },
    ],
  },
  jacket_lapel: {
    id: 'jacket_lapel',
    title: 'LAPEL_ARCHITECTURE',
    options: [
      { id: 'lapel_notch', name: '3.5" NOTCH LAPEL', description: '經典平駁領。', price: 0, imageUrl: '/assets/l-notch.jpg', restrict: [], autoChange: [] },
      { id: 'lapel_peak', name: '4.0" PEAK LAPEL', description: '霸氣戧駁領。', price: 0, imageUrl: '/assets/l-peak.jpg', restrict: [], autoChange: [] },
      { id: 'lapel_tuxedo', name: 'SATIN SHAWL LAPEL', description: '緞面青果領 (禮服)。', price: 50, imageUrl: '/assets/l-shawl.jpg', restrict: ['pocket_patch'], autoChange: ['buttons_satin'] },
    ],
  },
};

// --- 2. 模擬資料庫 ---
const garmentOptions: GarmentType[] = ['SUIT', 'JACKET', 'TROUSERS', 'VEST', 'SHIRT'];

// --- 3. UI 元件 (Glitch 按鈕) ---
const TerminalOption = ({ label, isSelected, onClick, index }: { label: string, isSelected: boolean, onClick: () => void, index: string }) => (
  <button
    onClick={onClick}
    className={`
      group relative border transition-all duration-200 rounded-none flex flex-col items-center justify-center p-5
      ${isSelected ? 'border-[#F42B26] bg-[#1f1f1f] glow-lava' : 'border-[#2e2e2e] hover:border-[#595959] bg-[#0a0a0a]'}
    `}
  >
    <span className="absolute top-1 left-2 text-[9px] text-[#595959] font-['Space_Mono']">[{index}]</span>
    <span 
      className={`glitch-text text-[10px] font-['JetBrains_Mono'] tracking-[0.25em] uppercase mt-2 ${isSelected ? 'text-[#F42B26]' : 'text-[#8c8c8c] group-hover:text-[#f2f2f2]'}`}
      data-text={label}
    >
      {label}
    </span>
    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#F42B26] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left opacity-50" />
  </button>
);

export default function TerminalAtelier() {
  // --- 狀態管理 (漏斗邏輯) ---
  const [step, setStep] = useState<Step>('GARMENT'); // 預設停留在選擇品項
  const [selectedGarment, setSelectedGarment] = useState<GarmentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fabricDB, setFabricDB] = useState<Record<FabricCategory, FabricData[]>>({});
  const [fabricCategories, setFabricCategories] = useState<FabricCategory[]>([]);
  const [fabricCategory, setFabricCategory] = useState<FabricCategory>('');
  
  const [currentFabric, setCurrentFabric] = useState<FabricKey>('');

  // 約束引擎狀態
  const [selections, setSelections] = useState<Record<string, string>>({
    jacket_construction: 'c_half_canvas',
    jacket_lapel: 'lapel_notch',
  });
  const [activePanel, setActivePanel] = useState<string>('jacket_lapel');

  // 約束引擎：計算哪些選項被鎖定
  const lockedOptions = useMemo(() => {
    const locked = new Set<string>();
    Object.values(selections).forEach((selectedId) => {
      for (const category of Object.values(TERMINAL_DATABASE)) {
        const node = category.options.find((opt) => opt.id === selectedId);
        if (node) node.restrict.forEach((id) => locked.add(id));
      }
    });
    return locked;
  }, [selections]);

  // 選項變更處理（含 autoChange 連動邏輯）
  const handleSelect = (categoryId: string, option: SystemNode) => {
    if (lockedOptions.has(option.id)) return;
    setSelections((prev) => {
      const next = { ...prev, [categoryId]: option.id };
      // Auto-change：找出連動 ID 所屬的分類並強制覆寫
      option.autoChange.forEach((targetId) => {
        for (const cat of Object.values(TERMINAL_DATABASE)) {
          if (cat.options.some((o) => o.id === targetId)) {
            next[cat.id] = targetId;
          }
        }
      });
      return next;
    });
  };

  // 計算所有選項的附加總價
  const addonTotal = useMemo(() => {
    return Object.entries(selections).reduce((sum, [catId, selId]) => {
      const node = TERMINAL_DATABASE[catId]?.options.find((o) => o.id === selId);
      return sum + (node?.price ?? 0);
    }, 0);
  }, [selections]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 圖層狀態與 Canvas 渲染引擎 (省略詳細內容以凸顯架構，請保持你原本的寫法)
  const [layers, setLayers] = useState<LayerMap>({
    mannequin: { src: '/images/models/layers/mannequin.png', z: 10 },
    shirt: { src: '/images/models/layers/shirt.png', z: 20 },
    jacketBase: { src: '', z: 100 },
    shadows: { src: '/images/models/layers/shadows-global.png', z: 130 },
    lapel: { src: '', z: 150 },
    // ... 其他圖層
  } as LayerMap);

  const render = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sortedLayers = Object.entries(layers)
      .filter(([, layer]) => layer.src)
      .sort(([, a], [, b]) => a.z - b.z) as Array<[LayerKey, Layer]>;

    const loadImagesPromises = sortedLayers.map(([key, layer]) => new Promise<{ key: LayerKey; img: HTMLImageElement | null }>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ key, img });
      img.onerror = () => resolve({ key, img: null });
      img.src = layer.src;
    }));

    // 前面的 Promise.all 下載圖片邏輯保持不變...
    const loadedImages = await Promise.all(loadImagesPromises);

    // 5. 嚴格依照排序，瞬間將所有圖層畫上 Canvas
    loadedImages.forEach(({ key, img }) => {
      if (!img) return;

      // 每次繪製前，先將混合模式還原為預設的覆蓋模式 (Normal)
      ctx.globalCompositeOperation = 'source-over';
      // 預設不透明
      ctx.globalAlpha = 1.0;

      // 針對特定圖層的特殊處理 (Protocol Overrides)
      if (key === 'mannequin') {
        // 假人模特兒稍微半透明，呈現幽靈般的科技感
        ctx.globalAlpha = 0.5;
      }

      // 最關鍵的魔法：陰影層必須使用色彩增值 (Multiply)
      if (key === 'shadows') {
        ctx.globalCompositeOperation = 'multiply';
        // 如果陰影太重，可以微調 Alpha 值：ctx.globalAlpha = 0.8;
      }

      // 畫上畫布
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    });
  }, [layers]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const q = query(collection(db, 'inventory'), where('isOnline', '==', true));
        const querySnapshot = await getDocs(q);

        const groupedData: Record<FabricCategory, FabricData[]> = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const cat = ((data.category as string) || 'OTHER').toUpperCase();

          if (!groupedData[cat]) groupedData[cat] = [];

          groupedData[cat].push({
            id: doc.id,
            name: (data.name as string) || 'UNKNOWN_MATERIAL',
            imageUrl: (data.imageUrl as string) || '/images/placeholder-fabric.jpg',
            composition: (data.description as string) || 'DATA_MISSING',
            weight: (data.weight as string) || 'STANDARD',
            price: (data.retailPrice as number) || 0,
          });
        });

        setFabricDB(groupedData);

        const categories = Object.keys(groupedData);
        setFabricCategories(categories);

        if (categories.length > 0) {
          setFabricCategory(categories[0]);
          if (groupedData[categories[0]].length > 0) {
            setCurrentFabric(groupedData[categories[0]][0].id);
          }
        }

        setTimeout(() => setIsLoading(false), 800);
      } catch (error) {
        console.error('Firebase 讀取錯誤:', error);
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const currentLapel = selections.jacket_lapel?.replace('lapel_', '') || '';
  const currentPocket = selections.jacket_pocket?.replace('pocket_', '') || '';
  const currentButton = selections.jacket_buttons?.replace('buttons_', '') || '';
  const currentLining = selections.jacket_lining?.replace('lining_', '') || '';

  // ==========================================
  // [ ASSET_INTEGRATION ] 核心：動態圖層聚合器
  // 監聽所有客製化參數，並即時更新 Canvas 圖層陣列
  // ==========================================
  useEffect(() => {
    // 取得當前 Firebase 選中的布料照片 URL
    const baseFabricUrl = fabricDB[fabricCategory]?.find((f) => f.id === currentFabric)?.imageUrl || '/images/placeholder-fabric.jpg';

    // 組合新的圖層清單 (嚴格依照 Z 軸數值排序)
    const newLayers: LayerMap = {
      // 1. 底層假人模台 (Z: 10)
      mannequin: { src: '/images/layers/base_mannequin.png', z: 10 },
      shirt: { src: '', z: 20 },

      // 2. 布料底層 (Z: 100)
      jacketBase: { src: baseFabricUrl, z: 100 },

      // 3. 全局立體陰影層 (Z: 130)
      lining: { src: currentLining ? `/images/layers/lining_${currentLining}.png` : '', z: 105 },
      shadows: { src: '/images/layers/jacket_shadows.png', z: 130 },

      // 4. 動態注入客製化細節
      lapel: { src: '', z: 150 },
      hipPockets: { src: '', z: 160 },
      breastPocket: { src: '', z: 165 },
      buttons: { src: '', z: 170 },
      satinLapel: { src: selections.jacket_lapel === 'lapel_tuxedo' ? '/images/layers/lapel_tuxedo.png' : '', z: 180 },
      handkerchief: { src: '', z: 185 },
    };

    if (currentLapel) {
      newLayers.lapel = { src: `/images/layers/lapel_${currentLapel}.png`, z: 150 };
    }

    if (currentPocket) {
      newLayers.hipPockets = { src: `/images/layers/pocket_${currentPocket}.png`, z: 160 };
    }

    if (currentButton) {
      newLayers.buttons = { src: `/images/layers/button_${currentButton}.png`, z: 170 };
    }

    setLayers(newLayers);
  }, [fabricCategory, currentFabric, currentLapel, currentPocket, currentButton, currentLining, selections.jacket_lapel, fabricDB]);

  useEffect(() => { if (step === 'CUSTOMIZE') render(); }, [layers, step, render]);

  // ==========================================
  // VIEW 0: Loading 載入畫面 (Terminal Noir 風格)
  // ==========================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f2f2f2] flex flex-col items-center justify-center font-mono">
        <div className="flex flex-col items-start">
          <span className="text-[#F42B26] text-xs tracking-widest mb-2 animate-pulse">&gt; ESTABLISHING_SECURE_CONNECTION...</span>
          <span className="text-[#8c8c8c] text-[10px] tracking-widest">&gt; FETCHING_INVENTORY_DATABANKS [FIREBASE]</span>
          <span className="text-[#8c8c8c] text-[10px] tracking-widest mt-1">&gt; SYNCING_MATERIALS...</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: 選擇品項 (BESPOKE PAGE)
  // ==========================================
  if (step === 'GARMENT') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f2f2f2] flex flex-col items-center justify-center font-mono relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,hsl(0_85%_55%/0.05),transparent)] h-[2px] w-full animate-[scan_4s_linear_infinite] pointer-events-none z-0" />
        
        <div className="z-10 flex flex-col items-center w-full max-w-2xl px-8">
          <span className="text-[#F42B26] text-[10px] tracking-widest mb-4 animate-pulse">&gt; SYS.AWAITING_INPUT</span>
          <h1 className="terminal-heading text-4xl mb-12 text-white">SELECT_PROTOCOL</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {garmentOptions.map((garment, i) => (
              <TerminalOption 
                key={garment} index={`0${i+1}`} label={garment} isSelected={selectedGarment === garment}
                onClick={() => {
                  setSelectedGarment(garment);
                  setTimeout(() => setStep('FABRIC'), 300); // 微小延遲，增加按鈕確認感
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: 選擇布料 (FABRIC PAGE - 從 Firebase 渲染)
  // ==========================================
  if (step === 'FABRIC') {
    const selectedFabricData = fabricDB[fabricCategory]?.find((f) => f.id === currentFabric) || fabricDB[fabricCategories[0]]?.[0];

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f2f2f2] flex flex-col font-mono pt-20 px-8 pb-8">
        <header className="mb-8 border-b border-[#2e2e2e] pb-6 flex justify-between items-end">
          <div>
            <button onClick={() => setStep('GARMENT')} className="text-[#8c8c8c] hover:text-[#F42B26] text-[10px] tracking-widest mb-4 block transition-colors">
              &lt; ABORT_AND_RETURN
            </button>
            <h1 className="terminal-heading text-3xl text-white">INITIALIZE_MATERIAL</h1>
          </div>
          <span className="text-[#16a34a] text-[10px] tracking-widest uppercase animate-pulse">
            DATABASE_SYNCED
          </span>
        </header>

        <div className="flex gap-8 flex-grow overflow-hidden">

          {/* 1. 最左側：材質大分類 */}
          <aside className="w-48 border-r border-[#2e2e2e] pr-4 flex flex-col gap-2">
            {fabricCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFabricCategory(cat)}
                className={`text-[10px] tracking-[0.2em] w-full text-left py-3 border-l-2 pl-4 transition-all duration-200
                  ${fabricCategory === cat ? 'border-[#F42B26] text-white bg-[#141414]' : 'border-transparent text-[#595959] hover:text-[#8c8c8c] hover:bg-[#0a0a0a]'}`}
              >
                [ {cat} ]
              </button>
            ))}
          </aside>

          {/* 2. 中間：布料圖庫網格 (捲動區) */}
          <main className="flex-grow overflow-y-auto pr-4 grid grid-cols-2 lg:grid-cols-3 gap-4 content-start pb-20">
            {fabricDB[fabricCategory]?.map((fabric) => (
              <button
                key={fabric.id}
                onClick={() => setCurrentFabric(fabric.id)}
                className={`
                  group relative border transition-all duration-300 bg-[#141414] p-3 flex flex-col rounded-none
                  ${currentFabric === fabric.id ? 'border-[#F42B26] glow-lava' : 'border-[#2e2e2e] hover:border-[#595959]'}
                `}
              >
                <div className="w-full aspect-[4/5] mb-3 bg-[#1f1f1f] overflow-hidden flex items-center justify-center">
                  {fabric.imageUrl !== '/images/placeholder-fabric.jpg' ? (
                    <img
                      src={fabric.imageUrl}
                      alt={fabric.name}
                      className={`w-full h-full object-cover transition-transform duration-700 ${currentFabric === fabric.id ? 'scale-105' : 'group-hover:scale-105 opacity-70 group-hover:opacity-100'}`}
                    />
                  ) : (
                    <span className="text-[#595959] text-[9px] tracking-widest text-center">NO_IMAGE<br />DATA</span>
                  )}
                </div>
                <div className="text-left w-full">
                  <span className={`block text-[10px] tracking-[0.2em] mb-1 truncate ${currentFabric === fabric.id ? 'text-[#F42B26]' : 'text-white'}`}>
                    {fabric.name}
                  </span>
                  <span className="block text-[9px] text-[#595959] font-['Space_Mono'] tracking-widest">
                    ${fabric.price.toLocaleString()}
                  </span>
                </div>
              </button>
            ))}
          </main>

          {/* 3. 最右側：布料規格終端機面板 & 確認按鈕 */}
          <aside className="w-[300px] flex flex-col justify-between border border-[#2e2e2e] bg-[#141414] p-6">
            {selectedFabricData && (
              <div>
                <span className="text-[#F42B26] text-[9px] tracking-widest block mb-6 animate-pulse">&gt; MATERIAL_SCANNED</span>
                <h2 className="text-xl font-['Roboto_Condensed'] font-bold text-white mb-8 tracking-widest uppercase">
                  {selectedFabricData.name}
                </h2>
                <div className="space-y-4 text-[10px] tracking-widest font-['Space_Mono']">
                  <div className="flex justify-between border-b border-[#2e2e2e] pb-2">
                    <span className="text-[#595959]">COMPOSITION</span>
                    <span className="text-white text-right max-w-[60%]">{selectedFabricData.composition}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#2e2e2e] pb-2">
                    <span className="text-[#595959]">BASE_PRICE</span>
                    <span className="text-white">${selectedFabricData.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 確認並進入 3D/2D 引擎 */}
            <button
              onClick={() => setStep('CUSTOMIZE')}
              className="w-full bg-[#F42B26] hover:bg-[#A40000] text-white py-4 rounded-none mt-8"
            >
              <span className="font-['JetBrains_Mono'] font-bold tracking-[0.25em] text-[10px] uppercase">
                MOUNT_MATERIAL
              </span>
            </button>
          </aside>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: 細節訂製 (CUSTOMIZE PAGE - Canvas 引擎)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f2f2f2] flex flex-col font-mono">
      {/* HEADER */}
      <header className="bg-[#141414] border-b border-[#2e2e2e] w-full z-50 fixed top-0">
        <div className="flex justify-between items-center px-8 py-5">
          <div className="flex items-center gap-6">
            <button onClick={() => setStep('FABRIC')} className="text-[#8c8c8c] hover:text-[#F42B26] text-[10px] tracking-widest border border-[#2e2e2e] px-3 py-1">
              &lt; BACK
            </button>
            <div>
              <h1 className="terminal-heading text-xl text-white">ALEXIS BESPOKE</h1>
              <span className="text-[9px] uppercase tracking-widest text-[#F42B26] mt-1 block">
                &gt; {selectedGarment} // {currentFabric}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row h-screen overflow-hidden pt-[81px]">
        {/* 左側：Canvas 預覽區 */}
        <section className="flex-grow relative bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
          <canvas ref={canvasRef} className="w-full max-w-[500px] h-auto aspect-[3/4] z-10 relative object-contain" width={800} height={1067} />
          <div className="absolute bottom-8 left-8 text-[9px] text-[#8c8c8c] tracking-widest z-20">
            RENDER_ENGINE: <span className="text-[#16a34a]">ACTIVE</span>
          </div>
        </section>

        {/* =========================================
            右側：款式控制面板 (MASTER_PROTOCOL_OVERRIDE)
        ========================================= */}
        <aside className="w-full lg:w-[450px] bg-[#141414] border-l border-[#2e2e2e] flex flex-col h-screen z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] font-mono">
          <div className="py-5 text-[#F42B26] border-b-2 border-[#F42B26] bg-[#1f1f1f] text-center tracking-[0.25em] text-[10px] flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#F42B26] rounded-none animate-pulse" />
            [ MASTER_PROTOCOL_OVERRIDE ]
          </div>

          {/* 手風琴選項列表 */}
          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {Object.values(TERMINAL_DATABASE).map((category, index) => {
              const isOpen = activePanel === category.id;
              const currentSelectedId = selections[category.id];
              const currentSelectedNode = category.options.find((opt) => opt.id === currentSelectedId);

              return (
                <div key={category.id} className="border-b border-[#2e2e2e]">
                  {/* 面板標題 */}
                  <button
                    onClick={() => setActivePanel(isOpen ? '' : category.id)}
                    className="w-full p-6 flex justify-between items-center hover:bg-[#1a1a1a] transition-colors"
                  >
                    <div className="text-left">
                      <span className="text-[10px] text-[#8c8c8c] tracking-[0.25em] block mb-1 font-['JetBrains_Mono']">
                        0{index + 1} // {category.title}
                      </span>
                      <span className={`text-[12px] tracking-widest font-['JetBrains_Mono'] ${isOpen ? 'text-[#F42B26]' : 'text-white'}`}>
                        {currentSelectedNode?.name || 'AWAITING_INPUT'}
                      </span>
                    </div>
                    <span className="text-[#595959] font-['Space_Mono'] text-[10px]">{isOpen ? '[-]' : '[+]'}</span>
                  </button>

                  {/* 展開的選項網格 */}
                  {isOpen && (
                    <div className="p-6 pt-0 grid grid-cols-2 gap-3 bg-[#0a0a0a] shadow-inner">
                      {category.options.map((opt) => {
                        const isSelected = currentSelectedId === opt.id;
                        const isLocked = lockedOptions.has(opt.id);

                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleSelect(category.id, opt)}
                            disabled={isLocked}
                            className={`
                              relative p-4 border rounded-none flex flex-col items-center transition-all duration-300
                              ${isSelected ? 'border-[#F42B26] bg-[#1f1f1f] glow-lava' : 'border-[#2e2e2e] bg-[#141414]'}
                              ${isLocked ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:border-[#595959]'}
                            `}
                          >
                            {isLocked && (
                              <div className="absolute inset-0 flex items-center justify-center z-10 text-[#F42B26] text-3xl opacity-50">⊘</div>
                            )}
                            <div className="w-16 h-16 bg-[#1f1f1f] mb-3 overflow-hidden">
                              <img src={opt.imageUrl} alt={opt.name} className="w-full h-full object-cover opacity-80" />
                            </div>
                            <span className={`text-[9px] tracking-widest text-center font-['JetBrains_Mono'] ${isSelected ? 'text-[#F42B26]' : 'text-[#8c8c8c]'}`}>
                              {opt.name}
                            </span>
                            {opt.price !== 0 && (
                              <span className="text-[8px] mt-2 text-[#595959] font-['Space_Mono']">
                                {opt.price > 0 ? '+' : '-'}${Math.abs(opt.price)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 底部 TOTAL_ESTIMATE & COMPILE_ORDER */}
          <div className="p-8 bg-[#0a0a0a] border-t border-[#2e2e2e]">
            <div className="flex justify-between items-end mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#8c8c8c] tracking-[0.25em] font-['Space_Mono'] mb-1">TOTAL_ESTIMATE</span>
                <span className="text-[9px] text-[#595959] tracking-widest font-['Space_Mono']">
                  BASE + ADDONS ({addonTotal >= 0 ? '+' : ''}{addonTotal})
                </span>
              </div>
              <span className="text-3xl font-['Roboto_Condensed'] font-black text-white tracking-widest">
                ${(1250 + addonTotal).toLocaleString()}<span className="text-sm text-[#F42B26]">.00</span>
              </span>
            </div>
            <button className="w-full bg-[#F42B26] hover:bg-[#A40000] text-white py-5 transition-colors rounded-none flex items-center justify-center gap-3">
              <span className="font-['JetBrains_Mono'] font-bold tracking-[0.25em] text-xs uppercase">COMPILE_ORDER</span>
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}