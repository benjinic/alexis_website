// src/components/TypingIndicator.tsx
import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex space-x-1 p-2 bg-gray-100 rounded-lg w-fit">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
  );
}