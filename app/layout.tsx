import "./globals.css";
import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import { ReactNode } from "react";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-ui",
  weight: ["400", "500", "600", "700", "800"]
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-note",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Gửi thư đến tương lai",
  description: "Ứng dụng viết thư gửi đến chính mình trong tương lai."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} ${playfairDisplay.variable}`}>
        {children}
      </body>
    </html>
  );
}
