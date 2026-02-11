'use client';

import React from 'react';
import Image from 'next/image';
// // 引入 Dialog 組件以實現燈箱功能 // //
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

const LOOKBOOK_IMAGES = [
  { id: 1, src: 'https://images.unsplash.com/photo-1594932224033-233403333333?q=80&w=800', title: 'Midnight Peak Lapel', category: 'Evening Wear' },
  { id: 2, src: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800', title: 'Graphite Double Breasted', category: 'Business Armor' },
  { id: 3, src: 'https://images.unsplash.com/photo-1617130863154-8250122e4bbe?q=80&w=800', title: 'Sand Linen Unstructured', category: 'Summer Bespoke' },
  { id: 4, src: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=800', title: 'Oxblood Velvet Tuxedo', category: 'Protocol Zero' },
  { id: 5, src: 'https://images.unsplash.com/photo-1598808503490-85d84999c014?q=80&w=800', title: 'Classic Charcoal Silk', category: 'Formal Archive' },
];

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-50 pt-32 pb-20 px-4">
      {/* // 頁面標題區 // */}
      <div className="max-w-[1080px] mx-auto mb-16 space-y-4 text-center">
        <h1 className="font-roboto-condensed text-2xl md:text-4xl font-bold tracking-tighter uppercase text-white animate-in fade-in duration-700">
          CATALOG
        </h1>
      </div>

      {/* // 網格系統：1 行 5 張相 // */}
      <div className="max-w-[1080px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
        {LOOKBOOK_IMAGES.map((item) => (
          // // 為每張圖片封裝 Dialog 燈箱邏輯 // //
          <Dialog key={item.id}>
            <DialogTrigger asChild>
              <div className="group relative aspect-[3/4] overflow-hidden bg-stone-900 border border-white/5 cursor-zoom-in">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out group-hover:scale-105"
                />
                
                {/* // 資訊遮罩 // */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <span className="font-mono text-[9px] text-stone-500 mb-1 tracking-[0.2em]">
                    {item.category}
                  </span>
                  <h3 className="font-roboto-condensed text-lg font-bold text-white tracking-tight uppercase">
                    {item.title}
                  </h3>
                </div>

                <div className="absolute top-3 right-3 font-mono text-[9px] text-white/20 group-hover:text-white transition-colors">
                  #{String(item.id).padStart(3, '0')}
                </div>
              </div>
            </DialogTrigger>

            {/* // 燈箱內容層：點擊後顯示的大圖 // */}
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none shadow-none flex items-center justify-center">
              <DialogTitle className="sr-only">{item.title}</DialogTitle>
              <div className="relative w-full h-[80vh] md:h-[90vh] aspect-[3/4]">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-contain animate-in zoom-in-95 duration-300"
                  priority
                />
                {/* // 大圖下方的資訊標籤 // */}
                <div className="absolute -bottom-12 left-0 right-0 text-center">
                  <p className="font-roboto-condensed text-white text-xl font-bold tracking-widest uppercase">{item.title}</p>
                  <p className="font-mono text-stone-500 text-[10px] tracking-[0.3em] mt-1">{item.category}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {/* // 頁尾 // */}
      <div className="max-w-[1800px] mx-auto mt-20 pt-8 border-t border-white/5 text-center">
        <span className="font-mono text-[9px] text-stone-800 uppercase tracking-widest">
          End of Archive / Alexis Bespoke
        </span>
      </div>
    </div>
  );
}