// app/layout.tsx
import type { Metadata } from "next";
import { inter, raleway, courierPrime } from "@/styles/fonts";
import '@/app/globals.css'

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${courierPrime.variable} ${raleway.variable} ${inter.variable}`}>
      <body className={raleway.className}>  {/* Apply default font to body */}
        {children}
      </body>
    </html>
  );
}