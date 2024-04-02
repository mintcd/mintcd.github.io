'use client'

import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function About() {
  return (
    <div className="text-center">
      <div className={`lg:w-[50%] inline-block justify-between lg:space-x-4`}>
        <a href='https://github.com/mintcd' target="_blank">
          <GitHubIcon className='text-[50px]' />
        </a>
        <a href='https://www.fb.com/minh.chaudangg' target="_blank">
          <FacebookOutlinedIcon className='text-[50px]' />
        </a>
        <a href='https://www.instagram.com/chaudangg' target="_blank">
          <InstagramIcon className='text-[50px]' />
        </a>

      </div>
    </div>
  )
}
