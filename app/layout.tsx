import React, { ReactNode } from 'react';
import '@styles/global.css';
import Nav from '@components/nav'
import Footer from '@components/footer'

export const metadata = {
  title: 'Study Space',
  description: 'Notes in Philosophy, Mathematics and Computer Science',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-white">
        <Nav />
        <main className="mt-4 mx-5 sm:mx-10 text-gray-500">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}