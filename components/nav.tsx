'use client'
import { useState } from 'react';
import { BsChevronDown, BsChevronUp, BsList } from 'react-icons/bs'; // Import the hamburger icon
import Image from 'next/image';

export default function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="border-black dark:bg-gray-900 mx-4 sm:mx-16 dark:border-gray-700 max-w-screen-xl flex flex-wrap items-center justify-between">
      <a href="/" className="flex items-center">
        <Image
          src="/favicon.ico"
          alt="scrum pillars"
          className="logo-image"
          width={75}
          height={0}
        />
        <span className="self-center whitespace-nowrap dark:text-white ml-2">
          <div className="text-lg sm:text-2xl font-semibold">In Reseek of Meanings</div>
          <div className="text-sm sm:text-lg"> What&apos;s worth it? How to find? </div>
        </span>
      </a>

      {/* Mobile Menu Toggle */}
      <button
        className="block md:hidden p-4 focus:outline-none"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <BsList size={24} /> {/* Hamburger icon */}
      </button>

      {/* Mobile Menu */}
      <div
        className={`w-full md:hidden ${dropdownOpen ? 'block' : 'hidden'
          }`}
      >
        <ul className="font-medium border-t border-gray-100">
          <li>
            <a
              href="/study-notes"
              className="block py-2 pl-4 pr-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Blogs
            </a>
          </li>
          <li>
            <a
              href="/study-notes"
              className="block py-2 pl-4 pr-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Study Notes
            </a>
          </li>
          <li>
            <a
              href="/about"
              className="block py-2 pl-4 pr-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
            >
              About
            </a>
          </li>
        </ul>
      </div>

      {/* Desktop Menu */}
      <div className="mx-16 hidden w-full md:block md:w-auto relative" id="navbar-multi-level">
        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <a
              href="/blogs"
              className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              Blogs
            </a>
          </li>
          <li>
            <a
              href="/study-notes"
              className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              Study Notes
            </a>
          </li>
          <li>
            <a
              href="/about"
              className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              About
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

