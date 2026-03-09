'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FullScreenMenu } from './full-screen-menu';
import { ShoppingBag, User as UserIcon, LogOut } from 'lucide-react'; 

import { auth } from '@/lib/firebase-client';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth'; 

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setAuthUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("登出失敗:", error);
    }
  };

  if (pathname === '/') return null;

  const displayName = authUser?.displayName?.split(' ')[0] || authUser?.email?.split('@')[0] || 'VIP';

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-[var(--z-header)] bg-stone-950/70 backdrop-blur-md border-b border-white/10 text-white">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between relative">
        
        <div className="flex-1 flex justify-start">
          <FullScreenMenu />
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-space_mono font-bold text-xl md:text-2xl tracking-tighter text-white">
              ALEXIS
            </span>
            <span className="text-[10px] md:text-xs font-mono font-normal tracking-[0.3em] text-white mt-1 transition-colors">
              BESPOKE
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-end gap-4 md:gap-5">
          
          {authUser ? (
            <div className="flex items-center gap-3 border-r border-white/20 pr-4 md:pr-5">
              <span className="hidden md:block font-mono text-[10px] text-stone-400 tracking-widest uppercase truncate max-w-[80px]">
                {displayName}
              </span>
              <button 
                onClick={handleLogout} 
                className="text-white hover:text-stone-400 transition-colors flex items-center"
                title="Logout"
              >
                <LogOut className="w-[18px] h-[18px]" />
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="text-white hover:text-stone-400 transition-colors border-r border-white/20 pr-4 md:pr-5 flex items-center"
              title="Client Portal"
            >
              <UserIcon className="w-5 h-5" />
            </Link>
          )}

          <Link href="/cart" className="text-white hover:text-stone-400 transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </Link>

          <Link href="/booking" className="hidden sm:block">
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-stone-950 font-mono tracking-widest text-[10px] h-8 px-4 transition-all"
            >
              BOOK NOW
            </Button>
          </Link>
          
        </div>
      </div>
    </header>
  );
}