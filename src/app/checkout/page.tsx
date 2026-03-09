'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase-client';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, runTransaction, serverTimestamp, getDoc, setDoc, writeBatch } from 'firebase/firestore';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 表單狀態
  const [step, setStep] = useState(1);
  const [measurements, setMeasurements] = useState({
    Chest: '',
    "L. Cuff": '',
    Shoulder: '',  // 正確拼寫
    Waist: '',     // 正確拼寫
    bodyType: 'Regular'
  });
  const [shipping, setShipping] = useState({
    name: '', email: '', phone: '', address: '', city: '', country: 'Hong Kong'
  });

  // 1. 載入購物車資料
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('bespoke_cart') || '[]');
    if (savedCart.length === 0) {
      router.push('/cart'); // 沒東西就趕回購物車
    } else {
      setCartItems(savedCart);
    }
    setLoading(false);
  }, [router]);

  // 🔴 2. VIP 專屬雷達：當網頁載入時，檢查客人身分並填入尺寸
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setShipping((prev) => ({
          ...prev,
          email: prev.email?.trim() ? prev.email : (user.email || '')
        }));

        console.log("VIP 已登入，正在從 customers 集合調閱資料...");
        try {
          // 👉 準確指向 customers 集合
          const userRef = doc(db, 'customers', user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            
            if (userData.measurements) {
              // 👉 將資料庫的尺寸倒進表單狀態中
              setMeasurements(userData.measurements);
              console.log("成功載入尺寸！客人：", userData.name || 'VIP');
            }
          }
        } catch (error) {
          console.error("讀取身型檔案失敗:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // 2. 送出訂單 (支援「真實流水號」與「TEST虛擬單號」雙軌制)
  const handleSubmitOrder = async () => {
    const shippingEmail = shipping.email?.trim();
    if (!shippingEmail) {
      alert('請先填寫寄送 Email。');
      return;
    }

    const currentUserEmail = auth.currentUser?.email?.trim().toLowerCase();
    if (currentUserEmail && shippingEmail.toLowerCase() !== currentUserEmail) {
      const shouldContinue = window.confirm('你填寫的寄送 Email 與登入帳號不一致，仍要繼續送出訂單嗎？');
      if (!shouldContinue) {
        return;
      }
    }

    const normalizedShipping = {
      ...shipping,
      email: shippingEmail
    };
    const orderEmail = auth.currentUser?.email?.trim() || shippingEmail;

    setIsSubmitting(true);
    try {
      // 🕵️‍♂️ 動作一：先去系統後台偷看「測試模式」是否開啟
      const settingsRef = doc(db, 'settings', 'system');
      const settingsSnap = await getDoc(settingsRef);
      const isTestMode = settingsSnap.exists() ? settingsSnap.data().testMode : false;

      let finalOrderNumber = '';

      if (isTestMode) {
        // 🧪 【測試模式路線】: 不觸碰計數器，隨機產生 TEST 單號
        finalOrderNumber = `TEST-${Math.floor(1000 + Math.random() * 9000)}`;

        const orderData = {
          items: cartItems,
          measurements: measurements,
          shipping: normalizedShipping,
          email: orderEmail,
          totalAmount: cartTotal,
          status: 'TEST_ORDER',
          createdAt: serverTimestamp(),
          orderNumber: finalOrderNumber
        };
        // 直接寫入 orders，不消耗真實號碼
        await setDoc(doc(db, 'orders', finalOrderNumber), orderData);

      } else {
        // 💼 【真實營業路線】: 鎖住計數器，同時抽取「工場訂單號」與「會計收據號」
        const counterRef = doc(db, 'counters', 'orderCounter');
        
        // 注意：這裡改為回傳一個包含兩個號碼的物件
        const generatedNumbers = await runTransaction(db, async (transaction) => {
          const counterDoc = await transaction.get(counterRef);
          
          let nextOrderNumber = 14067;   // 工場起始號碼
          let nextInvoiceNumber = 10000; // 收據起始號碼

          if (!counterDoc.exists()) {
            transaction.set(counterRef, { 
              lastNumber: 14067, 
              lastInvoiceNumber: 10000 
            });
          } else {
            const data = counterDoc.data();
            // 如果原本沒有 lastInvoiceNumber，就從 9999 開始加 1
            nextOrderNumber = (data.lastNumber || 14066) + 1;
            nextInvoiceNumber = (data.lastInvoiceNumber || 9999) + 1;
            
            transaction.update(counterRef, { 
              lastNumber: nextOrderNumber,
              lastInvoiceNumber: nextInvoiceNumber
            });
          }

          // 產生 9 位數的收據號碼 (自動補零，例如 000010000)
          const formattedInvoiceNumber = String(nextInvoiceNumber).padStart(9, '0');
          const formattedOrderNumber = `${nextOrderNumber}`;

          const orderData = {
            items: cartItems,
            measurements: measurements,
            shipping: normalizedShipping,
            email: orderEmail,
            totalAmount: cartTotal,
            status: 'PENDING',
            createdAt: serverTimestamp(),
            orderNumber: formattedOrderNumber,      // 給 Flutter 工場系統看 (Document ID)
            invoiceNumber: formattedInvoiceNumber   // 給客人與會計看 (獨立欄位)
          };
          
          // 強制用工場單號 14XXX 作為 Document ID，確保 Flutter 能接單
          transaction.set(doc(db, 'orders', formattedOrderNumber), orderData);
          
          return {
            orderNum: formattedOrderNumber,
            invoiceNum: formattedInvoiceNumber
          };
        });

        finalOrderNumber = generatedNumbers.orderNum; // 網址跳轉依然使用工場單號來尋找資料
      }

      const batch = writeBatch(db);

      cartItems.forEach((item) => {
        const newItemRef = doc(collection(db, 'order_items'));

        batch.set(newItemRef, {
          orderId: String(finalOrderNumber),
          id: item.id || Date.now().toString(),
          service: item.service || item.category || 'SHIRT',
          fabricName: item.fabricName || item.title || item.name || 'Unknown Fabric',
          fabricId: item.fabricId || null,
          fabricUsed: item.fabricUsed || 0,
          cost: item.cost || 0,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          customerEmail: orderEmail,
          createdAt: serverTimestamp()
        });
      });

      await batch.commit();
      console.log("✅ 商品明細已完美對齊並寫入 order_items！");
      
      // 清空購物車
      localStorage.removeItem('bespoke_cart');
      
      // 🔴 結帳成功後，更新尺寸
      if (auth.currentUser) {
        try {
          // 1. 取得這名客人在 customers 集合中的專屬地址
          const customerRef = doc(db, 'customers', auth.currentUser.uid);
          
          // 2. 將畫面上的 measurements 狀態寫入資料庫
          await setDoc(customerRef, {
            measurements: measurements, // 這裡會存入你表單裡最新的 Shoulder, Waist, Chest 等數據
            lastUpdated: serverTimestamp() // 順便記錄一下最後更新時間
          }, { merge: true }); // ⚠️ 極度重要：加上 merge: true，才不會把你原本資料庫裡的 name 或是 orders 欄位洗掉！
          
          console.log("✅ 尺寸成功寫入 Firebase customers 集合！");

          // 訂單成立後，背景呼叫電子收據 API（不阻塞跳轉）
          if (auth.currentUser.email) {
            console.log("正在發送電子收據...");
            const guestName = auth.currentUser.displayName || auth.currentUser.email.split('@')[0] || 'VIP';

            fetch('/api/send-receipt', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: auth.currentUser.email,
                orderNumber: finalOrderNumber,
                name: guestName
              }),
            })
              .then((res) => res.json())
              .then((data) => console.log("收據寄送狀態:", data))
              .catch((err) => console.error("寄信失敗:", err));
          }
        } catch (error) {
          console.error("保存身型档案失敗:", error);
          // 不影響訂單成功，只是 console.error
        }
      }
      

      // 成功後跳轉到 E-invoice 頁面
      router.push(`/order/${finalOrderNumber}`);
      
    } catch (error) {
      console.error("建立訂單失敗:", error);
      alert("系統繁忙，請稍後再試。");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-stone-950 flex items-center justify-center font-mono text-[10px] text-stone-500 uppercase">Loading_Secure_Checkout...</div>;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-50 pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-16">
        
        {/* 左側：表單區 */}
        <div className="w-full lg:w-3/5 space-y-12">
          
          <div className="border-b border-stone-900 pb-6">
            <h1 className="text-3xl font-black uppercase tracking-tighter">SECURE_CHECKOUT</h1>
            <p className="font-mono text-[10px] text-stone-500 mt-2 uppercase tracking-widest">Complete your bespoke profile</p>
          </div>

          {/* 步驟 1：量身數據 */}
          <section className={`transition-opacity duration-500 ${step === 1 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <h2 className="font-mono text-[11px] text-stone-400 uppercase tracking-widest mb-6">01_Body_Measurements (cm)</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Chest (胸圍)" value={measurements.Chest} onChange={e => setMeasurements({...measurements, Chest: e.target.value})} className="bg-black border border-stone-800 p-4 font-mono text-sm text-white focus:border-stone-400 outline-none" required />
              <input type="number" placeholder="L. Cuff (左袖)" value={measurements["L. Cuff"]} onChange={e => setMeasurements({...measurements, "L. Cuff": e.target.value})} className="bg-black border border-stone-800 p-4 font-mono text-sm text-white focus:border-stone-400 outline-none" required />
              <input type="number" placeholder="Shoulder (肩寬)" value={measurements.Shoulder} onChange={e => setMeasurements({...measurements, Shoulder: e.target.value})} className="bg-black border border-stone-800 p-4 font-mono text-sm text-white focus:border-stone-400 outline-none" required />
              <input type="number" placeholder="Waist (腰圍)" value={measurements.Waist} onChange={e => setMeasurements({...measurements, Waist: e.target.value})} className="bg-black border border-stone-800 p-4 font-mono text-sm text-white focus:border-stone-400 outline-none" required />
            </div>
            <div className="mt-4">
              <select value={measurements.bodyType} onChange={e => setMeasurements({...measurements, bodyType: e.target.value})} className="w-full bg-black border border-stone-800 p-4 font-mono text-sm text-stone-400 focus:border-stone-400 outline-none appearance-none">
                <option value="Regular">Regular Fit (標準體態)</option>
                <option value="Slim">Slim / Athletic (修身/運動體態)</option>
                <option value="Full">Fuller Midsection (肚腩較大)</option>
              </select>
            </div>
            {step === 1 && <button onClick={() => setStep(2)} className="mt-6 px-8 py-4 bg-white text-black font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-stone-300">Continue_To_Shipping ➔</button>}
          </section>

          {/* 步驟 2：寄送資訊 */}
          <section className={`transition-opacity duration-500 ${step === 2 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <h2 className="font-mono text-[11px] text-stone-400 uppercase tracking-widest mb-6">02_Shipping_Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" value={shipping.name} onChange={e => setShipping({...shipping, name: e.target.value})} className="bg-black border border-stone-800 p-4 font-mono text-sm text-white focus:border-stone-400 outline-none" required />
                <input type="tel" placeholder="Phone Number" value={shipping.phone} onChange={e => setShipping({...shipping, phone: e.target.value})} className="bg-black border border-stone-800 p-4 font-mono text-sm text-white focus:border-stone-400 outline-none" required />
              </div>
              <input type="email" placeholder="Email Address (For Order Tracking)" value={shipping.email} onChange={e => setShipping({...shipping, email: e.target.value})} className="w-full bg-black border border-stone-800 p-4 font-mono text-sm text-white focus:border-stone-400 outline-none" required />
              <p className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">
                Default uses your signed-in email. You can edit it.
              </p>
              <input type="text" placeholder="Shipping Address" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} className="w-full bg-black border border-stone-800 p-4 font-mono text-sm text-white focus:border-stone-400 outline-none" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} className="bg-black border border-stone-800 p-4 font-mono text-sm text-white focus:border-stone-400 outline-none" required />
                <input type="text" placeholder="Country" value={shipping.country} disabled className="bg-stone-900 border border-stone-800 p-4 font-mono text-sm text-stone-500 cursor-not-allowed" />
              </div>
            </div>
            {step === 2 && (
              <div className="flex gap-4 mt-6">
                <button onClick={() => setStep(1)} className="px-6 py-4 border border-stone-800 text-stone-400 font-mono text-[10px] tracking-widest uppercase hover:text-white">Back</button>
                <button onClick={() => setStep(3)} className="px-8 py-4 bg-white text-black font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-stone-300">Review_Order ➔</button>
              </div>
            )}
          </section>

        </div>

        {/* 右側：訂單總覽與確認按鈕 */}
        <div className="w-full lg:w-2/5">
          <div className="bg-stone-900/40 p-8 border border-white/5 sticky top-32">
            <h3 className="font-mono text-[11px] text-stone-400 uppercase tracking-widest border-b border-stone-800 pb-4 mb-6">Order_Summary</h3>
            
            {/* 購物車縮影 */}
            <div className="space-y-4 mb-8">
              {cartItems.map(item => (
                <div key={item.cartItemId} className="flex justify-between items-center font-mono text-[10px]">
                  <span className="text-stone-300 truncate pr-4">{item.fabricName} (Bespoke)</span>
                  <span className="text-white whitespace-nowrap">HKD {item.totalPrice.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-800 pt-6 mb-8 space-y-2 font-mono text-[10px]">
              <div className="flex justify-between text-stone-400"><p>Subtotal</p><p>HKD {cartTotal.toLocaleString()}</p></div>
              <div className="flex justify-between text-stone-400"><p>Shipping</p><p>Complimentary</p></div>
              <div className="flex justify-between text-white text-lg mt-4 pt-4 border-t border-stone-800"><p>Total</p><p>HKD {cartTotal.toLocaleString()}</p></div>
            </div>

            {/* 最終提交按鈕 */}
            {step === 3 ? (
               <button 
                 onClick={handleSubmitOrder}
                 disabled={isSubmitting}
                 className="w-full py-5 bg-white text-black font-bold text-[11px] tracking-[0.4em] uppercase hover:bg-stone-300 transition-colors disabled:opacity-50"
               >
                 {isSubmitting ? 'Processing...' : 'Initiate_Bespoke_Order'}
               </button>
            ) : (
               <div className="text-center font-mono text-[9px] text-stone-600 tracking-widest uppercase border border-dashed border-stone-800 py-4">
                 Please complete form to proceed
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}