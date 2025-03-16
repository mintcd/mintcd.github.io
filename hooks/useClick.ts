import { useEffect, RefObject } from "react";

export default function useClick<T extends HTMLElement>(
  elementRef: RefObject<T | null>,
  callback: (event: MouseEvent) => void
) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    function handleClick(event: MouseEvent) {
      callback(event);
    }

    element.addEventListener("click", handleClick);
    return () => {
      element.removeEventListener("click", handleClick);
    };
  }, [elementRef, callback]);
}
