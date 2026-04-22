import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FinanzasJY",
  description: "Gestión financiera personal de Jose Ybarra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} font-sans bg-jy-bg text-jy-text antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
