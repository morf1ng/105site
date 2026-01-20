'use client'

import { useEffect } from 'react';

type Props = {
  items?: { question: string; answer: string }[];
};

export default function FaqAccordion() {
  useEffect(() => {
    const questions = Array.from(
      document.querySelectorAll<HTMLElement>('.faq__questions-element')
    );
    if (!questions.length) return;

    const closeAll = (except?: HTMLElement) => {
      questions.forEach((el) => {
        if (el !== except) {
          el.classList.remove('open');
          el.setAttribute('aria-expanded', 'false');
        }
      });
    };

    const toggle = (el: HTMLElement) => {
      const wasOpen = el.classList.contains('open');
      closeAll(el);
      if (!wasOpen) {
        el.classList.add('open');
        el.setAttribute('aria-expanded', 'true');
      } else {
        el.classList.remove('open');
        el.setAttribute('aria-expanded', 'false');
      }
    };

    questions.forEach((el) => {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-expanded', 'false');

      const onClick = () => toggle(el);
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle(el);
        }
      };

      el.addEventListener('click', onClick);
      el.addEventListener('keydown', onKeyDown);

      return () => {
        el.removeEventListener('click', onClick);
        el.removeEventListener('keydown', onKeyDown);
      };
    });
  }, []);

  return null;
}