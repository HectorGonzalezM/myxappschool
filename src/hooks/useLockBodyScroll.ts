// src/hooks/useLockBodyScroll.ts

import { useEffect } from 'react';

export default function useLockBodyScroll(lock: boolean) {
  useEffect(() => {
    const originalOverflow = window.getComputedStyle(document.body).overflow;

    if (lock) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      // Restore the original overflow when the component unmounts or when lock changes
      document.body.style.overflow = originalOverflow;
    };
  }, [lock]);
}
