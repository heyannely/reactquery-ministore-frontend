import { useEffect } from 'react';
import type { RefObject } from 'react';


export function useIntersectionObserver(
    ref: RefObject<Element>,
    onIntersect: () => void,
    options?: IntersectionObserverInit
  ) {
    useEffect(() => {
      if (!ref.current) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              onIntersect();
            }
          });
        },
        { threshold: 1, ...options }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }, [ref, onIntersect, options]);
  }