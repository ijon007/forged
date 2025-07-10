import type React from "react"
import { Geist } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/next"

const geist = Geist({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-geist-sans",
})

export const metadata: Metadata = {
    title: {
        default: "Forged - Turn Notes Into Sellable Courses",
        template: "%s | Forged"
    },
    description: "Upload PDFs, get AI-generated courses, and start earning money from your knowledge. Create premium educational content with AI assistance.",
    keywords: ["AI generated courses", "knowledge monetization", "PDF to course", "educational content", "blog pages", "listicles", "listicles generator", "listicles creator", "listicles generator", "listicles creator", "listicles generator", "listicles creator", "course pages", "course pages generator", "course pages creator", "course pages generator", "course pages creator", "course pages generator", "course pages creator"],
    authors: [{ name: "Forged Team" }],
    creator: "Forged",
    publisher: "Forged",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        siteName: 'Forged',
        title: 'Forged - Turn Notes Into Sellable Courses',
        description: 'Upload PDFs, get AI-generated courses, and start earning money from your knowledge.',
        url: 'https://www.tryforged.me',
        images: [
            {
                url: 'https://www.tryforged.me/og-image.png',
                width: 437,
                height: 122,
                alt: 'Forged - Turn Notes Into Sellable Courses',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Forged - Turn Notes Into Sellable Courses',
        description: 'Upload PDFs, get AI-generated courses, and start earning money from your knowledge.',
        images: ['https://www.tryforged.me/og-image.png'],
        site: '@forged',
    },
    alternates: {
        canonical: 'https://www.tryforged.me',
    },
    icons: {
        icon: '/forged-icon.png',
        apple: '/forged-icon.png',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${geist.variable}`}>
            <head>
                <meta name="google-site-verification" content="kcVxhIL9e7Vv8CxqkY4qn5kr9-hk788i14qq4akr9cg" />
                <meta name="msvalidate.01" content="115EBE3BCD9B79F2E4EF4B6792FD798F" /> 
            </head>
            <body className={` ${geist.variable}`}>
                {children}
                <Toaster />
                <Analytics />
            </body>
        </html>
    )
}
