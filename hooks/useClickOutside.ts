import { useEffect } from "react";

export default function useClickOutside<T extends HTMLElement>(
  elementRef: React.RefObject<T | null>,
  callback: (event: MouseEvent) => void
) {
  const element = elementRef.current;
  useEffect(() => {
    if (!element) return;

    function handleClickOutside(event: MouseEvent) {
      if (element && !element.contains(event.target as Node)) {
        callback(event);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [element, callback]);
}
