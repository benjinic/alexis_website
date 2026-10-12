import { getCatalogItems } from '@/app/actions/get-products';
import CatalogClient from './CatalogClient';

// 🔴 強制每次請求都即時渲染，關閉靜態快取
export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  const items = await getCatalogItems();
  return <CatalogClient items={items || []} />;
}