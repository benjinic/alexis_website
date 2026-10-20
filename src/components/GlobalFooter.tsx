'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/layout/footer';

// 品牌頁每頁自成一屏，唔加頁尾（否則要向下碌先見到）；版權字喺 VISIT 頁底
const ONE_SCREEN_PAGES = ['/', '/rules', '/lookbook', '/visit'];

export default function GlobalFooter() {
  const pathname = usePathname();
  const isBespokeApp = pathname?.startsWith('/bespoke') ?? false;

  if (isBespokeApp || ONE_SCREEN_PAGES.includes(pathname ?? '')) {
    return null;
  }

  return <Footer />;
}
