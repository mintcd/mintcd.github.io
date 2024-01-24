import React, { ReactNode } from 'react';
import '@styles/global.css';
import { Inter } from 'next/font/google';
import Nav from '@components/nav'

export const metadata = {
  title: 'Computer Science Blocks',
  description: 'From Physics and Mathematics to Computer Science',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" rel="preload">
      <body className="">
        <main className="m-16">
          <Nav></Nav>
          {children}
        </main>
      </body>
    </html>
  );
}
