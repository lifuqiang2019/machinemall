import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Machmall - Global Industry & Equipment B2B Marketplace",
  description: "Marketplace for Mechanical & Electrical Industry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="antialiased text-text-main bg-white min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
