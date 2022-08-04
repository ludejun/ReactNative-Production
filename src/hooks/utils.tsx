import { useEffect, useRef, useState } from 'react';

export const useToggle = (visableParams = false): [boolean, () => void] => {
  const [visable, setVisable] = useState(visableParams);
  const toggle = () => setVisable(!visable);
  return [visable, toggle];
};

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => savedCallback.current && savedCallback.current();
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
