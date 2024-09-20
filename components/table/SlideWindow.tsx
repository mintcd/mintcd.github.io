import React, { useEffect, useRef, useState } from 'react';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

export default function SlidingDrawer({
  onClose,
  isOpen,
  children
}: {
  onClose: () => void;
  isOpen: boolean
  children: React.ReactNode;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={drawerRef}
      className={`slide-window fixed ${isOpen ? 'right-0' : 'right-[-100%]'} min-w-[500px] max-w-[50vw] min-h-[50vh] max-h-[100vh] 
       duration-500 ease-in-out z-50 rounded-md `}
    >
      {/* <CloseFullscreenIcon
        style={{ transform: 'rotate(90deg)', fontSize: '16px' }}
        onClick={onClose}
        className="m-2 cursor-pointer"
      /> */}
      <div className="m-2">
        {children}
      </div>
    </div>
  );
}
