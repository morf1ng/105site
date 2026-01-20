'use client'
import { useEffect, useState } from 'react';

export default function BurgerMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const burger     = document.querySelector('.header__burger');
    const menu       = document.querySelector('.burger__menu') as HTMLElement | null;
    const header     = document.querySelector('header');
    const body       = document.body;
    const menuLinks  = Array.from(document.querySelectorAll<HTMLAnchorElement>('.burger__menu .header__menu-link'));
    const desktopLinks=Array.from(document.querySelectorAll<HTMLAnchorElement>('.menu .header__menu-link'));

    if (!burger || !menu || !header) return;

    const close = () => {
      setOpen(false);
      header.classList.remove('menu-open');
      burger.classList.remove('active');
      menu.classList.remove('active');
      body.classList.remove('no-scroll');
      setTimeout(() => (menu.style.display = 'none'), 300);
    };

    const openMenu = () => {
      setOpen(true);
      header.classList.add('menu-open');
      burger.classList.add('active');
      menu.style.display = 'flex';
      body.classList.add('no-scroll');
      setTimeout(() => menu.classList.add('active'), 10);
    };

    const onBurgerClick = (e: Event) => {
      e.stopPropagation();
      open ? close() : openMenu();
    };

    const onLinkClick = (e: MouseEvent) => {
      const link = e.currentTarget as HTMLAnchorElement;
      const href = link.getAttribute('href');
      if (href?.startsWith('#') && href !== '#!') {
        e.preventDefault();
        close();
        setTimeout(() => scrollToAnchor(href), 300);
      } else {
        close();
      }
    };

    const scrollToAnchor = (href: string) => {
      const id = href.substring(1);
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.pageYOffset - header.clientHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    };

    const onDocClick = (e: MouseEvent) => {
      if (open && !menu.contains(e.target as Node) && !burger.contains(e.target as Node)) close();
    };

    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && open && close();

    burger.addEventListener('click', onBurgerClick);
    menuLinks.forEach(l => l.addEventListener('click', onLinkClick));
    desktopLinks.forEach(l => l.addEventListener('click', onLinkClick));
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onEsc);

    return () => {
      burger.removeEventListener('click', onBurgerClick);
      menuLinks.forEach(l => l.removeEventListener('click', onLinkClick));
      desktopLinks.forEach(l => l.removeEventListener('click', onLinkClick));
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return null;
}