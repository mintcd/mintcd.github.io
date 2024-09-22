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

  return (
    <div
      ref={drawerRef}
      className={`slide-window fixed ${isOpen ? 'right-0' : 'right-[-100%]'} w-[40vw] h-[80vh] 
       duration-500 ease-in-out z-50 rounded-md bg-slate-100`}
    >
      <CloseFullscreenIcon
        style={{ transform: 'rotate(90deg)', fontSize: '16px' }}
        onClick={onClose}
        className="m-2 cursor-pointer"
      />
      <div className="m-2">
        {children}
      </div>
    </div>
  );
}
