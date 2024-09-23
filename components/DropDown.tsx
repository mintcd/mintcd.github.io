'use client'
import { ReactNode, useState, useRef } from "react";
import { useOnClickOutside } from 'usehooks-ts';
import zIndices from "@styles/z-indices";

export default function DropDown({
  toggleButton,
  content,
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
    <div className={`drop-down relative inline-block `} ref={dropdownRef}>
      <div onClick={handleToggle} className="cursor-pointer">
        {toggleButton}
      </div>

      <div
        className={`absolute z-[${zIndices.dropDown}] max-w-[100px] mt-2 w-full bg-white border border-gray-200 shadow-lg transition-all duration-300 ease-out 
          ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-[-10px] opacity-0 pointer-events-none'}`}
      >
        {content}
      </div>
    </div>
  );
}
