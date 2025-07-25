'use client'
import { ReactNode, useState, useRef, createContext, useContext, ReactElement, Children, isValidElement, PropsWithChildren } from "react";
import { useClickOutside } from '@hooks';

type DropdownProps = PropsWithChildren<{
  // No specific props needed here, just children
}>;

type DropdownContextType = {
  isOpen: boolean;
  handleToggle: () => void;
};

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

/**
 * Dropdown component.
 * 
 * **Usage:**
 *
 * ```tsx
 * <Dropdown>
 *   <Dropdown.Toggler>Toggle Me</Dropdown.Toggler>
 *   <Dropdown.Content>
 *     <ul>
 *       <li>Item 1</li>
 *       <li>Item 2</li>
 *     </ul>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 *
 * **Important:**
 *
 * -   This component *must* contain exactly one `Dropdown.Toggler` and one `Dropdown.Content` as direct children.
 * -   `Dropdown.Toggler` defines the trigger element.
 * -   `Dropdown.Content` defines the content that will be shown/hidden.
 */
export default function Dropdown({ children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Validate children when they change.
  Dropdown.validateChildren(children);

  return (
    <DropdownContext.Provider value={{ isOpen, handleToggle }}>
      <div className="drop-down" ref={dropdownRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

type TogglerProps = {
  children: ReactNode;
};

Dropdown.Toggler = function Toggler({ children }: TogglerProps) {
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

type ContentProps = {
  children: ReactNode;
};

Dropdown.Content = function Content({ children }: ContentProps) {
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

// Ensure only Dropdown.Toggler and Dropdown.Content are used as children
Dropdown.validateChildren = function (children: ReactNode) {
  let hasToggler = false;
  let hasContent = false;
  const directChildren = Children.toArray(children);
  if (directChildren.length > 2 || directChildren.length < 2) {
    throw new Error('Dropdown must contain exactly Dropdown.Toggler and Dropdown.Content as direct children.');
  }
  Children.forEach(children, (child) => {
    if (!isValidElement(child) || (child.type !== Dropdown.Toggler && child.type !== Dropdown.Content)) {
      throw new Error('Dropdown must contain only Dropdown.Toggler and Dropdown.Content as direct children.');
    }
    if (isValidElement(child) && child.type === Dropdown.Toggler) {
      hasToggler = true
    }
    if (isValidElement(child) && child.type === Dropdown.Content) {
      hasContent = true;
    }
  });
  if (!hasToggler) {
    throw new Error('Dropdown must contain Dropdown.Toggler as direct children.');
  }
  if (!hasContent) {
    throw new Error('Dropdown must contain Dropdown.Content as direct children.');
  }
};
