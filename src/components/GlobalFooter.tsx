'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/layout/footer';

export default function GlobalFooter() {
  const pathname = usePathname();
  const isBespokeApp = pathname?.startsWith('/bespoke') ?? false;

  if (isBespokeApp) {
    return null;
  }

  return <Footer />;
}