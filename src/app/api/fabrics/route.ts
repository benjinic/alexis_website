// src/app/api/fabrics/route.ts
import { NextResponse } from 'next/server';
import { getFirebaseDB } from '@/lib/firebase-admin';

// 強制動態渲染：確保每次重新整理都抓到最新庫存，而不是抓到快取
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔍 API: 正在從 Firebase Inventory 讀取布料...');
    
    // 1. 初始化 Admin SDK
    const db = getFirebaseDB();
    
    // 2. 查詢 Inventory
    // 條件：只抓取標記為 isOnline: true 的布料
    // 注意：如果您還沒在 Firebase 設 isOnline，這行可能會抓不到資料，建議先測試不加 .where()
    const snapshot = await db.collection('inventory')
      .where('isOnline', '==', true) 
      .get();

    if (snapshot.empty) {
      console.log('⚠️ API: 找不到任何上架布料 (isOnline=true)');
      return NextResponse.json({ fabrics: [] });
    }

    // 3. 資料清洗 (Data Sanitization) - 這是安全性的關鍵！
    const fabrics = snapshot.docs.map(doc => {
      const data = doc.data();
      
      // 我們重新組裝一個物件，絕對不包含 costPerUnit
      return {
        id: doc.id,
        name: data.name || 'Unnamed Fabric',
        // 如果沒有填 retailPrice，為了安全起見顯示 0 或標記為詢價
        price: data.retailPrice || 0, 
        category: data.category || 'Standard',
        // 如果沒有圖片，給一張預設圖
        imageUrl: data.textureUrl || 'https://placehold.co/400x400/1a1a1a/d4af37?text=Fabric',
        // 簡單邏輯：庫存 > 2.5米才算有貨
        inStock: (data.stockLength || 0) > 2.5,
      };
    });

    console.log(`✅ API: 成功回傳 ${fabrics.length} 款布料`);
    return NextResponse.json({ fabrics });

  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fabrics', details: error.message },
      { status: 500 }
    );
  }
}