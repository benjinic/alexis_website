'use client';

// // 1. 引入必要的 Hook // //
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';

// // 為了符合 Next.js 的規範，使用 useSearchParams 的組件建議包裝在 Suspense 中 // //
function BookingForm() {
  const searchParams = useSearchParams();
  
  // // 表單狀態管理 // //
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Bespoke Suit',
    // // 🔴 預設布料欄位 // //
    selectedFabric: '',
    message: ''
  });

  // // 2. 監聽網址參數變動 // //
  useEffect(() => {
    // 從 URL 中抓取 'fabric' 參數 (由 Collection 頁面傳來)
    const fabricFromUrl = searchParams.get('fabric');
    
    if (fabricFromUrl) {
      setFormData(prev => ({
        ...prev,
        selectedFabric: fabricFromUrl,
        // 可選：自動在訊息框中加入引導文字
        message: `I am specifically interested in the ${fabricFromUrl} fabric I saw in your collection. `
      }));
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    // 這裡可以接您的寄信或 API 邏輯
    alert('Appointment Request Received.');
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
          Secure <br /> Appointment
        </h1>
        <p className="text-[10px] font-mono text-stone-500 uppercase tracking-[0.3em]">
          // Protocol: Reservation_Request_v.26 //
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 姓名與電郵 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Full Name</label>
            <input 
              type="text"
              required
              className="w-full bg-stone-900 border border-stone-800 p-3 text-white font-mono text-sm focus:border-white outline-none transition-colors"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Email Address</label>
            <input 
              type="email"
              required
              className="w-full bg-stone-900 border border-stone-800 p-3 text-white font-mono text-sm focus:border-white outline-none transition-colors"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        {/* 🔴 關鍵欄位：Selected Material (自動填充處) */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-amber-600 uppercase tracking-widest flex justify-between">
            <span>Selected Material</span>
            {formData.selectedFabric && <span className="animate-pulse">[ DETECTED ]</span>}
          </label>
                    <input 
                      type="text"
                      value={formData.selectedFabric}
                      readOnly // 設定為唯讀，確保資訊準確
                      placeholder="No material selected from archive"
                      className="w-full bg-stone-950 border border-stone-800 p-3 text-white font-mono text-sm focus:border-white outline-none transition-colors"
                    />
                  </div>
          
                  {/* 電話 */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Phone Number</label>
                    <input 
                      type="tel"
                      required
                      className="w-full bg-stone-900 border border-stone-800 p-3 text-white font-mono text-sm focus:border-white outline-none transition-colors"
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
          
                  {/* 訊息 */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Message</label>
                    <textarea 
                      className="w-full bg-stone-900 border border-stone-800 p-3 text-white font-mono text-sm focus:border-white outline-none transition-colors"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
          
                  {/* 提交按鈕 */}
                  <button 
                    type="submit"
                    className="w-full bg-white text-black font-mono text-sm font-bold py-3 hover:bg-stone-200 transition-colors uppercase tracking-widest"
                  >
                    Request Appointment
                  </button>
                </form>
          
                <div className="text-center text-stone-500 text-xs">
                  <Link href="/" className="hover:text-white transition-colors">
                    Return to Home
                  </Link>
                </div>
              </div>
            );
          }
          
          export default function BookingPage() {
            return (
              <Suspense fallback={<div>Loading...</div>}>
                <BookingForm />
              </Suspense>
            );
          }