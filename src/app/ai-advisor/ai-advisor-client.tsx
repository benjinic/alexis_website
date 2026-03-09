'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Shirt, Briefcase, Gem, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StyleAdvice {
  analysis: string;
  outfit: {
    suit: string;
    shirt: string;
    accessories: string[];
  };
  advice: string;
}

export default function AiAdvisorClient() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<StyleAdvice | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setAdvice(null);
    try {
      // 🔴 放棄 Server Action，改用標準的 API Fetch
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasionOrMood: input }),
      });

      if (!response.ok) {
        throw new Error('Neural link to Alexis severed.');
      }

      const result = await response.json();
      setAdvice(result as StyleAdvice);

    } catch (error) {
      console.error("Protocol Error:", error);
      toast({
        title: "PROTOCOL ERROR",
        description: "Neural link to Alexis severed. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 最外層容器：使用碳黑底色與純白文字
    <div className="max-w-4xl mx-auto space-y-8 p-6 bg-carbon-black text-white min-h-screen border border-graphite shadow-2xl">
      
      <section className="space-y-4 text-center pb-8 border-b border-graphite">
        {/* 標題：使用巨大、壓迫感強的 Condensed 字體 */}
        <h2 className="text-4xl md:text-5xl font-condensed tracking-widest text-white uppercase">
          Protocol Interface
        </h2>
        {/* 副標題：使用測量感的 JetBrains 字體與岩漿紅 */}
        <p className="font-jetbrains text-[10px] tracking-[0.3em] text-lava-red uppercase">
          State your occasion. Be precise.
        </p>
        
        <div className="grid w-full gap-6 mt-8">
          {/* 輸入框：深色無框線風格，聚焦時邊框變紅 */}
          <Textarea 
            placeholder="E.G. ATTENDING A GALA IN MONACO, BLACK TIE OPTIONAL..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[120px] rounded-none border-graphite bg-[#151515] text-white placeholder:text-graphite font-jetbrains text-xs uppercase focus:border-lava-red focus:ring-1 focus:ring-lava-red transition-all"
          />
          {/* 按鈕：充滿攻擊性的紅色按鈕，懸停時反轉為白底黑字 */}
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !input}
            className="w-full sm:w-auto mx-auto bg-lava-red hover:bg-white text-white hover:text-carbon-black font-jetbrains text-xs font-bold tracking-[0.2em] uppercase rounded-none px-10 py-6 transition-all"
          >
            {isLoading ? (
              <><Loader2 className="mr-3 h-4 w-4 animate-spin" /> Establishing Link...</>
            ) : (
              <><Sparkles className="mr-3 h-4 w-4" /> Initialize Protocol</>
            )}
          </Button>
        </div>
      </section>

      {advice && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
          
          {/* Mission Analysis: 岩漿紅側邊條 */}
          <Card className="rounded-none border-l-4 border-l-lava-red bg-[#151515] border-graphite border-t border-r border-b shadow-lg">
            <CardHeader>
              <CardTitle className="font-condensed text-xl tracking-widest text-lava-red uppercase">
                Mission Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-dim-grey font-sans italic leading-relaxed text-sm">
                "{advice.analysis}"
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* 西裝卡片 */}
            <Card className="group rounded-none bg-[#151515] border-graphite shadow-md hover:border-lava-red/50 transition-colors">
              <CardHeader className="pb-3 border-b border-graphite/50 mb-3">
                <CardTitle className="flex items-center gap-3 font-jetbrains text-[11px] tracking-widest text-white uppercase">
                  <Briefcase className="h-4 w-4 text-dim-grey group-hover:text-lava-red transition-colors" /> 
                  The Armor (Suit)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-dim-grey font-sans leading-relaxed">
                  {advice.outfit.suit}
                </p>
              </CardContent>
            </Card>

            {/* 襯衫卡片 */}
            <Card className="group rounded-none bg-[#151515] border-graphite shadow-md hover:border-lava-red/50 transition-colors">
              <CardHeader className="pb-3 border-b border-graphite/50 mb-3">
                <CardTitle className="flex items-center gap-3 font-jetbrains text-[11px] tracking-widest text-white uppercase">
                  <Shirt className="h-4 w-4 text-dim-grey group-hover:text-lava-red transition-colors" /> 
                  The Ammunition (Shirt)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-dim-grey font-sans leading-relaxed">
                  {advice.outfit.shirt}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 配件卡片 */}
          <Card className="group rounded-none bg-[#151515] border-graphite shadow-md hover:border-lava-red/50 transition-colors">
            <CardHeader className="pb-3 border-b border-graphite/50 mb-3">
              <CardTitle className="flex items-center gap-3 font-jetbrains text-[11px] tracking-widest text-white uppercase">
                <Gem className="h-4 w-4 text-dim-grey group-hover:text-lava-red transition-colors" /> 
                Hardware (Accessories)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 sm:grid-cols-2">
                {advice.outfit.accessories.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-dim-grey font-sans">
                    <span className="mt-1.5 h-1 w-1 bg-lava-red flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 最終建議: 帶有微紅光暈的深色邊框 */}
          <div className="bg-carbon-black border border-lava-red/30 p-8 shadow-[inset_0_0_20px_rgba(244,43,38,0.05)] mt-8">
            <h3 className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-lava-red mb-4">
              [ Final Directive ]
            </h3>
            <p className="text-base font-sans leading-relaxed text-white">
              {advice.advice}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}