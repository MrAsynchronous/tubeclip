import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TubeClip - YouTube Video Downloader",
  description: "Download YouTube videos as high-quality MP4 files or extract audio as MP3 with professional-grade conversion. Fast, modern, and easy to use.",
  keywords: ["youtube", "downloader", "mp3", "mp4", "video", "audio", "converter"],
  authors: [{ name: "TubeClip" }],
  creator: "TubeClip",
  publisher: "TubeClip",
  robots: "index, follow",
  openGraph: {
    title: "TubeClip - YouTube Video Downloader",
    description: "Download YouTube videos as high-quality MP4 files or extract audio as MP3",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TubeClip - YouTube Video Downloader",
    description: "Download YouTube videos as high-quality MP4 files or extract audio as MP3",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
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
        {children}
      </body>
    </html>
  );
}
