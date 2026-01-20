import type { Metadata } from "next";
import { inter, raleway, courierPrime } from "@/styles/fonts";
import '@/app/globals.css'
import './layout.module.css'
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "SOFT STUDIO - Админ-панель",
  description: "SOFT STUDIO Admin",
  icons: {
    icon: [
      {
        url: '/assets/icons/ss-icon.svg',
        href: "/assets/icons/ss-icon.svg",
      }
    ]
  }
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${courierPrime.variable} ${raleway.variable} ${inter.variable} ${raleway.className}`}>
      <AuthGuard>
        {children}
      </AuthGuard>
    </div>
  );
}
