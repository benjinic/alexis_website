'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase'; // 確保路徑對應你的 firebase 設定檔
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Ruler, ShoppingBag, User, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// 定義資料型別
interface CustomerData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  measurements?: Record<string, string | number>;
}

interface OrderData {
  id: string;
  orderNumber: string;
  invoiceNumber?: string;
  status: string;
  total: number;
  createdAt: any;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);

  useEffect(() => {
    // 監聽登入狀態
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // 未登入直接踢回 login 並帶上 redirect 參數
        router.push('/login?redirect=/profile');
        return;
      }

      try {
        // 1. 獲取客戶基本資料與尺寸 (從 customers/{uid})
        const customerRef = doc(db, 'customers', user.uid);
        const customerSnap = await getDoc(customerRef);
        
        if (customerSnap.exists()) {
          setCustomer(customerSnap.data() as CustomerData);
        } else {
          // 如果沒有檔案，塞入基本 email
          setCustomer({ email: user.email || '' });
        }

        // 2. 獲取關聯訂單 (從 orders 集合)
        // 💡 總監防坑提示：這裡不要用 orderBy，改用 JS 記憶體排序，就能避開 Firestore 複合索引報錯！
        // 注意：這裡假設你結帳寫入 orders 時，綁定使用者的欄位是 'userId'，如果是 'customerId' 請自行更改
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('userId', '==', user.uid));
        const orderSnap = await getDocs(q);
        
        const fetchedOrders: OrderData[] = [];
        orderSnap.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() } as OrderData);
        });

        // 在前端進行時間排序 (最新到最舊)
        fetchedOrders.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || a.createdAt || 0;
          const timeB = b.createdAt?.toMillis?.() || b.createdAt || 0;
          return timeB - timeA;
        });

        setOrders(fetchedOrders);

      } catch (error) {
        console.error('🔥 [PROFILE ERROR] 讀取會員資料失敗:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center font-mono text-[10px] text-stone-500 tracking-[0.3em] uppercase">
        <div className="w-8 h-8 border-t-2 border-stone-500 rounded-full animate-spin mb-4"></div>
        Decrypting_Client_Dossier...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-50 pt-32 pb-20 px-6 selection:bg-stone-50 selection:text-stone-950">
      <div className="max-w-6xl mx-auto">
        
        {/* Header 區塊 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-stone-900 pb-8 mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
              Client_Dossier
            </h1>
            <p className="font-mono text-[10px] text-stone-500 mt-2 uppercase tracking-widest flex items-center gap-2">
              <User size={12} /> {customer?.email || 'Authenticated_User'}
            </p>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 font-mono text-[10px] text-stone-500 hover:text-white uppercase tracking-widest transition-colors"
          >
            <LogOut size={14} /> Sign_Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 左側：尺寸與基本資料 (佔 5 欄) */}
          <div className="lg:col-span-5 space-y-12">
            
            {/* VIP Measurements */}
            <section className="bg-black border border-stone-900 p-8">
              <div className="flex items-center gap-3 mb-8 border-b border-stone-900 pb-4">
                <Ruler className="text-stone-400" size={18} />
                <h2 className="text-lg font-bold uppercase tracking-widest text-white">Bespoke_Profile</h2>
              </div>
              
              {customer?.measurements && Object.keys(customer.measurements).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(customer.measurements).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-end border-b border-stone-900/50 pb-2">
                      <span className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">{key}</span>
                      <span className="font-mono text-xs text-white uppercase tracking-wider">{value}</span>
                    </div>
                  ))}
                  <p className="font-mono text-[9px] text-stone-600 mt-6 tracking-widest uppercase">
                    * Last updated from your recent commission.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">No_Measurements_Found</p>
                  <Link href="/collection" className="inline-block mt-4 text-[10px] font-bold text-white uppercase tracking-widest border-b border-white pb-1">
                    Start_First_Commission
                  </Link>
                </div>
              )}
            </section>

          </div>

          {/* 右側：訂單追蹤 My Wardrobe (佔 7 欄) */}
          <div className="lg:col-span-7">
            <section>
              <div className="flex items-center gap-3 mb-8 border-b border-stone-900 pb-4">
                <ShoppingBag className="text-stone-400" size={18} />
                <h2 className="text-lg font-bold uppercase tracking-widest text-white">My_Wardrobe</h2>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <Link href={`/order/${order.orderNumber}`} key={order.id}>
                      <div className="group bg-black border border-stone-900 p-6 hover:border-stone-700 transition-all cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        
                        <div>
                          <p className="font-mono text-[10px] text-stone-500 tracking-widest uppercase mb-1">
                            {order.createdAt?.seconds 
                              ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() 
                              : 'Recent'}
                          </p>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Order {order.orderNumber}
                          </h3>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                          {/* 狀態標籤 (依照狀態改變顏色) */}
                          <span className={`font-mono text-[10px] px-3 py-1 uppercase tracking-widest border ${
                            order.status === 'PENDING' ? 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10' :
                            order.status === 'READY' ? 'text-green-500 border-green-500/30 bg-green-500/10' :
                            'text-stone-400 border-stone-800 bg-stone-900'
                          }`}>
                            {order.status || 'PROCESSING'}
                          </span>
                          
                          <ChevronRight className="text-stone-600 group-hover:text-white transition-colors" size={18} />
                        </div>

                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-stone-900 p-12 text-center">
                  <p className="font-mono text-[10px] text-stone-500 uppercase tracking-widest mb-4">
                    Your wardrobe is currently empty.
                  </p>
                  <Link href="/collection" className="inline-block px-8 py-4 bg-white text-black font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-stone-200 transition-colors">
                    Explore_Collection
                  </Link>
                </div>
              )}
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}