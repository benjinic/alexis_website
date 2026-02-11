'use client';

import { useState } from 'react';
import { getStyleAdvice } from '@/app/actions/ai';
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
      const result = await getStyleAdvice(input);
      setAdvice(result as unknown as StyleAdvice);
    } catch (error) {
      console.error(error);
      toast({
        title: "Connection Error",
        description: "Alexis is currently unreachable.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 最外層容器：深色背景 text-stone-50
    <div className="max-w-4xl mx-auto space-y-8 p-6 bg-stone-950 text-stone-50 min-h-screen rounded-lg">
      
      <section className="space-y-4 text-center">
        <h2 className="text-3xl font-serif tracking-tight text-white">The Atelier</h2>
        <p className="text-stone-400">State your occasion. Be precise.</p>
        <div className="grid w-full gap-4">
          {/* 輸入框：深灰底白字 */}
          <Textarea 
            placeholder="e.g. Attending a gala in Monaco, black tie optional..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[100px] border-stone-700 bg-stone-900 text-stone-100 placeholder:text-stone-500 focus:border-stone-500 focus:ring-stone-500"
          />
          {/* 按鈕：亮色形成對比 */}
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !input}
            className="w-full sm:w-auto mx-auto bg-stone-200 hover:bg-white text-stone-950 font-bold px-8"
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Consulting Alexis...</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" /> Request Protocol</>
            )}
          </Button>
        </div>
      </section>

      {advice && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
          
          {/* Mission Analysis: 琥珀色側邊條 */}
          <Card className="border-l-4 border-l-amber-500 bg-stone-900 border-stone-800 shadow-lg">
            <CardHeader>
              <CardTitle className="font-serif text-xl text-amber-500">Mission Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-300 italic leading-relaxed">"{advice.analysis}"</p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* 西裝卡片 */}
            <Card className="bg-stone-900 border-stone-800 shadow-md hover:border-stone-700 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-stone-100">
                  <Briefcase className="h-5 w-5 text-stone-500" /> The Armor (Suit)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-400 leading-relaxed">{advice.outfit.suit}</p>
              </CardContent>
            </Card>

            {/* 襯衫卡片 */}
            <Card className="bg-stone-900 border-stone-800 shadow-md hover:border-stone-700 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-stone-100">
                  <Shirt className="h-5 w-5 text-stone-500" /> The Ammunition (Shirt)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-400 leading-relaxed">{advice.outfit.shirt}</p>
              </CardContent>
            </Card>
          </div>

          {/* 配件卡片 */}
          <Card className="bg-stone-900 border-stone-800 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-medium text-stone-100">
                <Gem className="h-5 w-5 text-stone-500" /> Hardware (Accessories)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 sm:grid-cols-2">
                {advice.outfit.accessories.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-stone-400">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-stone-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 最終建議: 深色背景與微光邊框 */}
          <div className="bg-stone-950 border border-stone-800 p-6 rounded-xl shadow-inner mt-8">
            <h3 className="font-serif text-xs uppercase tracking-widest text-amber-600 mb-2">Final Directive</h3>
            <p className="text-lg font-light leading-relaxed text-stone-200">{advice.advice}</p>
          </div>

        </div>
      )}
    </div>
  );
}