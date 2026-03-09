'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface CustomOrder {
  collar: string;
  cuff: string;
  fit: string;
  monogram: string;
}

const OPTIONS = {
  collar: [
    { id: 'classic', name: 'Classic Spread (經典標準)', price: 0 },
    { id: 'cutaway', name: 'Cutaway (溫莎寬角)', price: 0 },
    { id: 'mandarin', name: 'Mandarin (立領)', price: 0 },
  ],
  cuff: [
    { id: 'single', name: 'Single Button (單釦)', price: 0 },
    { id: 'french', name: 'French Cuff (法式雙摺)', price: 150 },
    { id: 'short', name: 'Short Sleeve (短袖)', price: 0 },
  ],
  fit: [
    { id: 'slim', name: 'Slim Fit (修身)', price: 0 },
    { id: 'regular', name: 'Regular Fit (標準)', price: 0 },
  ]
};

// 🔴 就是這行！Next.js 必須看到 export default function 才能把網頁畫出來
export default function DesignStudioPage() {
  const params = useParams();
  const router = useRouter();
  const fabricId = params?.fabricId as string;

  const [step, setStep] = useState(1);
  const [fabric, setFabric] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState<CustomOrder>({
    collar: OPTIONS.collar[0].id,
    cuff: OPTIONS.cuff[0].id,
    fit: OPTIONS.fit[0].id,
    monogram: '',
  });

  useEffect(() => {
    async function fetchFabricDetail() {
      try {
        const res = await fetch('/api/fabrics');
        const data = await res.json();
        if (data.fabrics) {
          const selectedFabric = data.fabrics.find((f: any) => f.id === fabricId);
          setFabric(selectedFabric);
        }
      } catch (error) {
        console.error("載入布料失敗", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFabricDetail();
  }, [fabricId]);

  const calculateTotal = () => {
    if (!fabric) return 0;
    let total = fabric.price || 0;
    if (order.cuff === 'french') total += 150;
    if (order.monogram !== '') total += 100;
    return total;
  };

  if (loading) return <div className="min-h-screen bg-stone-950 text-stone-500 flex items-center justify-center font-mono text-[10px] tracking-widest uppercase">Initializing_Studio...</div>;
  if (!fabric) return <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center">Fabric Not Found.</div>;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-50 pt-24 pb-20 px-6 flex flex-col md:flex-row gap-12 max-w-7xl mx-auto">
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="relative aspect-[3/4] w-full bg-black overflow-hidden border border-stone-800">
          <Image src={fabric.imageUrl} alt={fabric.name} fill className="object-cover opacity-90" />
        </div>
        <div className="space-y-2 border-b border-stone-800 pb-6">
          <h2 className="text-xl font-bold uppercase tracking-widest">{fabric.name}</h2>
          <p className="font-mono text-[10px] text-stone-500">{fabric.category}</p>
        </div>
        <div className="bg-stone-900/50 p-6 border border-white/5">
          <p className="font-mono text-[9px] text-stone-400 uppercase tracking-widest mb-2">Estimated_Total</p>
          <p className="text-2xl font-mono tracking-wider text-white">
            {calculateTotal() > 0 ? `HKD ${calculateTotal().toLocaleString()}` : 'TBD'}
          </p>
        </div>
      </div>

      <div className="w-full md:w-2/3 flex flex-col">
        <div className="flex gap-4 mb-12 border-b border-stone-800 pb-4 overflow-x-auto">
          {['Collar', 'Cuff', 'Fit', 'Details'].map((title, index) => (
            <button key={title} onClick={() => setStep(index + 1)} className={`font-mono text-[10px] tracking-[0.2em] uppercase px-4 py-2 transition-colors whitespace-nowrap ${step === index + 1 ? 'text-white border-b-2 border-white' : 'text-stone-600 hover:text-stone-400'}`}>
              0{index + 1}_{title}
            </button>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="font-mono text-[11px] tracking-widest text-stone-400 uppercase">Select Collar Style</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {OPTIONS.collar.map(opt => (
                <div key={opt.id} onClick={() => setOrder({...order, collar: opt.id})} className={`cursor-pointer p-6 border transition-all ${order.collar === opt.id ? 'border-white bg-white/5' : 'border-stone-800 hover:border-stone-500 bg-black'}`}>
                  <p className="font-bold text-sm tracking-widest">{opt.name}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="mt-8 px-8 py-4 bg-white text-black font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-stone-300">Next_Step ➔</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="font-mono text-[11px] tracking-widest text-stone-400 uppercase">Select Cuff Style</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {OPTIONS.cuff.map(opt => (
                <div key={opt.id} onClick={() => setOrder({...order, cuff: opt.id})} className={`cursor-pointer p-6 border transition-all ${order.cuff === opt.id ? 'border-white bg-white/5' : 'border-stone-800 hover:border-stone-500 bg-black'}`}>
                  <p className="font-bold text-sm tracking-widest">{opt.name}</p>
                  {opt.price > 0 && <p className="font-mono text-[9px] text-stone-400 mt-2">+ HKD {opt.price}</p>}
                </div>
              ))}
            </div>
            <button onClick={() => setStep(3)} className="mt-8 px-8 py-4 bg-white text-black font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-stone-300">Next_Step ➔</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="font-mono text-[11px] tracking-widest text-stone-400 uppercase">Select Fit</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {OPTIONS.fit.map(opt => (
                <div key={opt.id} onClick={() => setOrder({...order, fit: opt.id})} className={`cursor-pointer p-6 border transition-all ${order.fit === opt.id ? 'border-white bg-white/5' : 'border-stone-800 hover:border-stone-500 bg-black'}`}>
                  <p className="font-bold text-sm tracking-widest">{opt.name}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(4)} className="mt-8 px-8 py-4 bg-white text-black font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-stone-300">Next_Step ➔</button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
              <h3 className="font-mono text-[11px] tracking-widest text-stone-400 uppercase">Personalized Monogram (Optional)</h3>
              <input 
                type="text" 
                maxLength={3} 
                placeholder="e.g. A.B" 
                value={order.monogram}
                onChange={(e) => setOrder({...order, monogram: e.target.value.toUpperCase()})}
                className="w-full bg-black border border-stone-800 p-4 font-mono text-white focus:border-white outline-none"
              />
              <p className="font-mono text-[9px] text-stone-500">Max 3 characters. (+ HKD 100)</p>
            </div>

            <div className="pt-8 border-t border-stone-800">
              <button 
                onClick={() => {
                  const cartItem = {
                    cartItemId: Date.now().toString(),
                    fabricId: fabric.id,
                    fabricName: fabric.name,
                    fabricImage: fabric.imageUrl,
                    basePrice: fabric.price,
                    totalPrice: calculateTotal(),
                    customOptions: order
                  };

                  const existingCart = JSON.parse(localStorage.getItem('bespoke_cart') || '[]');
                  existingCart.push(cartItem);
                  localStorage.setItem('bespoke_cart', JSON.stringify(existingCart));

                  router.push('/cart');
                }} 
                className="w-full py-4 bg-white text-black font-bold text-[11px] tracking-[0.4em] uppercase hover:bg-stone-200 transition-colors"
              >
                Add_To_Cart & Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}