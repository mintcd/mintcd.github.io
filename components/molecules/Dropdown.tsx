'use client'
import { ReactNode, useState, useRef, createContext, useContext } from "react";
import { useClickOutside } from '@hooks';

type DropdownProps = {
  children: ReactNode;
}

type DropdownContextType = {
  isOpen: boolean;
  handleToggle: () => void;
};

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export default function Dropdown({ children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <DropdownContext.Provider value={{ isOpen, handleToggle }}>
      <div className="drop-down" ref={dropdownRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

Dropdown.Toggler = function Toggler({ children }: { children: ReactNode }) {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error('Dropdown.Toggler must be used within a Dropdown');
  }

  const { handleToggle } = context;

  return (
    <div onClick={handleToggle} className="cursor-pointer">
      {children}
    </div>
  );
};

Dropdown.Content = function Content({ children }: { children: ReactNode }) {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error('Dropdown.Content must be used within a Dropdown');
  }

  const { isOpen } = context;

  return (
    <div
      className={`absolute z-[10] mt-1 w-fit bg-white border border-gray-200 shadow-lg rounded-lg
        transition-all duration-300 ease-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-[-10px] opacity-0 pointer-events-none'}`}
    >
      {children}
    </div>
  );
};
