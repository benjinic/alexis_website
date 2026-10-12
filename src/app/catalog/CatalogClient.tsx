// app/catalog/CatalogClient.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { CatalogItem } from '@/app/actions/get-products';

export default function CatalogClient({ items }: { items: CatalogItem[] }) {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-50 pt-48 pb-20 px-4">
      <div className="max-w-[848px] mx-auto mb-16 space-y-4 text-center">
        <h1 className="font-roboto-condensed text-4xl md:text-5xl font-bold tracking-tighter uppercase text-white animate-in fade-in duration-700">
          CATALOG
        </h1>
      </div>

      {/* 🔴 關鍵修改 1：把 max-w-[1200px] 改成 max-w-[848px]，復刻 WACKO MARIA 的窄版置中排版 */}
      <div className="max-w-[848px] mx-auto min-h-[50vh]">
        {items.length === 0 ? (
          <div className="h-96 flex items-center justify-center font-mono text-[10px] tracking-[0.4em] text-stone-600">
            NO_ARCHIVE_FOUND
          </div>
        ) : (
          // 🔴 關鍵修改 2：設定電腦版為一行 4 張 (md:grid-cols-4)。這樣 848px 寬度分給 4 張圖，每張圖剛好就是你要的 ~200px！
          // gap-1 代表微小的縫隙，更有日系型錄感
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {items.map((item) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  {/* 🔴 關鍵修改 3：這裡我們使用 aspect-[2/3] 來鎖定 200.5 x 300.75 的完美比例，取代寫死 px */}
                  <div className="group relative overflow-hidden bg-stone-900 border border-white/5 cursor-zoom-in aspect-[2/3] w-full">
                    
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 212px"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out group-hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                      <p className="text-[10px] font-mono text-stone-500 uppercase">{item.category}</p>
                      <h3 className="text-sm font-bold uppercase tracking-tight truncate">{item.title}</h3>
                    </div>
                  </div>
                </DialogTrigger>

                <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none shadow-none flex items-center justify-center">
                  <DialogTitle className="sr-only">{item.title}</DialogTitle>
                  <div className="relative w-full flex justify-center items-center">
                    <Image
                      src={item.src}
                      alt={item.title}
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '90vh' }}
                      className="animate-in zoom-in-95 duration-300"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>

      {/* 底部 Footer 也對齊 848px */}
      <div className="max-w-[848px] mx-auto mt-20 pt-8 border-t border-white/5 text-center">
        <span className="font-mono text-[9px] text-stone-800 uppercase tracking-widest cursor-default select-none">
          End of Archive / Alexis Bespoke
        </span>
      </div>
    </div>
  );
}