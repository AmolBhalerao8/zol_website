import type { Metadata } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Display face: industrial grotesque, used heavy and uppercase. */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

/** Data face: repair orders, plates, VINs, timestamps, part numbers. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZOL | The best AI shop management tool for auto shops",
  description:
    "Don't let your competitors beat you with AI. ZOL is the best AI shop management tool for auto shops - converting real-world repair videos and technical documentation into procedural intelligence that guides technicians today and powers embodied AI tomorrow.",
  icons: {
    icon: "/zol-logo.png",
    shortcut: "/zol-logo.png",
    apple: "/zol-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} ${archivo.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        >{children}</body>
      </html>
    </ClerkProvider>
  );
}
