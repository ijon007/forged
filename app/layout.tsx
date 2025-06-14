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
  title: "Knowledgesmith - Turn Notes Into Sellable Courses",
  description: "Upload PDFs, get AI-generated courses, and start earning money from your knowledge.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className={` ${geist.variable}`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
