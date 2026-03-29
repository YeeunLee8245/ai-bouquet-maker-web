import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import Header from '@/widgets/header/header';
import AppProviders from '@/shared/providers/app-providers';
import ModalHost from '@/shared/model/modal/modal-host';
import ToastHost from '@/shared/model/toast/toast-host';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: '꽃다발 레시피',
  description: '마음을 담은 꽃다발, 어떤 꽃을 고를지 모르겠다면 AI에게 물어보세요.',
  openGraph: {
    title: '꽃다발 레시피',
    description: '마음을 전하는 꽃다발, AI가 함께 만들어드려요.',
    // images: ['/og-image.png'], // TODO: yeeun 추후 추가
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <html lang='ko'>
        <body className='flex flex-col h-dvh overflow-hidden w-[360px] mx-auto'>
          <Header />
          <main className='max-h-[calc(100%-48px)] h-full overscroll-contain overflow-y-auto scrollbar-hide'>
            {children}
          </main>
          <ModalHost />
          <ToastHost />
        </body>
      </html>
    </AppProviders>
  );
}
