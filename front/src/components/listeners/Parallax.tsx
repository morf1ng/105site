'use client'

import { useEffect } from 'react';

export default function Parallax() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.parallax-element');
    if (!els.length) return;

    let rafId: number | null = null;

    const onMouseMove = (e: MouseEvent) => {
      const ww = window.innerWidth;
      const wh = window.innerHeight;

      const x = ((e.clientX - ww / 2) / (ww / 2)) * 50;
      const y = ((e.clientY - wh / 2) / (wh / 2)) * 50;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        els.forEach((el) => {
          el.style.transform = `translate(${x}px, ${y}px)`;
        });
        rafId = null;
      });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}