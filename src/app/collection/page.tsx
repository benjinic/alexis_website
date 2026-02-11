'use client';

// // 引入 React 核心 Hook 與 Next.js 組件 // //
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// // 引入獲取產品資料的動作函數 // //
import { getInventoryItems, InventoryItem } from '@/app/actions/get-products';

// // ✅ 修改後的分類：專注於布料材質選擇 // //
const MATERIAL_CATEGORIES = ["ALL", "WOOL", "COTTON", "LINEN", "OTHER"];

export default function CollectionPage() {
  const [filter, setFilter] = useState("ALL");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getInventoryItems();
      setItems(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  // // 過濾邏輯：將數據庫中的分類或標題與材質關鍵字進行匹配 // //
  const filteredItems = filter === "ALL" 
    ? items 
    : items.filter(item => 
        item.category?.toUpperCase() === filter || 
        item.title?.toUpperCase().includes(filter)
      );

  return (
    // // 🔴 修改點：將背景改為 stone-950 以配合全站統一的白色 Header 文字 // //
    <div className="min-h-screen bg-stone-950 text-stone-50 font-sans selection:bg-stone-50 selection:text-stone-950">
      
      {/* // 🔴 已刪除原有的局部 <header> 區域，現在由 app/layout.tsx 中的統一 Header 接管 // */}

      {/* // --- 居中標題區塊：強化視覺平衡感 --- // */}
      <div className="pt-40 pb-20 px-6 text-center border-b border-stone-800">
        <h1 className="text-7xl md:text-5xl font-black tracking-tighter uppercase leading-none text-white">
          COLLECTION
        </h1>
       
        
        {/* // 布料材質選擇器：放置於標題下方並置中 // */}
        <nav className="mt-12 flex flex-wrap justify-center gap-8 md:gap-12">
          {MATERIAL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-sm font-bold tracking-widest uppercase transition-all relative py-2
                ${filter === cat ? 'text-white' : 'text-stone-600 hover:text-stone-400'}
              `}
            >
              {cat}
              {filter === cat && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white animate-in fade-in slide-in-from-left-2" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* // --- 庫存網格系統：展示布料細節 --- // */}
      <div className="px-4 py-12 max-w-7xl mx-auto min-h-[50vh]">
        {loading ? (
          <div className="h-96 flex items-center justify-center font-mono text-xs tracking-widest animate-pulse text-stone-500">
            INITIALIZING_DATABASE...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="group flex flex-col space-y-4 animate-in fade-in duration-700"
              >
                {/* // 圖片容器： aspect-square 適合展示布料紋理 // */}
                <div className="relative aspect-square overflow-hidden bg-stone-900 border border-stone-800">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-stone-600">IMAGE_NOT_FOUND</div>
                  )}
                  {/* // 懸停層：顯示詢問按鈕 // */}
                  <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/40 transition-colors duration-500 flex items-center justify-center">
                    <Link 
                      href={`/booking?fabric=${encodeURIComponent(item.title)}`} 
                      className="opacity-0 group-hover:opacity-100 bg-white text-stone-950 text-[10px] font-bold px-6 py-2 tracking-widest uppercase transition-all transform translate-y-4 group-hover:translate-y-0"
                    >
                      Inquire_Fabric
                    </Link>
                  </div>
                </div>

                {/* // 商品資訊：左對齊簡約排版 // */}
                <div className="flex justify-between items-start pt-2 border-t border-stone-900">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-tight text-white">{item.title}</h3>
                    <p className="text-[10px] font-mono text-stone-500 mt-1 uppercase">{item.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-mono font-bold text-stone-400">{item.price}</span>
                    <Link 
                      href={`/booking?fabric=${encodeURIComponent(item.title)}`}
                      className="text-[10px] underline text-stone-400 hover:text-white"
                    >
                      [INQUIRE]
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* // 空狀態提示 // */}
            {filteredItems.length === 0 && (
              <div className="col-span-full h-64 flex flex-col items-center justify-center border border-dashed border-stone-800 text-stone-600">
                <p className="font-mono text-xs uppercase tracking-widest">No inventory found for: {filter}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* // --- Footer --- // */}
      <footer className="py-32 px-6 bg-stone-900 text-stone-50 text-center border-t border-stone-800">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 text-white">
          Alexis Bespoke
        </h2>
        <div className="flex justify-center gap-12 font-mono text-[10px] tracking-[0.3em] uppercase opacity-50">
           <Link href="/catalog" className="hover:opacity-100 transition-opacity">Catalog</Link>
           <Link href="/process" className="hover:opacity-100 transition-opacity">Process</Link>
           <Link href="/booking" className="hover:opacity-100 transition-opacity">Contact</Link>
        </div>
        <p className="mt-12 text-[8px] font-mono text-stone-700">© 2026 PROTOCOL_V.26 / ALL_RIGHTS_RESERVED</p>
      </footer>
    </div>
  );
}