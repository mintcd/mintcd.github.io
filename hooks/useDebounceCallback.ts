import { useRef, useCallback, useEffect } from "react";

/**
 * Returns a memoized function that will only call the passed function
 * when it hasn't been called for the wait period.
 * 
 * @param func The function to be called
 * @param wait Wait period in milliseconds
 * @param immediate If true, triggers on the leading edge instead of the trailing
 * @returns A memoized debounced function
 */
const useDebouncedCallback = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  immediate: boolean = false
): ((...args: Parameters<T>) => void) => {
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const funcRef = useRef(func);

  // Update the function reference when func changes
  useEffect(() => {
    funcRef.current = func;
  }, [func]);

  return useCallback(
    (...args: Parameters<T>) => {
      const callNow = immediate && !timeout.current;

      const later = () => {
        timeout.current = null;
        if (!immediate) funcRef.current(...args);
      };

      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(later, wait);

      if (callNow) funcRef.current(...args);
    },
    [wait, immediate]
  );
};

export default useDebouncedCallback;
