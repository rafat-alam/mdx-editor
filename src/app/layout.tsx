import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Providers } from "./providers";

import "./globals.css";
import { NavMenu } from "@/components/nav-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MDX Editor - Advanced Markdown Editor",
    template: "%s | MDX Editor",
  },
  description:
    "A powerful and intuitive MDX editor for creating and editing markdown content with live preview and advanced features.",
  keywords: [
    "MDX",
    "Markdown",
    "Editor",
    "Writing",
    "Content Creation",
    "Documentation",
  ],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  metadataBase: new URL("https://yourdomain.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    title: "MDX Editor - Advanced Markdown Editor",
    description:
      "A powerful and intuitive MDX editor for creating and editing markdown content with live preview and advanced features.",
    siteName: "MDX Editor",
  },
  twitter: {
    card: "summary_large_image",
    title: "MDX Editor - Advanced Markdown Editor",
    description:
      "A powerful and intuitive MDX editor for creating and editing markdown content with live preview and advanced features.",
    creator: "@yourhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <NavMenu />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
