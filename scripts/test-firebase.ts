// scripts/test-firebase.ts
import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import path from 'path';

// 1. 強制讀取本地環境變數檔案
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('--- START_FIREBASE_AUTH_TEST ---');

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

// 2. 模擬環境變數檢查
if (!projectId || !clientEmail || !privateKey) {
  console.error('❌ ERROR: Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY in env');
  process.exit(1);
}

try {
  // 3. 測試私鑰解析邏輯（模擬 firebase-admin.ts 中的處理方式）
  const formattedKey = privateKey.replace(/\\n/g, '\n');

  // 🔴 修正點：使用 admin.apps 代替 getApps()，並確保 admin 匯入正確
  const { initializeApp, credential, firestore } = admin;

  if (admin.apps.length === 0) {
    initializeApp({
      credential: credential.cert({
        projectId,
        clientEmail,
        privateKey: formattedKey,
      }),
      storageBucket: 'alexis-tailor-system-2025.firebasestorage.app', //
    });
  }

  console.log('✅ SDK initialized successfully.');

  // 4. 測試 Firestore 連線
  const db = firestore();
  async function testConnection() {
    console.log('📡 Testing Firestore connection...');
    const snapshot = await db.collection('catalog').limit(1).get(); //
    console.log(`✅ Connection success! Found ${snapshot.size} items in catalog.`);
    process.exit(0);
  }

  testConnection();
} catch (error) {
  console.error('❌ CRITICAL_ERROR:');
  console.error(error);
  process.exit(1);
}