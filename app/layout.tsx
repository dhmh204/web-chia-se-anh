import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});


export const metadata: Metadata = {
  title: {
    template: "%s | Tiệm ảnh Êm Roo",
    default: "Tiệm ảnh Êm Roo",
  },
  description: "Website chia sẻ ảnh của tiệm ảnh Êm Roo",
  icons: {
    icon: "/images/logo.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <link rel="icon" href="/images/logo.ico" sizes="any" />
      <body  className={inter.className} >
        {children}</body>
    </html>
  );
}
