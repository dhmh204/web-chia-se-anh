import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

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
        <Toaster position="top-right" toastOptions={{
          style: {
            background: "#07100d",
            color: "#f8fafc",
            border: "1px solid rgba(16, 185, 129, 0.35)",
          }
        }} />
        {children}</body>
    </html>
  );
}
