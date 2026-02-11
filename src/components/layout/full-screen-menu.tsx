'use client';

// // 引入必要的 UI 組件、圖示庫以及 Next.js 導航功能 //
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, ArrowRight, Instagram, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';

// // 匯出全螢幕選單組件，使用具名匯出以確保在其他組件（如 Header）中引用邏輯清晰 //
export function FullScreenMenu() {
  // // 定義選單的開啟狀態，用於控制側邊欄的顯示與隱藏 //
  const [isOpen, setIsOpen] = useState(false);

  // // 定義導航清單數據，集中管理連結路徑與標籤，確保全站導航結構統一 //
  const menuItems = [
    { label: 'CATALOG', href: '/catalog' },
    { label: 'PROCESS', href: '/process' },
    { label: 'COLLECTION', href: '/collection' },
    { label: 'AI ADVISOR', href: '/visual-intelligence' },
    { label: 'BOOK NOW', href: '/booking' },
  ];

  return (
    // // Sheet 根組件：受控於 isOpen 狀態，處理側邊欄的彈出邏輯 //
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      
      
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-stone-800 transition-colors">
          <Menu className="w-6 h-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      
      
      <SheetContent side="left" className="w-full sm:max-w-xs bg-white border-l border-white p-0 text-carbon-black">
        
       
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Main site navigation</SheetDescription>

        <div className="flex flex-col h-full">
         
          <div className="p-8 border-b border-stone-500">
            <div className="font-space_mono font-bold text-xl md:text-2xl tracking-tighter text-carbon-black flex items-center gap-2">
              ALEXIS
              <span className="text-[10px] md:text-xs font-mono font-normal tracking-[0.3em] text-midnight-violet mt-1">
                BESPOKE
              </span>
            </div>
          </div>

        
          <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-6">
            {menuItems.map((item, index) => (
              <div key={index} className="group">
                
                <Link 
                  href={item.href} 
                  onClick={() => setIsOpen(false)}
                  className="block group-hover:translate-x-2 transition-transform duration-300"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-roboto-condensed font-bold text-carbon-black transition-colors">
                      {item.label}
                    </span>
                  </div>
                </Link>
              
                {index !== menuItems.length - 1 && (
                  <Separator className="mt-6 bg-white" />
                )}
              </div>
            ))}
          </nav>

          
          <div className="p-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Location</h4>
                <p className="text-sm text-stone-400">Room 602, 6/f Wing fu builing, Wing kut street,<br/>Central,<br/>HONG KONG</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Contact</h4>
                <p className="text-sm text-stone-400">benjinic@alyceneverland.com<br/>+852 97031920</p>
              </div>
            </div>
           
            <div className="flex gap-4 pt-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-white hover:bg-stone-800 rounded-full">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-white hover:bg-stone-800 rounded-full">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-white hover:bg-stone-800 rounded-full">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}