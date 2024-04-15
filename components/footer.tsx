'use client'

import { useState } from 'react';

export default function Footer() {

  return (
    <div className={`w-full bg-slate-100 p-2 mt-4
                    flex flex-wrap items-center justify-between`}>
      <span className={``}>
        <div itemID='slogan-container'
          className={`font-semibold
                          md:text-lg
                          sm:text-2xl`}>
          Contact
        </div>
        <div itemID='motor-container'
          className={`md:text-[16px] 
                          sm:text-lg`}>
          <a href="mailto:dangminh2208@gmail.com">
            Email: dangminh2208@gmail.com
          </a>
          <br />
          <a href="https://www.fb.com/minh.chaudangg">
            Facebook: facebook.com/minh.chaudangg
          </a>
        </div>
      </span>
    </div>
  );
}