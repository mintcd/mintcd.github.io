import React from 'react';
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';


const statementProps: { [key in StatementType]: {
  color: string,
  image: JSX.Element,
  clicked: string,
  unclicked: string,
  contentBackground: string
} } = {
  axiom: {
    color: '#0288d1',
    image: <TipsAndUpdatesRoundedIcon />,
    clicked: 'text-[#0288d1]',
    unclicked: 'text-gray-700',
    contentBackground: 'bg-[#a0d7f5]'

  },
  corollary: {
    color: 'grey',
    image: <TipsAndUpdatesRoundedIcon />,
    clicked: 'text-[#0288d1]',
    unclicked: 'text-gray-700',
    contentBackground: 'bg-[#77c7f2]'

  },

  definition: {
    color: '#0288d1',
    image: <TipsAndUpdatesRoundedIcon />,
    clicked: 'text-white',
    unclicked: 'text-[#0288d1]',
    contentBackground: 'bg-[#aad7ef]'
  },

  example: {
    color: '#0288d1',
    image: <EditNoteRoundedIcon />,
    clicked: 'text-white',
    unclicked: 'text-[#0288d1]',
    contentBackground: 'bg-[#aad7ef]'
  },

  lemma: {
    color: 'primary',
    image: <TipsAndUpdatesRoundedIcon />,
    clicked: 'text-[#0288d1]',
    unclicked: 'text-gray-700',
    contentBackground: 'bg-[#77c7f2]'
  },
  notation: {
    color: 'primary',
    image: <TipsAndUpdatesRoundedIcon />,
    clicked: 'text-[#0288d1]',
    unclicked: 'text-gray-700',
    contentBackground: 'bg-[#77c7f2]'
  },
  proposition: {
    color: '#6da484',
    image: <TipsAndUpdatesRoundedIcon />,
    clicked: 'text-white',
    unclicked: 'text-[#6da484]',
    contentBackground: 'bg-[#6da484]'
  },
  theorem: {
    color: '#5bb561',
    image: <NotificationsActiveRoundedIcon />,
    clicked: 'text-white',
    unclicked: 'text-[#5bb561]',
    contentBackground: 'bg-[#7cab7f]'
  },

  note: {
    color: 'green',
    image: <TipsAndUpdatesRoundedIcon />,
    clicked: 'text-[#0288d1]',
    unclicked: 'text-gray-700',
    contentBackground: 'bg-[#77c7f2]'
  },
  'thought-bubble': {
    color: 'primary',
    image: <TipsAndUpdatesRoundedIcon />,
    clicked: 'text-[#0288d1]',
    unclicked: 'text-gray-700',
    contentBackground: 'bg-[#77c7f2]'
  },
}
