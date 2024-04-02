import React, { ReactNode } from 'react';
import '@styles/global.css';
import Nav from '@components/nav'

export const metadata = {
  title: 'My Deeds',
  description: 'The meaning to my extend.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" rel="preload">
      {/* <body className="bg-gradient-to-r from-cyan-200 to-blue-200"> */}
      <body>
        <Nav />
        <main className={`mt-4`}>
          {children}
        </main>
      </body>
    </html>
  );
}
