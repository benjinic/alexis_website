import type { NextApiRequest, NextApiResponse } from 'next';
import { admin, storageBucketName } from '@/lib/firebase-admin';

type CatalogResponse =
  | { success: true; data: any[] | Record<string, any> }
  | { success: false; error: string };

async function handleGet(res: NextApiResponse<CatalogResponse>) {
  const adminDb = admin.firestore();
  const snapshot = await adminDb.collection('catalog').orderBy('order', 'asc').get();

  // 備用邏輯：如果 catalog 是空的，去 inventory 抓
  if (snapshot.empty) {
    const inventorySnapshot = await adminDb.collection('inventory').get();
    if (inventorySnapshot.empty) {
      return res.status(200).json({ success: true, data: [] });
    }

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

    return res.status(200).json({ success: true, data: items });
  }

  const items = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      src: data.imageUrl || '',
      title: data.title || 'Untitled',
      category: data.category || 'Archive',
      order: Number(data.order) || 0,
    };
  });

  return res.status(200).json({ success: true, data: items });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse<CatalogResponse>) {
  const title = String(req.body?.title || '').trim();
  const category = String(req.body?.category || 'BESPOKE ARCHIVE').trim();
  const imageUrl = String(req.body?.imageUrl || '').trim();

  if (!title) {
    return res.status(400).json({ success: false, error: 'VALIDATION_ERROR: title is required' });
  }

  if (!imageUrl) {
    return res.status(400).json({ success: false, error: 'VALIDATION_ERROR: imageUrl is required' });
  }

  const adminDb = admin.firestore();
  const catalogRef = adminDb.collection('catalog');

  // 為新項目配置尾部排序值，避免重排前發生衝突。
  const lastItemSnapshot = await catalogRef.orderBy('order', 'desc').limit(1).get();
  const nextOrder = lastItemSnapshot.empty
    ? 0
    : Number(lastItemSnapshot.docs[0].data().order || 0) + 1;

  const docRef = await catalogRef.add({
    title,
    category,
    imageUrl,
    order: nextOrder,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return res.status(200).json({
    success: true,
    data: {
      id: docRef.id,
      src: imageUrl,
      title,
      category,
      order: nextOrder,
    },
  });
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse<CatalogResponse>) {
  const id = String(req.body?.id || '').trim();
  const imagePath = String(req.body?.imagePath || '').trim();

  if (!id) {
    return res.status(400).json({ success: false, error: 'VALIDATION_ERROR: id is required' });
  }

  const adminDb = admin.firestore();
  await adminDb.collection('catalog').doc(id).delete();

  if (imagePath) {
    try {
      const bucket = admin.storage().bucket(storageBucketName);
      await bucket.file(imagePath).delete();
    } catch (storageError: any) {
      // Storage delete failure is non-fatal — Firestore doc is already gone.
      console.warn('Storage delete skipped:', storageError?.message);
    }
  }

  return res.status(200).json({ success: true, data: { id } });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CatalogResponse>) {
  try {
    if (req.method === 'GET') {
      return await handleGet(res);
    }

    if (req.method === 'POST') {
      return await handlePost(req, res);
    }

    if (req.method === 'DELETE') {
      return await handleDelete(req, res);
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  } catch (error: any) {
    console.error('API /pages/api/admin/catalog Error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'UNKNOWN_ERROR' });
  }
}
