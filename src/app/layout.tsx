import type { Metadata } from "next";
import { Space_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";

// 保持工業感的等寬字體
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

// 新增高級感的襯線字體
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "ALEXIS BESPOKE | Rude Sartorialism",
  description: "Bespoke tailoring for the modern rogue. Music. Rebellion. Tailoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> {/* 強制 Dark Mode */}
      <body
        className={`${spaceMono.variable} ${playfair.variable} font-mono antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
} 