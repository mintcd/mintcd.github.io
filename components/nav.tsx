'use client'

import { useState } from 'react';
import Link from 'next/link';
import { BsList } from 'react-icons/bs';
import Image from 'next/image';
import Favicon from '@app/favicon.ico';


import GitHubIcon from '@public/github.png';
import Email from '@public/email.png';
import Cv from '@public/cv.png';

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    <Link key={1} href='https://github.com/mintcd' target="_blank" className='hover:opacity-75 transition duration-150 ease-in-out'>
      <Image src={GitHubIcon} alt="GitHub" width={30} height={30} />
    </Link>,

    <Link key={2} href='mailto:dangminh2208@gmail.com' className='hover:opacity-75 transition duration-150 ease-in-out'>
      <Image src={Email} alt="github-icon" width={30} height={30} />
    </Link>,

    <Link key={3} href='/about' className='hover:opacity-75 transition duration-150 ease-in-out'>
      <Image src={Cv} alt="github-icon" width={30} height={30} />
    </Link>

  ]


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-inherit mt-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <Link href="/" className="flex items-center">
            <Image src={Favicon} alt="bagel" width={70} height={70} className="mr-3 rounded-full" />
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-10">
              {navItems.map((item, index) => (
                item
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-700">
              <BsList size={24} />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mt-2 flex items-center justify-center space-x-4 mx-4">
          {navItems.map((item, index) => (
            item
          ))}
        </div>
      )}
    </nav>
  );
}