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
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full bg-gray-100 flex items-center justify-center">
        <AuthProvider>
          <div className="w-[360px] h-[720px] bg-white rounded-[40px] shadow-xl p-5 flex flex-col overflow-hidden">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
