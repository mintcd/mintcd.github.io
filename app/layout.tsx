import React, { ReactNode, StrictMode } from 'react';
import '@styles/global.css';
import Nav from '@components/nav'
import Footer from '@components/footer'

export const metadata = {
  title: 'Study Space',
  description: 'Notes in Philosophy, Mathematics and Computer Science',
};

export default function RootLayout({ children }: {
  children: ReactNode;
}) {
  return (
    <StrictMode>
      <html lang="en">
        <body className="bg-white text-[14px] text-gray-700">
          <Nav />
          <main className="mt-4 mx-5 sm:mx-10">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </StrictMode>
  );
}