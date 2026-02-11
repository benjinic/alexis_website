'use client';

import { useState, useRef } from 'react';
import { getLookAnalysis } from '@/app/actions/ai';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Loader2, Camera, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface AnalysisResult {
  verdict: string;
  score: number;
  critique: string;
  improvements: string[];
}

export default function LookDecoderModal() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 檢查檔案大小 (限制 4MB)
      if (file.size > 4 * 1024 * 1024) {
        toast({ title: "File too large", description: "Even my patience has limits. Max 4MB.", variant: "destructive" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null); // 重置結果
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);

    try {
      const analysis = await getLookAnalysis(imagePreview);
      setResult(analysis as unknown as AnalysisResult);
    } catch (error) {
      console.error(error);
      toast({ title: "Analysis Failed", description: "Visual sensors overloaded. Try a clearer photo.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-stone-100 text-stone-900 hover:bg-white font-bold tracking-wider border border-stone-200">
          <Camera className="mr-2 h-4 w-4" /> UPLOAD LOOK
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-stone-950 border-stone-800 text-stone-50 sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-amber-500 font-serif text-2xl text-center tracking-tight">
            VISUAL DECODER
          </DialogTitle>
          <p className="text-center text-stone-500 text-sm uppercase tracking-widest">
            Submit your outfit for judgment
          </p>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2 mt-4">
          
          {/* 左側：圖片上傳區 */}
          <div className="space-y-4">
            <div 
              className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border-2 border-dashed border-stone-800 bg-stone-900/50 flex flex-col items-center justify-center cursor-pointer hover:border-stone-600 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Upload className="h-10 w-10 text-stone-600 mx-auto" />
                  <p className="text-stone-500 text-sm">Click to upload <br/> (Max 4MB)</p>
                </div>
              )}
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={!imagePreview || isAnalyzing}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold"
            >
              {isAnalyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> DECIPHERING...</> : 'ANALYZE LOOK'}
            </Button>
          </div>

          {/* 右側：分析結果區 */}
          <div className="space-y-4">
            {result ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4">
                
                {/* 評分卡 */}
                <Card className="bg-stone-900 border-stone-800">
                  <CardContent className="p-6 text-center">
                    <div className="text-stone-500 text-xs uppercase tracking-widest mb-1">Style Score</div>
                    <div className="text-5xl font-serif text-white">{result.score}<span className="text-stone-600 text-2xl">/10</span></div>
                    <div className="text-amber-500 font-bold mt-2 uppercase tracking-wide border-t border-stone-800 pt-2 inline-block">
                      {result.verdict}
                    </div>
                  </CardContent>
                </Card>

                {/* 評論 */}
                <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-md">
                  <h4 className="text-red-500 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3" /> Violation Report
                  </h4>
                  <p className="text-stone-300 text-sm leading-relaxed italic">
                    "{result.critique}"
                  </p>
                </div>

                {/* 改進建議 */}
                <div className="space-y-2">
                  <h4 className="text-stone-500 text-xs uppercase tracking-widest">Corrective Actions</h4>
                  <ul className="space-y-2">
                    {result.improvements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-stone-400">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500/50 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-700 text-sm italic p-8 text-center border border-stone-900 rounded-lg">
                "I'm waiting to see what tragic ensemble you've assembled today." <br/> - Alexis
              </div>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}