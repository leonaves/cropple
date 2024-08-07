import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col bg-slate-100">
          <header className="sticky top-0 z-40 mb-8 w-full bg-slate-200">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
              <div className="flex h-full items-center">
                <img className="h-full p-3" src="/cropple-icon.png" />
                <h2 className="text-xl">Cropple</h2>
              </div>
            </div>
          </header>
          <div className="m-auto max-w-7xl flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
