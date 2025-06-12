import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
    <html lang="en" className={`${inter.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
