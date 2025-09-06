import { Geist } from "next/font/google";
import type React from "react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Forged - Turn Notes Into Sellable Courses",
    template: "%s | Forged",
  },
  description:
    "Upload PDFs, get AI-generated courses, and start earning money from your knowledge. Create premium educational content with AI assistance.",
  keywords: [
    "AI generated courses",
    "knowledge monetization",
    "PDF to course",
    "educational content",
    "blog pages",
    "listicles",
    "listicles generator",
    "listicles creator",
    "listicles generator",
    "listicles creator",
    "listicles generator",
    "listicles creator",
    "course pages",
    "course pages generator",
    "course pages creator",
    "course pages generator",
    "course pages creator",
    "course pages generator",
    "course pages creator",
  ],
  authors: [{ name: "Forged Team" }],
  creator: "Forged",
  publisher: "Forged",
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
  openGraph: {
    type: "website",
    siteName: "Forged",
    title: "Forged - Turn Notes Into Sellable Courses",
    description:
      "Upload PDFs, get AI-generated courses, and start earning money from your knowledge.",
    url: "https://www.tryforged.me",
    images: [
      {
        url: "https://www.tryforged.me/og-image.png",
        width: 437,
        height: 122,
        alt: "Forged - Turn Notes Into Sellable Courses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forged - Turn Notes Into Sellable Courses",
    description:
      "Upload PDFs, get AI-generated courses, and start earning money from your knowledge.",
    images: ["https://www.tryforged.me/og-image.png"],
    site: "@forged",
  },
  alternates: {
    canonical: "https://www.tryforged.me",
  },
  icons: {
    icon: "/forged-icon.png",
    apple: "/forged-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${geist.variable}`} lang="en">
      <head>
        <meta
          content="kcVxhIL9e7Vv8CxqkY4qn5kr9-hk788i14qq4akr9cg"
          name="google-site-verification"
        />
        <meta content="115EBE3BCD9B79F2E4EF4B6792FD798F" name="msvalidate.01" />
        <script
          src="https://cdn.databuddy.cc/databuddy.js"
          data-client-id="uWx6hxX-dQcPNZd24XDev"
          data-track-hash-changes="true"
          data-track-attributes="true"
          data-track-outgoing-links="true"
          data-track-interactions="true"
          data-track-engagement="true"
          data-track-scroll-depth="true"
          data-track-bounce-rate="true"
          data-track-web-vitals="true"
          data-track-errors="true"
          data-enable-batching="true"
          crossOrigin="anonymous"
          async
        ></script>
      </head>
      <body className={` ${geist.variable}`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
