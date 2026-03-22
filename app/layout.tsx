import type { Metadata } from "next";
import { inter } from "./fonts";
import "./globals.css";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Flash Drive",
  description: "F^2 AN",
  alternates: {
    canonical: "https://flashdrive.app/fd-d9c8b7a6e5f4d3c2b1a0f9e8d7c6b5a4",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="bg-[#e0e0e0] scroll-smooth"
      style={{ scrollBehavior: "smooth" }}
    >
      <body className={inter.className}>
        <ToastContainer />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
