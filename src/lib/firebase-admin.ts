import admin from 'firebase-admin';

// 定義專屬 App 名稱
const APP_NAME = 'ALEXIS_WORKER';

export function getFirebaseDB() {
  // 1. 檢查是否已初始化
  const existingApp = admin.apps.find(app => app?.name === APP_NAME);
  if (existingApp) {
    return existingApp.firestore();
  }

  // 2. 讀取環境變數
  const projectId = process.env.ALEXIS_PROJECT_ID;
  const clientEmail = process.env.ALEXIS_CLIENT_EMAIL;
  const privateKeyRaw = process.env.ALEXIS_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    console.error('❌ Admin Init Error: 環境變數缺失');
    // 避免直接 throw 導致冷啟動崩潰，回傳預設實例嘗試運作
    return admin.firestore();
  }

  // 3. 處理私鑰格式
  const cleanKey = privateKeyRaw.replace(/^["']|["']$/g, '').trim();
  const finalKey = cleanKey.replace(/\\n/g, '\n');

  if (!finalKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
     console.error('❌ Admin Init Error: 私鑰格式錯誤');
     return admin.firestore();
  }

  console.log(`🔄 初始化專屬 App: ${APP_NAME}...`);

  // 4. 初始化
  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: finalKey,
    }),
  }, APP_NAME);

  return app.firestore();
}

export const db = {
  collection: (name: string) => getFirebaseDB().collection(name)
} as any;