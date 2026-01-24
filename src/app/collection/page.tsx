'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// 匯入剛剛寫好的 getInventoryItems
import { getInventoryItems, InventoryItem } from '@/app/actions/get-products';

// ✅ 關鍵修改：加入 "Fabric" 分類，並把它放在第一個 (因為您的資料庫目前只有 Fabric)
const CATEGORIES = ["All", "Fabric", "Suit", "Jacket", "Trousers", "Shirt", "Vest", "Other"];

export default function CollectionPage() {
  const [filter, setFilter] = useState("All");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 當頁面載入時，去資料庫抓 Inventory
  useEffect(() => {
    async function fetchData() {
      const data = await getInventoryItems();
      setItems(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  // 過濾邏輯
  const filteredItems = filter === "All" 
    ? items 
    : items.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* --- Header --- */}
      <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-white px-6 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tighter uppercase hover:opacity-70 transition-opacity">
          Alexis
        </Link>
        
        {/* Desktop Nav */}
        <nav className="text-sm font-bold tracking-widest space-x-6 hidden md:flex items-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`uppercase hover:underline decoration-2 underline-offset-4 transition-all
                ${filter === cat ? 'underline opacity-100' : 'opacity-60'}
              `}
            >
              {cat}
            </button>
          ))}
          <span className="w-px h-4 bg-white/50 mx-4"></span>
          <Link href="/booking" className="uppercase bg-white text-black px-4 py-1 hover:bg-neutral-200 transition-colors">
            Book
          </Link>
        </nav>
      </header>

      {/* --- Title Section --- */}
      <div className="pt-32 pb-16 px-6 border-b border-black">
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8]">
          Inventory <br />
          {filter === "All" ? "Collection" : filter}
        </h1>
        <p className="mt-8 text-sm font-mono max-w-md uppercase tracking-wide text-neutral-500">
          Selected Fabrics & Garments. <br />
          Sourced globally. <br />
          Category: <span className="text-black font-bold">{filter}</span>
        </p>
      </div>

      {/* --- Mobile Categories --- */}
      <div className="md:hidden px-6 py-4 border-b border-black/10 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`mr-6 text-xs font-bold uppercase tracking-widest
              ${filter === cat ? 'bg-black text-white px-2 py-1' : 'text-neutral-500'}
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- The Grid --- */}
      <div className="px-4 py-4 min-h-[50vh]">
        {loading ? (
          <div className="h-96 flex items-center justify-center font-mono animate-pulse">
            LOADING INVENTORY...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[400px] md:auto-rows-[600px]">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="relative group overflow-hidden border border-black/10 bg-neutral-100 animate-in fade-in duration-700"
              >
                <div className="absolute inset-0 w-full h-full">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 grayscale group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">NO IMAGE</div>
                  )}
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-end text-white mix-blend-difference">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tighter leading-none">{item.title}</h3>
                    <p className="text-sm font-mono mt-1 text-gray-300">{item.description}</p>
                    <p className="text-sm font-mono mt-1 font-bold text-yellow-500">{item.price}</p>
                  </div>
                  <Link href="/booking" className="px-4 py-2 border border-white text-xs font-bold uppercase hover:bg-white hover:text-black transition-colors">
                    Inquire
                  </Link>
                </div>

                <div className="absolute top-4 left-4">
                   <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1">
                      {item.category}
                   </span>
                </div>
              </div>
            ))}

            {!loading && filteredItems.length === 0 && (
              <div className="col-span-full h-64 flex items-center justify-center border border-black/10 text-neutral-400 font-mono text-sm">
                NO ITEMS FOUND IN '{filter}'.
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- Footer --- */}
      <footer className="py-20 px-6 border-t border-black text-center">
        <p 
          className="text-6xl md:text-8xl font-black uppercase hover:text-black transition-colors duration-500 cursor-default"
          style={{ 
            color: 'transparent',
            WebkitTextStroke: '2px black'
          }}
        >
          Alexis Bespoke
        </p>
        <div className="mt-8 flex justify-center gap-8 font-mono text-xs uppercase tracking-widest">
           <Link href="/booking">Book Appointment</Link>
           <a href="#">Instagram</a>
           <a href="#">Email</a>
        </div>
      </footer>
    </div>
  );
}