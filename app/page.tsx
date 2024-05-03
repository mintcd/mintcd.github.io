'use client'

import Link from 'next/link'
import Image from 'next/image'

import GitHubIcon from '@public/github.png';
import Email from '@public/email.png';
import Cv from '@public/cv.png';

export default function Home() {
  return (
    <div className={`flex justify-center items-center`}>
      <div className='flex'>
        <Link href='https://github.com/mintcd' target="_blank" className='mx-5'>
          <Image src={GitHubIcon} alt="github-icon" width={50} height={50} />
        </Link>

        <Link href='mailto:dangminh2208@gmail.com' className='mx-5'>
          <Image src={Email} alt="github-icon" width={50} height={50} />
        </Link>

        <Link href='/about' className='mx-5'>
          <Image src={Cv} alt="github-icon" width={50} height={50} />
        </Link>
      </div>
    </div>
  )
}
