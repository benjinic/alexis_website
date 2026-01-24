'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function BlueprintPage() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  // 模擬系統初始化載入效果
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          return 98; // 故意停在 98%，等待用戶輸入 Email
        }
        // 隨機增加進度，模擬真實運算
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // 模擬 API 請求延遲
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 成功後狀態切換
    setIsSubmitting(false);
    setAccessGranted(true);
    // TODO: 這裡未來要串接 Firebase 將 Email 寫入 Firestore 的 'leads' 集合
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-deep-noir text-white flex flex-col items-center justify-center p-4">
      
      {/* 背景裝飾層 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 掃描線效果 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_2px,3px_100%] pointer-events-none" />
        {/* 網格背景 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl border border-white/10 bg-black/80 backdrop-blur-md p-8 md:p-12 shadow-2xl">
        
        {/* 頂部狀態列 */}
        <div className="flex justify-between items-center mb-12 font-mono text-xs md:text-sm text-concrete-grey tracking-widest border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            SYSTEM INITIALIZING
          </div>
          <div>PROTOCOL: V1.0-BETA</div>
        </div>

        {/* 核心內容區 */}
        <div className="text-center space-y-8">
          
          {/* 標題與旋轉線框 (用 CSS animation 模擬) */}
          <div className="relative inline-block mb-4">
             <div className="absolute -inset-8 bg-champagne-gold/20 blur-3xl rounded-full opacity-20 animate-pulse" />
             <h1 className="relative font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-champagne-gold to-yellow-700 leading-tight">
               THE BLUEPRINT
             </h1>
          </div>

          <p className="font-mono text-concrete-grey text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            The ultimate bespoke configurator is currently laid on the cutting table. 
            <br className="hidden md:block" />
            Only the patient will be armed first.
          </p>

          {/* 進度條與狀態 */}
          {!accessGranted && (
            <div className="w-full max-w-md mx-auto space-y-2">
              <div className="flex justify-between text-xs font-mono text-champagne-gold">
                <span>LOADING ASSETS...</span>
                <span>{loadingProgress}%</span>
              </div>
              <div className="h-1 w-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-champagne-gold transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-right text-[10px] text-red-500 font-mono animate-pulse">
                {loadingProgress >= 98 ? '> ACCESS RESTRICTED: ID REQUIRED' : '> DECRYPTING PACKETS...'}
              </p>
            </div>
          )}

          {/* 表單區塊 */}
          <div className="mt-12 w-full max-w-md mx-auto">
            {accessGranted ? (
              <div className="border border-green-500/30 bg-green-500/10 p-6 text-center animate-in fade-in zoom-in duration-500">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">CLEARANCE GRANTED</h3>
                <p className="text-sm text-concrete-grey font-mono">
                  You have been added to the priority access list. 
                  <br/>Stand by for encrypted transmission.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={`space-y-4 transition-opacity duration-1000 ${loadingProgress < 98 ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="space-y-2 text-left">
                  <label htmlFor="email" className="text-xs font-mono text-concrete-grey ml-1">
                    {'>'} ENTER IDENTIFICATION (EMAIL)
                  </label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="agent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-black/50 border-white/20 text-white placeholder:text-white/20 rounded-none h-12 focus-visible:ring-champagne-gold font-mono"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-champagne-gold text-deep-noir hover:bg-white hover:text-deep-noir rounded-none h-12 font-bold tracking-widest text-sm transition-all duration-300"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> VERIFYING...
                    </span>
                  ) : (
                    'REQUEST PRIORITY CLEARANCE'
                  )}
                </Button>
              </form>
            )}
          </div>

        </div>

        {/* 底部法律宣告 */}
        <div className="mt-16 text-center">
           <p className="text-[10px] text-white/20 font-mono">
             SECURE CONNECTION ESTABLISHED. UNAUTHORIZED ACCESS WILL BE LOGGED.
           </p>
        </div>

      </div>
    </main>
  );
}