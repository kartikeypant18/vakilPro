import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Poppins, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/providers/AppProviders';
import { Toaster } from '@/components/ui/toaster';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const seasonsFallback = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-seasons',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vakeel Pro',
  description: 'Legal-tech platform connecting clients and lawyers.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${seasonsFallback.variable}`}>
      <body className="bg-secondary text-accent antialiased">
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
