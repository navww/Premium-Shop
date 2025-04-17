'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import { useThemeStore } from '@/store/themeStore';
import { useEffect } from 'react';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <html lang="en" data-theme={theme}>
      <body className={inter.className}>
        <Navbar />
        <main>
          {children}
        </main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
