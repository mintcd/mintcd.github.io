import React from 'react';
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import TextSnippetRoundedIcon from '@mui/icons-material/TextSnippetRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import GradeRoundedIcon from '@mui/icons-material/GradeRounded';

export const gradients = (
  <defs>
    <linearGradient id="definitionTheorem" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style={{ stopColor: '#0288d1', stopOpacity: 1 }} />
      <stop offset="100%" style={{ stopColor: '#5bb561', stopOpacity: 1 }} />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style={{ stopColor: '#77c7f2', stopOpacity: 1 }} />
      <stop offset="100%" style={{ stopColor: 'grey', stopOpacity: 1 }} />
    </linearGradient>
    {/* Add more gradients as needed */}
  </defs>
);

export const statementProps = {
  axiom: {
    color: '#0288d1',
    icon: <GradeRoundedIcon />,
    clicked: 'text-[#0288d1]',
    unclicked: 'text-gray-700',
    contentBackground: 'bg-[#a0d7f5]'

  },
  corollary: {
    color: 'grey',
    icon: <TextSnippetRoundedIcon />,
    clicked: 'text-[#0288d1]',
    unclicked: 'text-gray-700',
    contentBackground: 'bg-[#77c7f2]'

  },

  definition: {
    color: '#0288d1',
    icon: <TipsAndUpdatesRoundedIcon />,
    clicked: 'text-white',
    unclicked: 'text-[#0288d1]',
    contentBackground: 'bg-[#aad7ef]'
  },

  "definition-theorem": {
    color: 'url(#definition-theorem)',
    icon: <TipsAndUpdatesRoundedIcon />,
    clicked: 'text-white',
    unclicked: 'text-[#0288d1]',
    contentBackground: 'bg-[#aad7ef]'
  },

  example: {
    color: '#0288d1',
    icon: <EditNoteRoundedIcon />,
    clicked: 'text-white',
    unclicked: 'text-[#0288d1]',
    contentBackground: 'bg-[#aad7ef]'
  },

  lemma: {
    color: 'primary',
    icon: <TipsAndUpdatesRoundedIcon />,
    clicked: 'text-[#0288d1]',
    unclicked: 'text-gray-700',
    contentBackground: 'bg-[#77c7f2]'
  },
  notation: {
    color: 'primary',
    icon: <TipsAndUpdatesRoundedIcon />,
    clicked: 'text-[#0288d1]',
    unclicked: 'text-gray-700',
    contentBackground: 'bg-[#77c7f2]'
  },
  proposition: {
    color: '#6da484',
    icon: <TipsAndUpdatesRoundedIcon />,
    clicked: 'text-white',
    unclicked: 'text-[#6da484]',
    contentBackground: 'bg-[#6da484]'
  },
  theorem: {
    color: '#5bb561',
    icon: <NotificationsActiveRoundedIcon />,
    clicked: 'text-white',
    unclicked: 'text-[#5bb561]',
    contentBackground: 'bg-[#7cab7f]'
  },

  note: {
    color: 'green',
    icon: <TipsAndUpdatesRoundedIcon />,
    clicked: 'text-[#0288d1]',
    unclicked: 'text-gray-700',
    contentBackground: 'bg-[#77c7f2]'
  },
  'thought-bubble': {
    color: 'primary',
    icon: <TipsAndUpdatesRoundedIcon />,
    clicked: 'text-[#0288d1]',
    unclicked: 'text-gray-700',
    contentBackground: 'bg-[#77c7f2]'
  },
} as {
  [key: string]: {
    color: string,
    icon: JSX.Element,
    clicked: string,
    unclicked: string,
    contentBackground: string
  }
} 
