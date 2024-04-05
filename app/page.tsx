'use client'

import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function Home() {
  return (
    <div className="m-8 sm:m-16">
      <div className="text-center">
        <div className={`lg:w-[50%] inline-block justify-between lg:space-x-4`}>
          <a href='https://github.com/mintcd' target="_blank">
            <GitHubIcon className='text-[50px]' />
          </a>
          <a href='https://www.facebook.com/profile.php?id=61557162368297' target="_blank">
            <FavoriteIcon className='text-[50px]' />
          </a>
          <a href='https://www.fb.com/minh.chaudangg' target="_blank">
            <FacebookOutlinedIcon className='text-[50px]' />
          </a>
          <a href='https://www.instagram.com/chaudangg' target="_blank">
            <InstagramIcon className='text-[50px]' />
          </a>

        </div>
      </div>
      <h1 className="font-bold text-lg"> Welcome visitor! </h1>
      <br />
      I am Chau Dang Minh. I am dreaming of becoming a well-trained researcher in Computer Science and Mathematics. My ultimate questions are the ontology of humans comparing to computing entities, and the meaning of our existence. I am unsure there are relations, hope so.
      <br />
      <br />
      And I love my husband. I shall love her forever, Thanh Ngannn
    </div>
  )
}
