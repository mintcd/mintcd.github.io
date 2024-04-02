'use client'

import { useState } from 'react';
import { BsList } from 'react-icons/bs';
import Image from 'next/image';

export default function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems: string[] = ['Blogs', 'Study Notes', 'About']

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className={`w-full bg-slate-100
                    flex flex-wrap items-center justify-between`}>
      <a href="/" className={`flex items-center`}>
        <Image src="/favicon.ico" alt="bagel" width={75} height={75} className='mr-3' />
        <span className={``}>
          <div itemID='slogan-container'
            className={`font-semibold
                          md:text-lg
                          sm:text-2xl`}>
            In Reseek of Meanings
          </div>
          <div itemID='motor-container'
            className={`md:text-[16px] 
                          sm:text-lg`}>
            What&apos;s worth it? How to find?
          </div>
        </span>
      </a>

      {/* <button
        onClick={toggleDropdown}
        className={`focus:outline-none
                    sm:mr-10
                    md:hidden md:mr-20`}>
        <BsList size={24} />
      </button> */}

      <div
        itemID='nav-item-container'
        className={`flex justify-end items-center
                  text-gray-900`}>
        {navItems.map((item, index) => (
          <a key={`nav-item-${index}`}
            href={item.toLowerCase().replace(" ", "-")}
            className='mr-4 hover:text-blue-500'>
            {item}
          </a>))}
      </div>
    </nav>
  );
}