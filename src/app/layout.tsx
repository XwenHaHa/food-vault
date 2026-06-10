import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth-provider';

export const metadata: Metadata = {
  title: 'FoodVault - 你的私人美食库',
  description: '个人美食收藏与推荐应用',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="h-full bg-[#f5f5f7]">
        <div className="h-full max-w-[430px] mx-auto
          md:rounded-[28px] md:shadow-2xl md:h-[92vh] md:my-[4vh] md:border md:border-gray-100 md:overflow-hidden">
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
