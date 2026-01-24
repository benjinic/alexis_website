'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FullScreenMenu from './full-screen-menu';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Only show the header on pages other than the homepage
  if (pathname === '/') {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="w-10"></div>
          <Link href="/" className="font-headline text-lg tracking-widest text-foreground">
            ALEXIS BESPOKE
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-foreground"
          >
            {isMenuOpen ? <X /> : <Menu />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </header>
      <FullScreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
