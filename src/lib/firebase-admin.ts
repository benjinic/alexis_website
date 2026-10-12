import * as admin from 'firebase-admin';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'alexis-tailor-system-2025';
const storageBucketName = (
  process.env.FIREBASE_STORAGE_BUCKET ||
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
  `${projectId}.appspot.com`
)
  .replace(/^gs:\/\//, '')
  .replace(/\/$/, '');

if (!admin.apps.length) {
  try {
    console.log("🔥 [系統啟動] 準備初始化 Firebase Admin...");

    // 🔴 嚴格檢查：必須「信箱」跟「密碼」同時存在，才啟用本地密碼模式
    const hasLocalKeys = process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL;

    if (hasLocalKeys) {
      console.log("💻 [登入模式] 偵測到完整密碼，使用本地金鑰登入...");
      const formattedKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/"/g, '').replace(/\\n/g, '\n');
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: formattedKey,
        }),
        storageBucket: storageBucketName,
      });
    } else {
      console.log("☁️ [登入模式] 無密碼或密碼不完整，啟動 Google 雲端自動刷臉 (ADC) 模式...");
      // 雲端環境直接呼叫 initializeApp()，它會自動抓取最高權限！
      admin.initializeApp({
        projectId,
        storageBucket: storageBucketName,
      });
    }
    
    console.log("✅ [系統啟動] Firebase Admin 初始化成功！");
  } catch (error: any) {
    console.error("❌ [致命錯誤] Firebase Admin 初始化失敗，死因：", error.message);
  }
}

const db = admin.firestore();
export { admin, db, storageBucketName };