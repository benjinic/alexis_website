import { admin } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

// 貼在 app/api/admin/catalog/route.ts 原有程式碼的最下方
export async function GET() {
  try {
    const adminDb = admin.firestore();
    const snapshot = await adminDb.collection('catalog').orderBy('order', 'asc').get();

    // 備用邏輯：如果 catalog 是空的，去 inventory 抓
    if (snapshot.empty) {
      const inventorySnapshot = await adminDb.collection('inventory').get();
      if (inventorySnapshot.empty) return NextResponse.json({ success: true, data: [] });

      const items = inventorySnapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
          id: doc.id,
          src: data.imageUrl || '',
          title: data.name || data.title || 'Untitled',
          category: data.category || 'Archive',
          order: index,
        };
      });
      return NextResponse.json({ success: true, data: items });
    }

    // 正常回傳 catalog 資料
    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        src: data.imageUrl || '',
        title: data.title || 'Untitled',
        category: data.category || 'Archive',
        order: Number(data.order) || 0
      };
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    console.error('API GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}