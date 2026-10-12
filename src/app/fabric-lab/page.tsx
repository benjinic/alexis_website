'use client';

import { useRouter } from 'next/navigation';
import FabricLab from '@/components/bespoke/FabricLab';

/**
 * /fabric-lab — 獨立的布料資料庫瀏覽頁。
 *
 * 讓客人毋須先經過 GARMENT 選擇，就可以直接瀏覽 Firestore `inventory`
 * 集合內所有上架布料。點選 「BEGIN BESPOKE PROTOCOL」後導向 `/bespoke`
 * 正式進入三步客製化流程（GARMENT → FABRIC → CUSTOMIZE）。
 */
export default function FabricLabPage() {
  const router = useRouter();

  return (
    <FabricLab
      title="Fabric Lab"
      backLabel="< RETURN_HOME"
      onBack={() => router.push('/')}
      ctaLabel="BEGIN BESPOKE PROTOCOL"
      onMount={(fabric) => router.push(`/bespoke?fabricId=${encodeURIComponent(fabric.id)}`)}
    />
  );
}
