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
      <body className="bg-black min-h-screen sm:mx-5 mx-2">
        <div className="flex flex-col min-h-screen">
          <Nav />
          <main className="flex-grow mt-4 container mx-auto px-4 text-gray-500">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}