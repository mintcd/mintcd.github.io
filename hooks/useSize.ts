import { useState, useEffect } from 'react'

type View = {
  width: number,
  height: number,
}
export default function useSize(ref: React.RefObject<HTMLElement>): View {
  const [size, setSize] = useState<View>({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setSize({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateSize()
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [])

  return size;

}