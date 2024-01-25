"use client"

import { useState } from 'react'
import Image from 'next/image'

export default function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false)

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  function toggleProfile() {
    setProfileOpen(!profileOpen);
  }

  return (
    <nav className="w-[100vw] border-black dark:bg-gray-900 dark:border-gray-700 max-w-screen-xl flex flex-wrap items-center justify-between">
      <a href="/" className="flex items-center">
        <Image
          src="/favicon.ico"
          alt="scrum pillars"
          width={50}
          height={0}
        // className="mr-3 h-6 sm:h-9"
        />
        <span className="self-center whitespace-nowrap dark:text-white ml-2">
          <div className='text-2xl font-semibold'>Computer Science Blocks</div>
          <div className='text-sm'> From Abacus to Artificial intelligence </div>
        </span>
      </a>
      <button
        data-collapse-toggle="navbar-multi-level"
        type="button"
        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        aria-controls="navbar-multi-level"
        aria-expanded="false"
      >
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
      <div className="hidden w-full md:block md:w-auto relative" id="navbar-multi-level">
        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li className="relative">
            <button
              id="dropdownNavbarLink"
              data-dropdown-toggle="dropdownNavbar"
              className="flex items-center justify-between w-full py-2 pl-3 pr-4  text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
            >
              Mathematics
              <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>
            <div
              id="dropdownNavbar"
              className={`z-10 absolute top-full left-0 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 ${dropdownOpen ? 'block' : 'hidden'}`}
            >
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-400" aria-labelledby="dropdownLargeButton">
                <li>
                  <a href="/abstract-algebra" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Abstract algebra
                  </a>
                </li>
                <li>
                  <a href="/linear-algebra/chapters/0" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Linear algebra
                  </a>
                </li>

                <li>
                  <a href="/topology/chapters/0" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">
                    Topology
                  </a>
                </li>
              </ul>
              <div className="py-1">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">
                  Sign out
                </a>
              </div>
            </div>
          </li>
          <li>
            <a href="/about" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
              About
            </a>
          </li>
          <li className="relative">
            <div
              id="dropdownNavbar"
              className={`z-10 absolute top-full left-0 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 ${profileOpen ? 'block' : 'hidden'}`}
            >
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-400" aria-labelledby="dropdownLargeButton">
                <li>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Dashboard
                  </a>
                </li>

                <li>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">
                    Earnings
                  </a>
                </li>
              </ul>
              <div className="py-1">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">
                  Sign out
                </a>
              </div>
            </div>
          </li>

        </ul>
      </div>
    </nav>
  );
}
