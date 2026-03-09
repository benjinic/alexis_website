'use server';

import { Buffer } from 'buffer';
import { db as adminDb, admin } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

// --- [隔離區：Catalog 專用接口與函數] ---
export interface CatalogItem {
  id: string;
  src: string;      // 對應資料庫中的 imageUrl
  title: string;    // 對應資料庫中的 title
  category: string; // 對應資料庫中的 category
  order: number;
}

export async function getCatalogItems() {
  try {
    const snapshot = await adminDb.collection('catalog')
                             .orderBy('order', 'asc')
                             .get();

    if (snapshot.empty) {
      const inventorySnapshot = await adminDb.collection('inventory').get();
      if (inventorySnapshot.empty) return [];

      return inventorySnapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot, index: number) => {
        const data = doc.data();
        return {
          id: doc.id,
          src: data.imageUrl || '',
          title: data.name || data.title || 'Untitled',
          category: data.category || 'Archive',
          order: index,
        };
      }) as CatalogItem[];
    }

    return snapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        id: doc.id,
        src: data.imageUrl || '', // 必須確保此處不為 null
        title: data.title || 'Untitled',
        category: data.category || 'Archive',
        order: Number(data.order) || 0
      };
    }) as CatalogItem[];
  } catch (error) {
    console.error('Fetch Catalog Error:', error);
    return []; 
  }
}

export interface InventoryItem {
  id: string;
  title: string;
  category: string;
  price: string;
  image: string;
  description?: string;
}

export async function getInventoryItems() {
  try {
    const snapshot = await adminDb.collection('inventory').get();
    
    if (snapshot.empty) {
      return [];
    }

    const items = snapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.name || 'Untitled Item', 
        category: data.category || 'Other',
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

/**
 * 🔴 修復版：使用前端直傳的圖片網址儲存紀錄
 * 不再重新 import firebase，直接使用全域的 adminDb
 */
export async function saveCatalogRecord(title: string, category: string, imageUrl: string) {
  console.log('🚀 [Server Action] 1. 收到前端網址，準備寫入資料庫！');
  try {
    console.log('🚀 [Server Action] 2. 準備呼叫 adminDb...');
    const catalogRef = adminDb.collection('catalog');

    console.log('🚀 [Server Action] 3. 正在計算目前資料庫數量...');
    const snapshot = await catalogRef.get();
    const order = snapshot.size;

    console.log('🚀 [Server Action] 4. 準備寫入 Firestore...');
    await catalogRef.add({
      title,
      category,
      imageUrl: imageUrl,
      order,
      createdAt: new Date(),
    });

    console.log('🚀 [Server Action] 5. 寫入成功！準備更新快取...');
    revalidatePath('/catalog');
    revalidatePath('/bespoke');
    revalidatePath('/admin');

    console.log('🚀 [Server Action] 6. 全部完成，回傳成功訊號！');
    return { success: true };
  } catch (error: any) {
    console.error('🔥 [Server Action] 發生錯誤崩潰啦：', error);
    return { success: false, error: error.message };
  }
}

export async function uploadCatalogImage(formData: FormData) {
  try {
    const file = formData.get('image') as File;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;

    if (!file) throw new Error('NO_FILE_PROVIDED');

    const bucket = admin.storage().bucket('alexis-tailor-system-2025.firebasestorage.app');
    const fileName = `catalog/${Date.now()}_${file.name}`;
    const fileUpload = bucket.file(fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fileUpload.save(buffer, { metadata: { contentType: file.type } });

    const [url] = await fileUpload.getSignedUrl({ action: 'read', expires: '01-01-2050' });

    await adminDb.collection('catalog').add({
      imageUrl: url,
      title: title || 'Untitled',
      category: category || 'Archive',
      order: String(Date.now()),
      createdAt: new Date(),
    });

    revalidatePath('/catalog'); 
    revalidatePath('/bespoke');
    return { success: true };
  } catch (error) {
    console.error('Upload Error:', error);
    return { success: false, error: String(error) };
  }
}

export async function deleteCatalogItem(id: string, imagePath: string) {
  try {
    await adminDb.collection('catalog').doc(id).delete();

    const bucket = admin.storage().bucket('alexis-tailor-system-2025.firebasestorage.app');
    const file = bucket.file(imagePath);
    await file.delete();

    revalidatePath('/catalog');
    revalidatePath('/bespoke');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Delete Error:', error);
    return { success: false, error: String(error) };
  }
}

export async function updateCatalogOrder(items: { id: string; order: number }[]) {
  try {
    const db = adminDb;
    const batch = db.batch();

    items.forEach((item) => {
      const docRef = db.collection('catalog').doc(item.id);
      batch.update(docRef, { order: item.order });
    });

    await batch.commit();
    revalidatePath('/catalog');
    revalidatePath('/collection');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Update Order Error:', error);
    return { success: false, error: String(error) };
  }
}