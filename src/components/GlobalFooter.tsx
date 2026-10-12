'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/layout/footer';

export default function GlobalFooter() {
  const pathname = usePathname();
  const isBespokeApp = pathname?.startsWith('/bespoke') ?? false;

  // 新品牌首頁有自己的頁尾
  if (isBespokeApp || pathname === '/') {
    return null;
  }

  return <Footer />;
}