'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '@/lib/firebase-client';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams?.get('redirect') || '/';
  const redirectUrl = (() => {
    if (!rawRedirect.startsWith('/')) return '/';
    if (rawRedirect.startsWith('//')) return '/';
    if (rawRedirect.includes('\\')) return '/';
    return rawRedirect;
  })();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false); // 切換登入或註冊模式
  
  // 表單狀態
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const ensureCustomerProfile = async (
    user: { uid: string; email: string | null; displayName?: string | null },
    preferredName?: string
  ) => {
    const customerRef = doc(db, 'customers', user.uid);
    const customerSnap = await getDoc(customerRef);

    if (!customerSnap.exists()) {
      await setDoc(customerRef, {
        email: user.email,
        name: preferredName || user.displayName || user.email?.split('@')[0],
        measurements: {},
        orders: [],
        createdAt: serverTimestamp()
      });
      return true;
    }

    return false;
  };

  // 1. 處理 Email 註冊 / 登入
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (isSignUpMode) {
        // 【註冊模式】
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await ensureCustomerProfile(user, email.split('@')[0]);
        
        console.log("註冊成功！已同步建立 customer 檔案。");
      } else {
        // 【登入模式】
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const created = await ensureCustomerProfile(user);
        if (created) {
          console.log("舊客戶首次補建 customer 檔案完成。");
        }

        console.log("登入成功！");
      }
      router.push(redirectUrl); // 成功後跳轉
    } catch (error: any) {
      console.error("驗證失敗:", error);
      // 處理常見錯誤訊息並轉換為優雅的提示
      if (error.code === 'auth/email-already-in-use') setErrorMsg('This email is already registered.');
      else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') setErrorMsg('Incorrect email or password.');
      else if (error.code === 'auth/weak-password') setErrorMsg('Password should be at least 6 characters.');
      else setErrorMsg('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. 處理 Google 登入
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const created = await ensureCustomerProfile(user);
      if (created) {
        console.log("Google 新客註冊！已建立 customer 檔案。");
      }

      router.push(redirectUrl);
    } catch (error) {
      console.error("Google 登入失敗:", error);
      setErrorMsg('Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4">
      
      <div className="max-w-md w-full space-y-8">
        
        {/* 品牌 Logo 區塊 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black tracking-[0.2em] uppercase text-white mb-2">
            ALEXIS<span className="font-light">BESPOKE</span>
          </h1>
          <p className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">
            Client Portal
          </p>
        </div>

        {/* 錯誤訊息提示區塊 */}
        {errorMsg && (
          <div className="p-3 border border-red-900/50 bg-red-900/20 text-red-500 font-mono text-[10px] uppercase tracking-widest text-center">
            {errorMsg}
          </div>
        )}

        {/* 📧 Email 登入/註冊表單 */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-stone-800 py-3 px-2 text-white font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-white transition-colors placeholder:text-stone-700"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="PASSWORD" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-stone-800 py-3 px-2 text-white font-mono text-xs tracking-widest focus:outline-none focus:border-white transition-colors placeholder:text-stone-700"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-4 bg-white text-black font-bold font-mono text-[11px] uppercase tracking-widest hover:bg-stone-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : (isSignUpMode ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* 切換登入/註冊模式的按鈕 */}
        <div className="text-center pt-2">
          <button 
            type="button"
            onClick={() => setIsSignUpMode(!isSignUpMode)}
            className="font-mono text-[10px] text-stone-500 hover:text-white uppercase tracking-widest transition-colors underline underline-offset-4"
          >
            {isSignUpMode ? 'Already have an account? Sign in' : 'Need an account? Create one'}
          </button>
        </div>

        {/* 分隔線 */}
        <div className="relative py-6 flex items-center">
          <div className="flex-grow border-t border-stone-800"></div>
          <span className="flex-shrink-0 mx-4 font-mono text-[9px] text-stone-600 uppercase tracking-widest">Or</span>
          <div className="flex-grow border-t border-stone-800"></div>
        </div>

        {/* 🌐 Google 登入按鈕 (作為備用選項) */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-4 px-6 border border-stone-800 text-stone-300 font-bold font-mono text-[11px] uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-colors flex justify-center items-center gap-3 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>
        
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-carbon-black flex items-center justify-center text-dim-grey font-jetbrains text-xs tracking-[0.3em] uppercase">
        Initializing Secure Connection...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}