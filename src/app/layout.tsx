import type { Metadata } from 'next';
import {
  Roboto,
  Roboto_Condensed,
  Space_Mono,
  JetBrains_Mono,
  Roboto_Mono,
} from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/header';
import { CartProvider } from '@/app/context/CartContext';

// Roboto Regular 400 — 選單與內文
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-roboto',
  display: 'swap',
});

// 1. 品牌大標題字體
const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  variable: '--font-roboto-condensed',
  display: 'swap',
});

// 2. 測量與數據專用字體
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ALEXIS BESPOKE | Visual Archive',
  description: 'Digital Protocol for Modern Bespoke Tailoring',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${robotoCondensed.variable} ${spaceMono.variable} ${jetbrainsMono.variable} ${robotoMono.variable}`}
    >
      <body className="bg-carbon-black text-carbon-black font-sans antialiased">
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}