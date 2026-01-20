'use client'

import { useEffect } from 'react';

export default function HeaderHide() {
  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScrollTop = 0;
    let rafId: number | null = null;
    const scrollThreshold = 5;

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDelta = currentScrollTop - lastScrollTop;

        if (Math.abs(scrollDelta) > scrollThreshold) {
          if (scrollDelta > 0 && currentScrollTop > 100) {
            header.classList.add('hide');
          } else if (scrollDelta < 0 || currentScrollTop <= 100) {
            header.classList.remove('hide');
          }
          lastScrollTop = currentScrollTop;
        }
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}