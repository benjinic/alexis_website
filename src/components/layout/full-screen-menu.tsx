
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

type FullScreenMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function FullScreenMenu({ isOpen, onClose }: FullScreenMenuProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-opacity duration-500 ease-in-out',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div className="container mx-auto flex h-full items-center justify-center">
        <nav>
          <ul className="flex flex-col items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    'font-headline text-4xl md:text-6xl uppercase tracking-wider text-foreground/70 transition-colors hover:text-foreground',
                    pathname === link.href && 'text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
