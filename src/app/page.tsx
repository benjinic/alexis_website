import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react'; // 引入圖標增加引導性

export default function Home() {
  return (
    <main className="relative h-[calc(100vh-4rem)] md:h-screen w-full overflow-hidden bg-deep-noir flex flex-col justify-center items-center">
      
      {/* ==========================================
          1. 背景影音層 (The Cinematic Backdrop) 
         ========================================== */}
      <div className="absolute inset-0 z-0">
        {/* 1.1 遮罩層：加深背景，確保文字可讀性 */}
        <div className="absolute inset-0 bg-black/40 z-10 mix-blend-multiply" />
        
        {/* 1.2 噪點紋理層：增加電影膠片感 (可選) */}
        <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* 1.3 影片本體 */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover grayscale contrast-[1.15] brightness-75"
        >
          {/* 注意：請在 public/videos/ 資料夾放入您的影片
             如果暫時沒有影片，這個 poster 圖片會作為後備顯示
          */}
          <source src="/videos/hero.mp4" type="video/mp4" />
          
          {/* 備用靜態圖 (當影片無法載入時) */}
          <img 
             src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2600&auto=format&fit=crop" 
             alt="Tailor working in dark room"
             className="h-full w-full object-cover grayscale contrast-125 brightness-50"
          />
        </video>
      </div>

      {/* ==========================================
          2. 核心內容層 (The Content Payload) 
         ========================================== */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto space-y-8 animate-in fade-in duration-1000 zoom-in-95">
        
        {/* 品牌宣言 (Manifesto) */}
        <h1 className="font-playfair font-bold text-5xl md:text-7xl lg:text-9xl tracking-tight text-white drop-shadow-2xl leading-[0.9]">
          <span className="block mb-2 md:mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
            MUSIC.
          </span>
          <span className="block mb-2 md:mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
            REBELLION.
          </span>
          <span className="block text-champagne-gold">
            TAILORING.
          </span>
        </h1>

        {/* 副標題 (Mission Statement) */}
        <p className="font-mono text-concrete-grey text-xs md:text-sm lg:text-base uppercase tracking-[0.3em] max-w-lg mx-auto border-t border-white/20 pt-6 mt-6">
          Sartorial armor for the concrete jungle
        </p>

        {/* 行動呼籲按鈕群組 (Command Center) */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-md mt-12">
          
          {/* Primary Action: 線上訂製 */}
          <Button 
            asChild 
            size="lg" 
            className="group relative bg-champagne-gold text-deep-noir hover:bg-white hover:text-deep-noir border-0 rounded-none h-14 px-8 text-base tracking-widest font-bold transition-all duration-500 overflow-hidden"
          >
            <Link href="/blueprint" className="flex items-center justify-center gap-2">
              <span className="relative z-10">ENTER BLUEPRINT</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              {/* 按鈕 Hover 光澤特效 */}
              <div className="absolute inset-0 h-full w-full scale-0 rounded-none transition-all duration-300 group-hover:scale-100 group-hover:bg-white/20" />
            </Link>
          </Button>

          {/* Secondary Action: 預約服務 */}
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white hover:text-white rounded-none h-14 px-8 text-base tracking-widest font-mono transition-all duration-300 backdrop-blur-sm"
          >
            <Link href="/booking">
              SUMMON TAILOR
            </Link>
          </Button>
        </div>
      </div>

      {/* 裝飾性元素：底部滾動提示 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden md:block">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-concrete-grey to-transparent" />
      </div>
    </main>
  );
}