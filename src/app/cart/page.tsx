'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase-client';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 網頁載入時，去 localStorage 把購物車資料抓出來
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('bespoke_cart') || '[]');
    setCartItems(savedCart);
    setLoading(false);
  }, []);

  // 刪除購物車品項的函數
  const removeItem = (cartItemId: string) => {
    const updatedCart = cartItems.filter(item => item.cartItemId !== cartItemId);
    setCartItems(updatedCart);
    localStorage.setItem('bespoke_cart', JSON.stringify(updatedCart));
  };

  // 計算整個購物車的總金額
  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleConfirmAndMeasure = () => {
    if (auth.currentUser) {
      console.log("VIP 已確認，前往量身結帳頁面...");
      router.push('/checkout');
    } else {
      console.log("尚未登入，引導至登入頁面...");
      router.push('/login?redirect=/checkout');
    }
  };

  if (loading) return <div className="min-h-screen bg-stone-950 flex items-center justify-center font-mono text-[10px] text-stone-500 uppercase tracking-widest">Loading_Cart...</div>;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* 標題區 */}
        <div className="mb-12 border-b border-stone-900 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">YOUR_ATELIER</h1>
            <p className="font-mono text-[10px] text-stone-500 mt-2 uppercase tracking-widest">Review your bespoke selections</p>
          </div>
          <div className="font-mono text-[9px] text-stone-600 uppercase">[ {cartItems.length} ITEMS ]</div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-stone-800">
            <p className="font-mono text-[10px] text-stone-500 uppercase tracking-widest mb-6">Your atelier is currently empty.</p>
            <button onClick={() => router.push('/bespoke')} className="px-8 py-3 bg-white text-black font-bold text-[9px] uppercase tracking-widest hover:bg-stone-300">Return_To_Bespoke</button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* 左側：購物車清單 */}
            <div className="w-full lg:w-2/3 space-y-6">
              {cartItems.map((item, index) => (
                <div key={item.cartItemId} className="flex gap-6 bg-stone-900/30 p-4 border border-white/5 relative group">
                  
                  {/* 布料圖片 */}
                  <div className="relative w-24 h-32 bg-black flex-shrink-0">
                    <Image src={item.fabricImage} alt={item.fabricName} fill className="object-cover opacity-80" />
                  </div>
                  
                  {/* 訂製細節 */}
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-bold text-sm tracking-widest uppercase text-white">{item.fabricName}</h3>
                      <div className="mt-3 grid grid-cols-2 gap-y-2 font-mono text-[9px] text-stone-400 uppercase">
                        <p>Collar: <span className="text-stone-300">{item.customOptions.collar}</span></p>
                        <p>Cuff: <span className="text-stone-300">{item.customOptions.cuff}</span></p>
                        <p>Fit: <span className="text-stone-300">{item.customOptions.fit}</span></p>
                        {item.customOptions.monogram && <p>Monogram: <span className="text-white">{item.customOptions.monogram}</span></p>}
                      </div>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <p className="font-mono text-[11px] text-white">HKD {item.totalPrice.toLocaleString()}</p>
                      <button onClick={() => removeItem(item.cartItemId)} className="font-mono text-[9px] text-stone-600 hover:text-red-500 uppercase transition-colors">[ Remove ]</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 右側：結帳總計區 */}
            <div className="w-full lg:w-1/3">
              <div className="bg-stone-900/50 p-6 border border-white/5 sticky top-32">
                <h3 className="font-mono text-[10px] text-stone-400 uppercase tracking-widest border-b border-stone-800 pb-4 mb-4">Order_Summary</h3>
                <div className="space-y-3 font-mono text-[10px] text-stone-300 mb-6">
                  <div className="flex justify-between"><p>Subtotal</p><p>HKD {cartTotal.toLocaleString()}</p></div>
                  <div className="flex justify-between"><p>Bespoke Tailoring</p><p>Included</p></div>
                  <div className="flex justify-between"><p>Worldwide Shipping</p><p>TBD</p></div>
                </div>
                <div className="border-t border-stone-800 pt-4 mb-8 flex justify-between items-end">
                  <p className="font-mono text-[10px] text-stone-400 uppercase tracking-widest">Total</p>
                  <p className="text-xl font-mono text-white tracking-wider">HKD {cartTotal.toLocaleString()}</p>
                </div>
                <button 
                  onClick={handleConfirmAndMeasure}
                  className="w-full py-4 bg-white text-black font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-stone-300 transition-colors"
                >
                  Confirm_&_Measure
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
