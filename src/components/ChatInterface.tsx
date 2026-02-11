'use client'; // 👈 這一行很重要，因為我們要用 useState

import React, { useState } from 'react';
import TypingIndicator from './TypingIndicator'; // 引入剛剛做的動畫元件

export default function ChatInterface() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  
  // ✨ 1. 新增這個狀態
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 加入使用者的訊息
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // ✨ 2. 開始載入：顯示動畫
    setIsLoading(true);

    try {
      // 呼叫您的 API (這裡假設您已經有 fetch 邏輯)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await response.json();
      
      // 加入 AI 的訊息
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: "抱歉，我現在有點累，請稍後再試。" }]);
    } finally {
      // ✨ 3. 結束載入：隱藏動畫
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg p-4 bg-white shadow-sm">
      {/* 訊息顯示區 */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-[80%] ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* ✨ 4. 關鍵位置：在這裡插入動畫元件 */}
        {isLoading && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}
      </div>

      {/* 輸入區 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="詢問有關西裝風格的問題..."
          disabled={isLoading} // 載入時禁止輸入，避免重複送出
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          發送
        </button>
      </div>
    </div>
  );
}