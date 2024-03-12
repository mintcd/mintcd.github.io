import React, { ReactNode } from 'react';
import '@styles/global.css';
import Nav from '@components/nav'

export const metadata = {
  title: 'My Deeds',
  description: 'The meaning of them all.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" rel="preload">
      <body className="">
        <main className="my-4">
          <Nav></Nav>
          {children}
        </main>
      </body>
    </html>
  );
}
