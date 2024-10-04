'use client'
import { ReactNode, useState, useRef } from "react";
import { useOnClickOutside } from 'usehooks-ts';

export default function Dropdown({
  toggleButton,
  content,
  ...props
}: {
  toggleButton: ReactNode;
  content: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className={`drop-down relative w-fit`} ref={dropdownRef} {...props}>
      <span onClick={handleToggle} className="cursor-pointer">
        {toggleButton}
      </span>

      <div
        className={`absolute z-[10] mt-2 w-fit bg-white border border-gray-200 shadow-lg transition-all duration-300 ease-out 
          ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-[-10px] opacity-0 pointer-events-none'}`}
      >
        {content}
      </div>
    </div>
  );
}
