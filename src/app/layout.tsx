import Header from '@/components/Nav';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Roboto_Mono } from 'next/font/google';
import './globals.css';

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: 'Aryayama Nyx',
  description: 'Focuses on daily updates and exploration.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${robotoMono.className} ${robotoMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
