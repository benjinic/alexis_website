import { NextResponse } from 'next/server';
// 確保名稱與 lib/firebase-admin.ts 導出的名稱一致
import { db, storageBucketName } from '@/lib/firebase-admin';
import { getApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

export const dynamic = 'force-dynamic';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function GET() {
  const results = {
    firestore: false,
    storage: false,
  };
  const errors: string[] = [];

  try {
    await db.collection('_health').limit(1).get();
    results.firestore = true;
  } catch (error) {
    errors.push(`firestore:${getErrorMessage(error)}`);
  }

  try {
    // getMetadata() 需要 storage.buckets.get 權限；
    // getFiles() 只需要 storage.objects.list，同 objectViewer role 已有嘅權限對齊。
    await getStorage(getApp()).bucket(storageBucketName).getFiles({ maxResults: 1 });
    results.storage = true;
  } catch (error) {
    errors.push(`storage:${getErrorMessage(error)}`);
  }

  const ok = results.firestore && results.storage;

  return NextResponse.json(
    {
      ok,
      ...results,
      timestamp: new Date().toISOString(),
      errors,
    },
    { status: ok ? 200 : 500 }
  );
}
