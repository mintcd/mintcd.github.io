import { useEffect } from "react";

export default function useKeydown(callback: (e: KeyboardEvent) => void) {
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      callback(event);
    }

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [callback]);
}