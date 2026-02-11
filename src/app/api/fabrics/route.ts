import { NextResponse } from 'next/server';
import { getFirebaseDB } from '@/lib/firebase-admin';

// 強制動態渲染，確保每次都抓最新庫存
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔍 API: 正在從 Firebase Inventory 讀取布料...');
    
    // 1. 初始化 Admin SDK
    const db = getFirebaseDB();
    
    // 2. 查詢 Inventory
    // 條件：只抓取標記為 isOnline: true 的布料
    const snapshot = await db.collection('inventory')
      .where('isOnline', '==', true) 
      .get();

    if (snapshot.empty) {
      console.log('⚠️ API: 找不到任何上架布料 (isOnline=true)');
      return NextResponse.json({ fabrics: [] });
    }

    // 3. 資料清洗 (Sanitization)
    const fabrics = snapshot.docs.map(doc => {
      const data = doc.data();
      const stockLength = data.stockLength || 0; // 您的資料庫欄位是 stockLength
      
      // 除錯訊息：印出這塊布的關鍵資訊
      console.log(`📦 布料 [${data.name}]: Stock=${stockLength}, Price=${data.retailPrice}`);

      // 重新組裝安全的物件 (絕對不包含 costPerUnit)
      return {
        id: doc.id,
        name: data.name || 'Unnamed Fabric',
        
        // 價格處理：優先讀取 retailPrice
        price: data.retailPrice || 0, 
        
        category: data.category || 'Standard',
        
        // 圖片處理：您的資料庫欄位是 imageUrl
        // 如果沒有圖片，給一張預設的深色紋理圖
        imageUrl: data.imageUrl || 'https://placehold.co/400x400/1a1a1a/d4af37?text=No+Image',
        
        // 庫存判斷邏輯：stockLength 必須大於 2.5 (做一套西裝的最低用量)
        inStock: stockLength > 2.5,
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
