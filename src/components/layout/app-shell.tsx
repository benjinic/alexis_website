'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBespokeApp = pathname?.startsWith('/bespoke') ?? false;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 ${isBespokeApp ? 'w-full ml-0' : ''}`}>{children}</main>
      {!isBespokeApp && <Footer />}
    </div>
  );
}