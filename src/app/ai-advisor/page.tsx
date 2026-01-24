'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { aiStyleAdvisor } from '@/ai/flows/ai-style-advisor';
import { analyzeLook } from '@/ai/flows/ai-look-decoder'; // ✅ 匯入圖片分析功能
import { Camera, Paperclip, X } from 'lucide-react'; // 使用 icon

type Message = {
  role: 'user' | 'model';
  text?: string;
  image?: string; // ✅ 新增圖片欄位
};

const SUGGESTED_PROMPTS = [
  "Attending my ex's wedding. Need to look dangerous.",
  "Tokyo Jazz Bar date. Classy but relaxed.",
  "Black tie event, but I hate stiff tuxedos.",
  "Summer rooftop party in Hong Kong heat.",
];

export default function AIAdvisorPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'I am Alexis. Upload a look you like, or tell me the occasion.' }
  ]);
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // ✅ 檔案輸入參照

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 處理文字發送 ---
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setLoading(true);

    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    try {
      const result = await aiStyleAdvisor({ occasionOrMood: userText });
      if (result?.styleProtocol) {
        setMessages(prev => [...prev, { role: 'model', text: result.styleProtocol }]);
      } else {
        throw new Error("No response");
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "The tailor is busy. Try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  // --- 處理圖片上傳 ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 檢查檔案大小 (例如限制 4MB)
    if (file.size > 4 * 1024 * 1024) {
      alert("Image is too large. Keep it under 4MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target?.result as string;
      
      setLoading(true);
      // 1. 顯示使用者上傳的圖片
      setMessages(prev => [...prev, { role: 'user', image: base64Image }]);

      try {
        // 2. 呼叫後端圖片分析
        const result = await analyzeLook({ imageDataUri: base64Image });
        
        // 3. 顯示分析結果
        if (result?.styleAnalysis) {
          setMessages(prev => [...prev, { role: 'model', text: result.styleAnalysis }]);
        }
      } catch (error) {
        console.error("Image Analysis Error:", error);
        setMessages(prev => [...prev, { role: 'model', text: "I can't see this image clearly. Try another one." }]);
      } finally {
        setLoading(false);
        // 清空 input 讓使用者可以再次上傳同一張圖
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePromptClick = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/90 border-b border-neutral-800 p-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="tracking-widest text-sm text-neutral-400">ALEXIS AI CORE</span>
        </div>
        <Link href="/" className="text-xs border border-white px-3 py-1 hover:bg-white hover:text-black transition-colors">
          EXIT
        </Link>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto pt-20 pb-40 px-4 md:px-20">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-4 text-sm leading-relaxed tracking-wide shadow-lg
                  ${msg.role === 'user' 
                    ? 'bg-neutral-900 border border-neutral-700 text-neutral-300' 
                    : 'bg-transparent border-l-2 border-purple-500 pl-4 text-purple-400'
                  }`}
              >
                {msg.role === 'model' && <span className="block text-[10px] text-neutral-600 mb-1 uppercase tracking-widest">Alexis Bespoke</span>}
                
                {/* 顯示文字 */}
                {msg.text && <div className="whitespace-pre-wrap">{msg.text}</div>}
                
                {/* 顯示圖片 */}
                {msg.image && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-neutral-700">
                    <img src={msg.image} alt="User upload" className="max-w-full h-auto max-h-64 object-cover" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
               <div className="bg-transparent border-l-2 border-purple-900 pl-4 text-purple-900 text-sm animate-pulse">
                 Analyzing Visual Data...
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 w-full bg-black border-t border-neutral-800 p-4 md:p-6 z-40">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          
          {/* Suggestion Chips */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mask-fade-right">
            {SUGGESTED_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="whitespace-nowrap px-4 py-2 bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 hover:text-purple-400 hover:border-purple-500 hover:bg-neutral-800 transition-all duration-300 rounded-sm"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex gap-4 items-center">
            {/* ✅ 隱藏的檔案輸入框 */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            
            {/* ✅ 上傳按鈕 */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="p-3 bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white hover:border-purple-500 transition-all"
              title="Upload Image"
            >
              <Camera size={20} />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe the occasion..."
              className="flex-1 bg-neutral-900 border-none outline-none text-white px-4 py-3 font-mono text-sm focus:ring-1 focus:ring-purple-900 placeholder:text-neutral-700"
              autoFocus
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-white text-black px-6 py-3 text-xs font-bold tracking-widest hover:bg-neutral-200 disabled:opacity-50"
            >
              SEND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}