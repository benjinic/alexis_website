'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Step, GarmentType, FabricData, TERMINAL_DATABASE } from '@/lib/bespoke-config';

import StepNavigator from '@/components/bespoke/StepNavigator';
import VisualEngine from '@/components/bespoke/VisualEngine';
import ConfigSidebar from '@/components/bespoke/ConfigSidebar';
import FabricLab from '@/components/bespoke/FabricLab';

// 終端機按鈕 UI (用於第一步)
const TerminalOption = ({ label, isSelected, isLocked, onClick, index }: { label: string, isSelected: boolean, isLocked?: boolean, onClick: () => void, index: string }) => (
  <button
    onClick={onClick}
    disabled={isLocked}
    className={`group relative border transition-all duration-200 rounded-none flex flex-col items-center justify-center p-4 ${isSelected ? 'border-[#F42B26] bg-[#1f1f1f] shadow-[0_0_15px_rgba(244,43,38,0.2)]' : 'border-[#2e2e2e] bg-[#0a0a0a]'} ${isLocked ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:border-[#595959]'}`}
  >
    {isLocked && <div className="absolute inset-0 flex items-center justify-center z-10 text-[#F42B26] text-3xl opacity-50">⊘</div>}
    <span className="absolute top-1 left-2 text-[9px] text-[#595959] font-mono">[{index}]</span>
    <span className={`text-[9px] font-mono tracking-[0.25em] uppercase mt-2 text-center ${isSelected ? 'text-[#F42B26]' : 'text-[#8c8c8c] group-hover:text-[#f2f2f2]'}`}>{label}</span>
    {!isLocked && <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#F42B26] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left opacity-50" />}
  </button>
);

const garmentOptions: GarmentType[] = ['SUIT', 'JACKET', 'TROUSERS', 'VEST', 'SHIRT'];

// useSearchParams 的組件依 Next.js 規範需包裝在 Suspense 中，見下方 export default
function BespokeFlow() {
  const searchParams = useSearchParams();
  // 從 URL 帶入的預選布料 (例如由 /fabric-lab 的 「BEGIN BESPOKE PROTOCOL」 帶 ?fabricId= 過來)
  const initialFabricId = searchParams?.get('fabricId') || undefined;

  // === 狀態管理 ===
  const [step, setStep] = useState<Step>('GARMENT');
  const [selectedGarment, setSelectedGarment] = useState<GarmentType | null>(null);

  // 布料選擇結果 (由 FabricLab 元件在 MOUNT_MATERIAL 時回填)
  const [selectedFabricData, setSelectedFabricData] = useState<FabricData | null>(null);

  // 客製化選項 (與 TERMINAL_DATABASE 連動)
  const [selections, setSelections] = useState<Record<string, string>>({
    lapel: 'notch_35',
    construction: 'half_canvas',
    pocket: 'pocket_flap',
    button: 'button_horn',
    lining: 'lining_obsidian',
    waistband: 'waistband_extended_tab',
    hem: 'hem_plain'
  });

  // === 引擎：約束邏輯 (鎖定衝突選項) ===
  const lockedOptions = useMemo(() => {
    const locked = new Set<string>();
    Object.values(selections).forEach((selectedId) => {
      Object.values(TERMINAL_DATABASE).forEach((category) => {
        const node = category.options.find((opt) => opt.id === selectedId);
        if (node?.restrict) node.restrict.forEach((id) => locked.add(id));
      });
    });
    return locked;
  }, [selections]);

  const handleSelectOption = (categoryId: string, optionId: string) => {
    if (lockedOptions.has(optionId)) return;
    setSelections((prev) => ({ ...prev, [categoryId]: optionId }));
  };

  // === 畫面渲染 ===

  // VIEW 1: 選擇款式 (GARMENT)
  if (step === 'GARMENT') {
    return (
      // ⚠️ 關鍵修正：加入 pt-[100px] 將內容往下推，避開全域的導航列
      <div className="min-h-screen bg-[#0a0a0a] text-[#f2f2f2] flex flex-col items-center justify-center font-mono relative overflow-hidden pt-[100px]">
        <div className="z-10 flex flex-col items-center w-full max-w-2xl px-8">
          <span className="text-[#F42B26] text-[10px] tracking-widest mb-4 animate-pulse">&gt; SYS.AWAITING_INPUT</span>
          <h1 className="text-4xl mb-12 text-white font-serif tracking-widest uppercase">Select Protocol</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {garmentOptions.map((garment, i) => (
              <TerminalOption key={garment} index={`0${i + 1}`} label={garment} isSelected={selectedGarment === garment} onClick={() => { setSelectedGarment(garment); setTimeout(() => setStep('FABRIC'), 300); }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // VIEW 2: 選擇布料 (FABRIC) — 由共用的 FabricLab 元件負責 Firestore 抓取與瀏覽 UI
  if (step === 'FABRIC') {
    return (
      <FabricLab
        onBack={() => setStep('GARMENT')}
        onMount={(fabric) => {
          setSelectedFabricData(fabric);
          setStep('CUSTOMIZE');
        }}
        initialFabricId={initialFabricId}
      />
    );
  }

  // VIEW 3: 進入三欄式配置器 (CUSTOMIZE)
  return (
    <div className="relative z-10 bg-[#0a0a0a] text-[#f5f5f5] min-h-screen flex flex-col font-sans overflow-hidden pt-[80px]">
      
      {/* 簡約版工具列 (顯示目前的 Protocol) */}
      <div className="bg-[#141414] border-b border-[#2e2e2e] px-8 py-3 flex justify-between items-center relative z-20">
         <div className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
           Protocol: {selectedGarment} // {selectedFabricData?.name} // Ref {selectedFabricData?.itemCode}
         </div>
         <button onClick={() => setStep('FABRIC')} className="text-[10px] font-mono text-[#8c8c8c] hover:text-[#F42B26] transition-colors">
           &lt; BACK TO FABRIC
         </button>
      </div>

      <main className="flex-grow flex flex-col lg:flex-row h-[calc(100vh-120px)] overflow-hidden relative z-10">
        {/* 左：步驟導航組件 */}
        <StepNavigator />
        
        <VisualEngine images={selectedFabricData?.imageGallery || []} />
        
        {/* 右：側邊設定面板組件 */}
        <ConfigSidebar 
          selections={selections}
          handleSelectOption={handleSelectOption}
          lockedOptions={lockedOptions}
          basePrice={selectedFabricData?.price || 0}
          selectedFabricName={selectedFabricData?.name || ''}
          selectedFabricItemCode={selectedFabricData?.itemCode || ''}
        />
      </main>
    </div>
  );
}

export default function BespokePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <BespokeFlow />
    </Suspense>
  );
}