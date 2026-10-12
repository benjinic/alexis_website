'use client';

export default function StepNavigator() {
  return (
    <aside
      className="relative w-full lg:w-20 bg-white border-r border-gray-200 flex lg:flex-col items-center py-8 z-[40] shrink-0 shadow-[2px_0_10px_rgba(0,0,0,0.02)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex lg:flex-col items-center space-y-10 relative z-10 w-full">
        <button
          className="flex flex-col items-center space-y-2 group"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F42B26] text-white text-xs font-mono font-bold shadow-[0_0_10px_rgba(244,43,38,0.2)]">01</span>
          <span className="text-[8px] uppercase tracking-widest font-mono text-[#F42B26] font-bold">Design</span>
        </button>
        <button
          className="flex flex-col items-center space-y-2 group transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-xs font-mono text-gray-400 group-hover:border-gray-500 group-hover:text-gray-600 transition-colors bg-white">02</span>
          <span className="text-[8px] uppercase tracking-widest font-mono text-gray-400 group-hover:text-gray-600 transition-colors">Metrics</span>
        </button>
      </div>
    </aside>
  );
}