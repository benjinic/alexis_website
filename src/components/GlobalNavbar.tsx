'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';

export default function GlobalNavbar() {
  const pathname = usePathname();

  // 新品牌首頁有自己的頁首
  if (pathname === '/') {
    return null;
  }

  return <Header />;
}
