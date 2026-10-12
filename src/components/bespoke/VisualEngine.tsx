'use client';

import { useEffect, useState } from 'react';

interface VisualEngineProps {
  images: string[];
}

export default function VisualEngine({ images }: VisualEngineProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const safeImages = images.filter((image) => image.trim().length > 0);
  const galleryImages = safeImages.length > 0 ? safeImages : ['/images/placeholder-suit.jpg'];
  const mainImage = galleryImages[activeIndex];

  return (
    <section className="flex-grow relative bg-[#0f0f0f] overflow-hidden flex items-center justify-center py-10 px-4">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #222 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      <div className="absolute top-10 right-10 font-mono text-[9px] text-[#F42B26]/40 space-y-1 z-30 text-right">
        <p>{'> RENDER_MODE: MULTI_VIEW_ACTIVE'}</p>
        <p>{'> STATUS: SYNC_STABLE'}</p>
      </div>

      <div className="relative w-full h-full flex flex-row items-center max-w-4xl z-10 gap-6">
        <div className="w-[70px] shrink-0 h-full flex flex-col justify-center gap-3 overflow-y-auto custom-scrollbar">
          <style>{`.custom-scrollbar::-webkit-scrollbar { display: none; }`}</style>

          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-full aspect-[3/4] overflow-hidden border transition-all duration-300 ${
                activeIndex === idx
                  ? 'border-[#F42B26] opacity-100 shadow-[0_0_10px_rgba(244,43,38,0.3)]'
                  : 'border-[#2e2e2e] opacity-40 hover:opacity-80 hover:border-[#595959]'
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt={`Preview thumbnail ${idx + 1}`} />
            </button>
          ))}
        </div>

        <div className="flex-grow h-[85%] flex items-center justify-center relative">
          <img
            key={mainImage}
            alt="Suit Preview Main"
            className="h-full w-auto object-contain drop-shadow-2xl transition-opacity duration-500 animate-in fade-in"
            src={mainImage}
            onError={(e) => { e.currentTarget.src = '/images/placeholder-suit.jpg'; }}
          />

          <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 text-center font-mono text-[9px] text-white/40 tracking-widest uppercase bg-black/50 px-4 py-2 border border-white/10 whitespace-nowrap">
            Garment image will not reflect all customizations.
          </div>
        </div>
      </div>
    </section>
  );
}