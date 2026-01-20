// styles/fonts.ts
import { Inter, Raleway, Courier_Prime } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
});

export const courierPrime = Courier_Prime({
  subsets: ['latin'],
  variable: '--font-courier',
  display: 'swap',
  weight: ['400', '700'],
});

// Export font classes as TypeScript constants
export const fontClasses = {
  inter: inter.variable,
  raleway: raleway.variable,
  courier: courierPrime.variable,
} as const;

// Type-safe font family utility
export type FontFamily = 'inter' | 'raleway' | 'courier';

export const getFontClassName = (font: FontFamily): string => {
  return fontClasses[font];
};