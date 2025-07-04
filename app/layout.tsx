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
        url: 'https://tryforged.vercel.app',
        images: [
            {
                url: 'https://tryforged.vercel.app/og-image.png',
                width: 437,
                height: 122,
                alt: 'Forged - Turn Notes Into Sellable Courses',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Forged - Turn Notes Into Sellable Courses',
        description: 'Upload PDFs, get AI-generated courses, and start earning money from your knowledge.',
        images: ['https://tryforged.vercel.app/og-image.png'],
        site: '@forged',
    },
    alternates: {
        canonical: 'https://tryforged.vercel.app',
    },
    icons: {
        icon: '/forged.png',
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
                {/* Additional SEO meta tags */}
                <meta name="theme-color" content="#000000" media="(prefers-color-scheme: light)" />
                <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: dark)" />
                <meta name="application-name" content="Forged" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Forged" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-config" content="/browserconfig.xml" />
                <meta name="msapplication-TileColor" content="#000000" />
                <meta name="msapplication-tap-highlight" content="no" />
            </head>
            <body className={` ${geist.variable}`}>
                {children}
                <Toaster />
                <Analytics />
            </body>
        </html>
    )
}
