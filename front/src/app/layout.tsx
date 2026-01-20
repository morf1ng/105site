import type { Metadata } from "next";
import { Courier_Prime, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { inter, raleway } from "@/styles/fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const courierPrime = Courier_Prime({
  subsets: ['latin'],
  variable: '--font-courier',
  display: 'swap',
  weight: ['400', '700'],   // явно перечисляем нужные
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: "SOFT STUDIO - Код. Дизайн. Результат.",
  description: "SOFT STUDIO",
  keywords: "SOFT STUDIO, SOFTSTUDIO, СОФТ СТУДИО, СОФТСТУДИО, Разработка, IT",
  icons: {
    icon: [
      {
        url: 'assets/icons/ss-icon.svg',
        href: "assets/icons/ss-icon.svg",
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${courierPrime.variable} ${raleway.variable} ${inter.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
