'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. 定義可選的「訂製款式」清單 (你可以隨時增減)
export type GarmentStyle = 
  | '2-Piece Suit (兩件式西裝)' 
  | '3-Piece Suit (三件式西裝)' 
  | 'Jacket (單件外套)' 
  | 'Trousers (西裝褲)' 
  | 'Overcoat (大衣)'
  | 'Shirt (襯衫)';

// 2. 定義購物車裡「每一個項目」長什麼樣子
export interface CartItem {
  cartItemId: string; // 購物車專屬的獨立 ID (因為同一塊布可能被選兩次做不同款式)
  fabricId: string;   // 資料庫裡的布料 ID
  title: string;      // 布料名稱
  image: string;      // 布料圖片網址
  style: string;      // 客人選的訂製款式
  quantity: number;   // 數量 (通常訂製是 1)
}

// 3. 定義購物車提供哪些「功能」給網頁使用
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 網頁載入時，從使用者的瀏覽器 (localStorage) 把購物車記憶抓回來
  useEffect(() => {
    const savedCart = localStorage.getItem('alexis_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart data');
      }
    }
    setIsLoaded(true);
  }, []);

  // 只要購物車內容有變，就自動存檔進使用者的瀏覽器
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('alexis_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // 新增到購物車的動作
  const addToCart = (item: Omit<CartItem, 'cartItemId'>) => {
    const newItem = {
      ...item,
      // 給這筆訂單一個獨一無二的號碼 (用當下時間產生)
      cartItemId: Date.now().toString() + Math.random().toString(36).substring(2, 9),
    };
    setCart((prev) => [...prev, newItem]);
    alert(`成功將 ${item.title} (${item.style}) 加入購物清單！`);
  };

  // 從購物車刪除的動作
  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  // 清空購物車
  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

// 方便其他頁面呼叫購物車的專屬 Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};