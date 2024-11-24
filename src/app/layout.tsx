import localFont from "next/font/local";
import "./globals.css";
import StoreProvider from "./storeProvider";
import type { Metadata } from "next";
import Initializer from "./init";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mote",
  description: "the next generation knowledge base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Initializer />
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
