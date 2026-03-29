'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { auth, db } from '@/lib/firebase-client';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateCatalogOrder, CatalogItem } from '@/app/actions/get-products';

const AUTHORIZED_EMAILS = ['benjinic@alyceneverland.com'];
const MAX_UPLOAD_SIZE_MB = 15;
const CATALOG_LOAD_ERROR_MESSAGE = 'CATALOG_LOAD_FAILED';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTestMode, setIsTestMode] = useState(false);
  const [isModeLoading, setIsModeLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // --- 新增：訂單號碼控制器狀態 ---
  const [nextOrderNum, setNextOrderNum] = useState<number | null>(null);
  const [inputNum, setInputNum] = useState<string>('');
  const [isUpdatingNum, setIsUpdatingNum] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const loadTestModeSetting = useCallback(async () => {
    try {
      const settingsRef = doc(db, 'settings', 'system');
      const settingsSnap = await getDoc(settingsRef);
      setIsTestMode(settingsSnap.exists() ? !!settingsSnap.data().testMode : false);
    } catch (error) {
      console.error('TEST_MODE_LOAD_FAILED', error);
    }
  }, []);

  // 網頁載入時，去資料庫抓目前的訂單號碼
  const loadOrderCounter = useCallback(async () => {
    try {
      const counterSnap = await getDoc(doc(db, 'counters', 'orderCounter'));
      if (counterSnap.exists()) {
        const lastNum = counterSnap.data().lastNumber || 14066;
        setNextOrderNum(lastNum + 1); // 顯示「下一筆」會是什麼號碼
        setInputNum(String(lastNum + 1));
      }
    } catch (error) {
      console.error('ORDER_COUNTER_LOAD_FAILED', error);
    }
  }, []);

  // 儲存新號碼的函數
  const handleUpdateOrderNumber = async () => {
    const targetNext = parseInt(inputNum, 10);
    
    if (isNaN(targetNext) || targetNext <= 0) {
      alert("請輸入有效的正整數號碼！");
      return;
    }

    setIsUpdatingNum(true);
    try {
      // 存入資料庫時，自動減 1 變成 lastNumber，並且確保是 Number 格式
      await setDoc(doc(db, 'counters', 'orderCounter'), { 
        lastNumber: targetNext - 1 
      }, { merge: true });
      
      setNextOrderNum(targetNext);
      alert(`✅ 設定成功！下一筆真實訂單號碼將會是：${targetNext}`);
    } catch (error) {
      console.error("更新號碼失敗:", error);
      alert("更新失敗，請檢查權限。");
    } finally {
      setIsUpdatingNum(false);
    }
  };

  const toggleTestMode = async () => {
    try {
      setIsModeLoading(true);
      const nextMode = !isTestMode;
      const settingsRef = doc(db, 'settings', 'system');
      await setDoc(settingsRef, { testMode: nextMode }, { merge: true });
      setIsTestMode(nextMode);
    } catch (error) {
      console.error('TEST_MODE_UPDATE_FAILED', error);
      alert('TEST_MODE_UPDATE_FAILED');
    } finally {
      setIsModeLoading(false);
    }
  };

  const loadCatalogItems = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/catalog');
      const result = await response.json();
      if (result.success) {
        setItems(result.data || []);
      } else {
        console.error(CATALOG_LOAD_ERROR_MESSAGE, result.error);
      }
    } catch (error: any) {
      console.error(CATALOG_LOAD_ERROR_MESSAGE, error?.message || error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const isAuthorized = AUTHORIZED_EMAILS.includes(currentUser.email || '');
        if (!isAuthorized) {
          await signOut(auth);
          setUser(null);
          setLoginError('ACCESS_DENIED: Unauthorized Email');
        } else {
          await loadCatalogItems();
          await loadTestModeSetting();
          await loadOrderCounter();
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadCatalogItems, loadTestModeSetting, loadOrderCounter]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (!AUTHORIZED_EMAILS.includes(result.user.email || '')) {
        await signOut(auth);
        setLoginError('ACCESS_DENIED: Unauthorized Email');
      }
    } catch (error: any) {
      setLoginError('ACCESS_DENIED: Invalid Credentials');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
        alert(`UPLOAD_ERROR: File too large. Max ${MAX_UPLOAD_SIZE_MB}MB.`);
        e.target.value = '';
        setPreviewUrl(null);
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  };

  // 🚀 關鍵修改：使用 fetch 呼叫我們新建的 API
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const rawFormData = new FormData(formElement);
    const title = String(rawFormData.get('title') || '');
    const category = String(rawFormData.get('category') || 'BESPOKE ARCHIVE');

    if (!selectedFile) return alert('UPLOAD_ERROR: NO_FILE_PROVIDED');

    setIsUploading(true);
    setProgress(0);

    try {
      const storage = getStorage(auth.app);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${selectedFile.name.split('.').pop()}`;
      const storageRef = ref(storage, `catalog/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
        (error) => { alert(`UPLOAD_FAILED: ${error.message}`); setIsUploading(false); },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // 🔴 走全新的 API 通道，完美避開 500 錯誤！
          const response = await fetch('/api/admin/catalog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, category, imageUrl: downloadUrl })
          });
          
          const result = await response.json();
          
          if (result.success) {
            setTimeout(() => {
              alert('UPLOAD_SUCCESSFUL');
              setProgress(0);
              setPreviewUrl(null);
              setSelectedFile(null);
              formElement.reset();
            }, 500);
            await loadCatalogItems();
          } else {
            alert(`DATABASE_SAVE_FAILED: ${result.error}`);
          }
          setIsUploading(false);
        }
      );
    } catch (error: any) {
      alert(`SYSTEM_ERROR: ${error.message}`);
      setIsUploading(false);
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    const updatedOrders = newItems.map((item, idx) => ({ id: item.id, order: idx }));
    setItems(newItems.map((item, idx) => ({ ...item, order: idx })));
    await updateCatalogOrder(updatedOrders);
  };

  const handleDelete = async (id: string, src: string) => {
    if (!confirm('CONFIRM_DELETE_IMAGE?')) return;
    try {
      let imagePath = '';
      if (src) {
        imagePath = src.includes('/o/')
          ? decodeURIComponent(src.split('/o/')[1].split('?')[0])
          : decodeURIComponent(new URL(src).pathname.split('/').slice(2).join('/'));
      }
      const response = await fetch('/api/admin/catalog', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, imagePath }),
      });
      const result = await response.json();
      if (result.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        alert('DELETED_SUCCESSFULLY');
      } else {
        alert(`DELETE_FAILED: ${result.error}`);
      }
    } catch (err: any) {
      alert(`DELETE_ERROR: ${err?.message || err}`);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-stone-700">SYSTEM_BOOTING...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-8">
        <h1 className="text-white font-mono text-xs tracking-widest uppercase opacity-50">Private_Access_Only</h1>
        <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4 w-72">
          <input type="email" placeholder="ADMIN_EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-black border border-stone-800 p-3 text-xs font-mono text-white focus:border-stone-500 outline-none transition-colors" />
          <input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-black border border-stone-800 p-3 text-xs font-mono text-white focus:border-stone-500 outline-none transition-colors" />
          {loginError && <p className="text-red-500 text-[10px] font-mono uppercase">{loginError}</p>}
          <button type="submit" className="mt-4 px-8 py-3 bg-white text-black font-bold text-[10px] tracking-widest uppercase hover:bg-stone-300 transition-all">AUTHORIZE_ACCESS</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-50 pt-44 pb-20 px-6">
      <div className="max-w-2xl mx-auto space-y-20">
        <div className="flex justify-between items-end border-b border-stone-900 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">ADMIN_PORTAL</h1>
            <p className="font-mono text-[9px] text-stone-500 mt-2 uppercase tracking-widest">User: {user.email}</p>
          </div>
          <button onClick={() => signOut(auth)} className="text-[9px] font-mono text-stone-700 hover:text-white uppercase transition-colors">[ Logout ]</button>
        </div>

        {/* 系統控制器區塊 */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 測試模式開關 */}
          <div className="p-6 border border-stone-800 bg-stone-900/50 flex flex-col justify-between rounded-sm">
            <div>
              <h3 className="font-bold text-sm text-white tracking-widest uppercase mb-2">System Mode</h3>
              <p className="font-mono text-[10px] text-stone-500 mb-6">
                {isTestMode ? "Testing environment active. Real order numbers are paused." : "Live environment active. Real order numbers will be generated."}
              </p>
            </div>
            <button 
              onClick={toggleTestMode}
              disabled={isModeLoading}
              className={`w-full py-3 font-bold font-mono text-[10px] uppercase tracking-widest transition-colors ${
                isTestMode 
                  ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30' 
                  : 'bg-green-500/20 text-green-500 border border-green-500/50 hover:bg-green-500/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isModeLoading ? '[ UPDATING... ]' : isTestMode ? '[ 🔴 Disable Test Mode ]' : '[ 🟢 Enable Test Mode ]'}
            </button>
          </div>

          {/* 訂單號碼控制器 */}
          <div className="p-6 border border-stone-800 bg-stone-900/50 flex flex-col justify-between rounded-sm">
            <div>
              <h3 className="font-bold text-sm text-white tracking-widest uppercase mb-2">Next Order Number</h3>
              <p className="font-mono text-[10px] text-stone-500 mb-4">
                Current next in line: <span className="text-white font-bold">{nextOrderNum !== null ? nextOrderNum : 'Loading...'}</span>
              </p>
              <div className="flex gap-2 mb-2">
                <input 
                  type="number" 
                  value={inputNum}
                  onChange={(e) => setInputNum(e.target.value)}
                  className="flex-grow bg-black border border-stone-700 p-2 font-mono text-sm text-white focus:border-stone-400 outline-none"
                  placeholder="e.g. 14067"
                />
                <button 
                  onClick={handleUpdateOrderNumber}
                  disabled={isUpdatingNum}
                  className="px-4 bg-white text-black font-bold font-mono text-[10px] uppercase tracking-widest hover:bg-stone-300 disabled:opacity-50"
                >
                  {isUpdatingNum ? 'Saving...' : 'Update'}
                </button>
              </div>
              <p className="font-mono text-[9px] text-stone-600">Enter the exact number you want for the next order.</p>
            </div>
          </div>

        </div>

        <section className="space-y-8 bg-stone-900/20 p-8 border border-white/5 relative">
          {isUploading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-stone-800 overflow-hidden rounded-t-md">
              <div className="h-full bg-white transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
            </div>
          )}

          <h2 className="font-mono text-[10px] text-stone-400 tracking-[0.3em] uppercase underline underline-offset-8">Upload_New_Archive</h2>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-4">
              {previewUrl ? (
                <div className="relative aspect-[3/4] w-full bg-black border border-stone-800 overflow-hidden group">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" />
                  <button type="button" onClick={() => { setPreviewUrl(null); setSelectedFile(null); (document.getElementById('file-upload') as HTMLInputElement).value = ''; }} className="absolute top-2 right-2 bg-black/60 p-2 text-[9px] font-mono hover:bg-red-500 transition-colors uppercase">[ Remove_File ]</button>
                </div>
              ) : (
                <div className="group relative border border-dashed border-stone-800 p-12 text-center bg-black/40 hover:bg-black/60 transition-colors">
                  <input type="file" name="image" id="file-upload" accept="image/*" onChange={handleFileChange} required className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="space-y-2">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-stone-400">[ SELECT_VISUAL_ASSET ]</p>
                    <p className="text-[8px] text-stone-600 font-mono">SUPPORTED: JPG, PNG, WEBP</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="title" placeholder="LOOK_TITLE" required className="bg-black border border-stone-800 p-3 text-xs font-mono focus:border-stone-500 outline-none transition-colors" />
              <input type="text" name="category" placeholder="CATEGORY" defaultValue="BESPOKE ARCHIVE" className="bg-black border border-stone-800 p-3 text-xs font-mono focus:border-stone-500 outline-none transition-colors" />
            </div>
            <button type="submit" disabled={isUploading} className="w-full py-4 bg-white text-black font-bold text-[10px] tracking-[0.4em] uppercase hover:bg-stone-200 transition-colors disabled:opacity-50">
              {isUploading ? `PROCESSING... ${progress}%` : 'EXECUTE_UPLOAD'}
            </button>
          </form>
        </section>

        <section className="max-w-2xl mx-auto mt-20 space-y-6">
          <h2 className="font-mono text-[10px] text-stone-500 tracking-[0.3em] uppercase underline underline-offset-8">Manage_Display_Order</h2>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between bg-stone-900/20 p-4 border border-white/5">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[9px] text-stone-700 w-4">{index + 1}</span>
                  <div className="relative w-10 h-14 bg-black overflow-hidden"><Image src={item.src} alt={item.title} fill sizes="40px" className="object-cover opacity-60" /></div>
                  <div><h3 className="text-[11px] font-bold uppercase truncate w-32 md:w-48">{item.title}</h3></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="p-2 text-stone-500 hover:text-white disabled:opacity-0 transition-colors">▲</button>
                    <button onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1} className="p-2 text-stone-500 hover:text-white disabled:opacity-0 transition-colors">▼</button>
                  </div>
                  <button onClick={() => handleDelete(item.id, item.src)} className="text-[9px] font-mono text-stone-800 hover:text-red-500 transition-colors uppercase ml-4">[ REMOVE ]</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}