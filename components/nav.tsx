'use client'

import { useState } from 'react';
import Link from 'next/link';
import { BsList } from 'react-icons/bs';
import Image from 'next/image';
import Favicon from '@app/favicon.ico';

export default function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems: string[] = ['Trailblazers', 'Philosophy', 'Mathematics', 'Computer Science'];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <nav className="w-full">
        <a href="/"
          className={`w-full m-5
                    flex justify-center items-center`}>
          <Image src={Favicon} alt="bagel" width={100} height={100} className='mr-3' />
          <br />
          <div itemID='slogan-container' className={`font-semibold md:text-lg sm:text-2xl`}>
            Chocomint&apos;s Study Space
          </div>
        </a>

        {/* <button onClick={toggleDropdown} className={`focus:outline-none sm:mr-10 md:hidden md:mr-20`}>
        <BsList size={24} />
      </button> */}

        <div itemID='nav-item-container'
          className={`w-full m-5
                    flex justify-center items-center text-gray-900 md:flex-wrap`}>
          {navItems.map((item, index) => (
            <Link key={`nav-item-${index}`} href={`/${item.toLowerCase().replace(" ", "-")}`}
              className='m-4 hover:text-blue-500'>
              {item}
            </Link>
          ))}
        </div>
      </nav>
    </div>

  );
}
