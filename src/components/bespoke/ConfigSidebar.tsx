'use client';

import { useState, useMemo } from 'react';
import { TERMINAL_DATABASE } from '@/lib/bespoke-config';

// 1. 修正 Interface，完美對接 page.tsx 傳過來的屬性
interface ConfigSidebarProps {
  selections: Record<string, string>;
  handleSelectOption: (categoryId: string, optionId: string) => void;
  lockedOptions: Set<string>;
  basePrice: number;
  selectedFabricName: string;
  selectedFabricItemCode: string;
}

// 2. 匯入您原本的終端機按鈕 UI
const TerminalOption = ({ option, isSelected, isLocked, onClick }: { option: (typeof TERMINAL_DATABASE)[string]['options'][number], isSelected: boolean, isLocked?: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    disabled={isLocked}
    className={`
      group relative border transition-all duration-200 flex flex-col items-center justify-center p-4 w-full
      ${isSelected ? 'border-[#F42B26] bg-[#1f1f1f]' : 'border-[#2e2e2e] bg-[#0a0a0a]'}
      ${isLocked ? 'opacity-30 cursor-not-allowed' : 'hover:border-[#595959]'}
    `}
  >
    <img
      src={option.img || option.imageUrl || '/images/placeholder-fabric.jpg'}
      alt={option.name}
      className="w-16 h-16 mb-3 opacity-80 group-hover:opacity-100 transition-opacity object-contain"
      onError={(event) => {
        event.currentTarget.style.display = 'none';
      }}
    />

    <span className={`text-[10px] font-mono tracking-widest text-center ${isSelected ? 'text-[#F42B26]' : 'text-white'}`}>
      {option.name}
    </span>

    {option.price > 0 && (
      <span className="text-[9px] text-[#8c8c8c] mt-1">+${option.price}</span>
    )}
  </button>
);

export default function ConfigSidebar({ selections, handleSelectOption, lockedOptions, basePrice, selectedFabricName, selectedFabricItemCode }: ConfigSidebarProps) {
  // 狀態管理：手風琴面板與 AI 顧問
  const [activePanel, setActivePanel] = useState<string>('lapel');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const getOptionName = (categoryId: string, optionId?: string) => {
    if (!optionId) return 'AWAITING_INPUT';
    return TERMINAL_DATABASE[categoryId]?.options.find((option) => option.id === optionId)?.name || optionId;
  };

  // 3. 動態價格計算
  const totalEstimate = useMemo(() => {
    let total = basePrice;
    Object.entries(selections).forEach(([catId, optId]) => {
      const opt = TERMINAL_DATABASE[catId]?.options.find((o) => o.id === optId);
      if (opt) total += opt.price;
    });
    return total;
  }, [basePrice, selections]);

  // AI 顧問觸發
  const handleAiConsultation = () => {
    setIsAnalyzing(true);
    setAiFeedback(null);
    setTimeout(() => {
      setAiFeedback(`> 系統分析完成。\n> 當前配置：${selections.lapel} 搭配 ${selections.pocket}。\n> 該組合符合高階商務禮儀協定。`);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <aside className="w-full lg:w-[450px] bg-[#141414] border-l border-[#2e2e2e] flex flex-col z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
      
      {/* 面板標題 */}
      <div className="flex border-b border-[#2e2e2e] text-[10px] tracking-[0.25em] uppercase font-mono">
        <div className="flex-1 py-5 text-[#F42B26] border-b-2 border-[#F42B26] bg-[#1f1f1f] text-center flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#F42B26] rounded-none animate-pulse"></span>
          [ PROTOCOL_DETAILS ]
        </div>
      </div>

      {/* 手風琴選項區 (依照 TERMINAL_DATABASE 動態生成) */}
      <div className="flex-grow overflow-y-auto pb-8 custom-scrollbar">
        <style>{`.custom-scrollbar::-webkit-scrollbar { display: none; }`}</style>

        <div className="bg-[#141414] p-4 border border-[#2e2e2e] mb-6 mx-6 mt-6">
          <h4 className="text-[11px] text-[#8c8c8c] font-mono mb-2">CURRENT_PROTOCOL (目前配置)</h4>
          <ul className="text-[12px] text-white space-y-1">
            <li>Fabric: {selectedFabricName || 'UNASSIGNED'}</li>
            <li>Item Code: {selectedFabricItemCode || 'UNASSIGNED'}</li>
            <li>Lapel: {getOptionName('lapel', selections.lapel)}</li>
            <li>Construction: {getOptionName('construction', selections.construction)}</li>
            <li>Pocket: {getOptionName('pocket', selections.pocket)}</li>
            <li>Button: {getOptionName('button', selections.button)}</li>
            <li>Lining: {getOptionName('lining', selections.lining)}</li>
            <li>Waistband: {getOptionName('waistband', selections.waistband)}</li>
            <li>Hem: {getOptionName('hem', selections.hem)}</li>
          </ul>
        </div>
        
        {Object.values(TERMINAL_DATABASE).map((category, index) => {
          const isOpen = activePanel === category.id;
          const currentSelectedId = selections[category.id];
          const currentSelectedNode = category.options.find((opt) => opt.id === currentSelectedId);

          return (
            <div key={category.id} className="border-b border-[#2e2e2e]">
              {/* 手風琴 Header */}
              <button 
                onClick={() => setActivePanel(isOpen ? '' : category.id)} 
                className="w-full p-6 flex justify-between items-center hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="text-left">
                  <span className="text-[10px] text-[#8c8c8c] tracking-[0.25em] block mb-1 font-mono">0{index + 1} // {category.title}</span>
                  <span className={`text-[12px] tracking-widest font-mono ${isOpen ? 'text-[#F42B26]' : 'text-white'}`}>
                    {currentSelectedNode?.name || 'AWAITING_INPUT'}
                  </span>
                </div>
                <span className="text-[#595959] font-mono">{isOpen ? '[-]' : '[+]'}</span>
              </button>

              {/* 手風琴 Content (終端按鈕) */}
              {isOpen && (
                <div className="p-6 pt-0 grid grid-cols-2 gap-3 bg-[#0a0a0a] shadow-inner">
                  {category.options.map((opt) => (
                    <TerminalOption
                      key={opt.id}
                      option={opt}
                      isSelected={currentSelectedId === opt.id}
                      isLocked={lockedOptions.has(opt.id)}
                      onClick={() => handleSelectOption(category.id, opt.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* AI 顧問面板 */}
        <div className="p-6">
          <button 
            onClick={handleAiConsultation} 
            disabled={isAnalyzing} 
            className="w-full py-4 border border-[#16a34a] text-[#16a34a] hover:bg-[#16a34a]/10 font-mono text-[9px] uppercase tracking-widest transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isAnalyzing && <span className="w-1.5 h-1.5 bg-[#16a34a] rounded-full animate-ping"></span>}
            {isAnalyzing ? 'ANALYZING PROTOCOL...' : 'RUN AI DIAGNOSTIC'}
          </button>

          {aiFeedback && (
            <div className="mt-4 p-4 border border-[#16a34a]/30 bg-[#16a34a]/5">
               <div className="font-mono text-[10px] text-[#16a34a] leading-relaxed">
                 {aiFeedback.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部結帳與總價 */}
      <div className="p-8 bg-[#0a0a0a] border-t border-[#2e2e2e]">
        <div className="flex justify-between items-end mb-6">
          <span className="text-[10px] text-[#8c8c8c] tracking-[0.25em] font-mono">TOTAL_ESTIMATE</span>
          <span className="text-3xl font-serif font-black text-white tracking-widest">
            ${totalEstimate.toLocaleString()}<span className="text-sm text-[#F42B26]">.00</span>
          </span>
        </div>
        
        <button className="w-full bg-[#F42B26] hover:bg-[#A40000] text-white py-5 transition-colors rounded-none flex items-center justify-center gap-3">
          <span className="font-mono font-bold tracking-[0.25em] text-xs uppercase">COMPILE_ORDER</span>
        </button>
      </div>
    </aside>
  );
}