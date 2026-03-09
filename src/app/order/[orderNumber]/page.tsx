'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/firebase-client';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params?.orderNumber as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const q = query(collection(db, 'orders'), where('orderNumber', '==', orderNumber));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setOrder(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error("讀取訂單失敗:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderNumber]);

  if (loading) return <div className="min-h-screen bg-stone-100 flex items-center justify-center font-mono text-[10px] text-stone-500 uppercase">Retrieving_Order...</div>;
  if (!order) return <div className="min-h-screen bg-stone-100 text-stone-800 flex flex-col items-center justify-center font-sans">Order Not Found. <button onClick={() => router.push('/')} className="mt-4 underline text-stone-500">Return Home</button></div>;

  const orderDate = order.createdAt?.seconds 
    ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-HK', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    // 背景使用淺灰色 (比照 Casper)，列印時轉為純白
    <div className="min-h-screen bg-stone-100 py-10 px-4 font-sans text-stone-800 print:bg-white print:py-0">
      
      {/* 🧾 置中內容區塊 (最大寬度限制，營造高級信件感) */}
      <div className="max-w-2xl mx-auto space-y-6">

        {/* 1. 品牌 LOGO 區塊 */}
        <div className="text-center py-6 print:py-2">
          <h1 className="text-2xl font-black tracking-[0.2em] uppercase text-black">
            ALEXIS<span className="font-light">BESPOKE</span>
          </h1>
        </div>

        {/* 2. 主視覺與歡迎語 (Hero Section) */}
        <div className="bg-white p-10 text-center shadow-sm print:shadow-none print:border-b print:border-stone-200">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-stone-50 border border-stone-200">
            <span className="text-2xl">✂️</span> {/* 剪刀 Icon 代表裁縫開始 */}
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-widest uppercase mb-4 text-stone-900">
            Your Bespoke Journey Begins
          </h2>
          <p className="text-stone-500 text-sm leading-relaxed mb-8 max-w-md mx-auto">
            {order.shipping.name}, we’ve received your order and all systems are go. Our master tailors will begin reviewing your measurements shortly.
          </p>
          <div className="text-xs font-bold tracking-widest uppercase text-stone-400">
            Invoice: <span className="text-stone-800 underline">#{order.invoiceNumber || order.orderNumber}</span> | Date: {orderDate}
          </div>
        </div>

        {/* 3. 帳單與收件地址區塊 (Addresses) */}
        <div className="bg-white p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 print:shadow-none print:border-b print:border-stone-200">
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-4">Billing Address</h3>
            <div className="text-sm text-stone-600 leading-relaxed">
              <p className="font-medium text-stone-800">{order.shipping.name}</p>
              <p>{order.shipping.phone}</p>
              <p>{order.shipping.email}</p>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-4">Shipping Address</h3>
            <div className="text-sm text-stone-600 leading-relaxed">
              <p className="font-medium text-stone-800">{order.shipping.name}</p>
              <p>{order.shipping.address}</p>
              <p>{order.shipping.city}, {order.shipping.country}</p>
            </div>
          </div>
        </div>

        {/* 4. 訂單明細與總計區塊 (Order Items & Totals) */}
        <div className="bg-white p-10 shadow-sm print:shadow-none print:border-b print:border-stone-200">
          
          {/* 商品清單 */}
          <div className="space-y-6 border-b border-stone-100 pb-8 mb-8">
            {order.items.map((item: any, index: number) => (
              <div key={index} className="flex gap-4 md:gap-6 items-center">
                
                {/* 縮圖 */}
                <div className="w-20 h-20 bg-stone-100 relative rounded-sm overflow-hidden flex-shrink-0 border border-stone-200">
                  {item.fabricImage ? (
                    <Image src={item.fabricImage} alt={item.fabricName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[8px] text-stone-400">No Image</div>
                  )}
                </div>
                
                {/* 品名與客製化細節 */}
                <div className="flex-grow">
                  <h4 className="font-bold text-stone-800 text-sm md:text-base">{item.fabricName}</h4>
                  <p className="text-xs text-stone-500 mt-1 uppercase tracking-wider">
                    {item.customOptions.collar} / {item.customOptions.cuff}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">Qty: 1</p>
                </div>
                
                {/* 價格與狀態 */}
                <div className="text-right">
                  <p className="font-bold text-stone-800 text-sm md:text-base">HKD {item.totalPrice.toLocaleString()}</p>
                  <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider">Bespoke</p>
                </div>
              </div>
            ))}
          </div>

          {/* 金額加總 */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/2 space-y-3 text-sm">
              <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>HKD {order.totalAmount.toLocaleString()}</span></div>
              <div className="flex justify-between text-stone-500"><span>Customization</span><span>Included</span></div>
              <div className="flex justify-between text-stone-500"><span>Shipping</span><span>HKD 0.00</span></div>
              <div className="flex justify-between font-bold text-lg pt-4"><span>Total</span><span>HKD {order.totalAmount.toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        {/* 5. 客服聯絡資訊 (Support Footer) */}
        <div className="bg-white p-10 text-center shadow-sm print:shadow-none">
          <h3 className="text-xs font-bold tracking-widest uppercase text-stone-800 mb-2">Questions? We're on call.</h3>
          <p className="text-xs text-stone-500 mb-6">Monday to Saturday 10am - 7pm HKT</p>
          <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-6 text-sm font-medium text-stone-600">
             <span>💬 +852 2345 6789</span>
             <span className="hidden md:inline">|</span>
             <span className="underline">support@alexis-bespoke.com</span>
          </div>
        </div>

        {/* 🖨️ 操作按鈕：列印時 (print:hidden) 自動消失 */}
        <div className="flex justify-center gap-4 pt-4 pb-12 print:hidden">
          <button 
            onClick={() => window.print()} 
            className="px-8 py-4 bg-stone-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-700 rounded-sm transition-colors"
          >
            Print / Save PDF
          </button>
          <button 
            onClick={() => router.push('/collection')} 
            className="px-8 py-4 bg-white border border-stone-300 text-stone-600 font-bold text-xs uppercase tracking-widest hover:bg-stone-50 rounded-sm transition-colors"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}
