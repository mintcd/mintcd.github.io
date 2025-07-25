import { useEffect, RefObject } from 'react';

export default function useClickOutside<T extends HTMLElement>(
  elementRef: RefObject<T | null>,
  callback: (event: MouseEvent) => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!elementRef.current) return;
      const el = elementRef.current;
      if (el && !el.contains(event.target as Node)) {
        callback(event);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [elementRef, callback]);
}
