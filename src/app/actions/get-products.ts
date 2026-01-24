'use server';

import { getFirebaseDB } from '@/lib/firebase-admin';

// 1. 定義前端 Component 需要的格式
export interface InventoryItem {
  id: string;
  title: string;    // 對應 database 的 name
  category: string; // 對應 database 的 category
  price: string;    // 對應 database 的 costPerUnit + unit
  image: string;    // 對應 database 的 imageUrl
  description?: string;
}

export async function getInventoryItems() {
  try {
    const db = getFirebaseDB();
    
    // 2. 讀取 'inventory' 集合
    const snapshot = await db.collection('inventory').get();
    
    if (snapshot.empty) {
      console.log('No matching documents in inventory.');
      return [];
    }

    // 3. 資料轉換 (Mapping)
    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      
      return {
        id: doc.id,
        // 把 inventory 的欄位 "翻譯" 給前端看
        title: data.name || 'Untitled Item', 
        category: data.category || 'Other',
        // 組合價格字串： "HKD 480 / meters"
        price: `HKD ${data.costPerUnit} / ${data.unit}`, 
        image: data.imageUrl || '',
        description: data.description || ''
      };
    }) as InventoryItem[];

    return items;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
}