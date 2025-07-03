"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

export function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: "Pricing", href: "/#pricing" },
    { name: "Testimonials", href: "/#testimonials" },
    { name: "FAQ", href: "/#faq" },
    { name: "Blog", href: "/blog" },
  ]

  return (
    <>
      <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out hidden md:block ${
        isScrolled 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-2 opacity-90'
      }`}>
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-full px-6 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-24">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
                <Image src="/forged-black.svg" alt="Forged" width={80} height={80} />
            </Link>

            <div className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors duration-200 relative group"
                >
                  {item.name}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            <Link href="/login">
              <Button
                size="sm"
                className="bg-black text-white hover:bg-gray-800 rounded-full px-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <nav className="fixed top-4 left-5 z-50 md:hidden w-11/12 max-w-sm">
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-full px-4 py-3 shadow-xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/forged-black.svg" alt="Forged" width={80} height={80} />
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full w-10 h-10 p-0"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-2 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-top-5 duration-300">
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium text-gray-600 hover:text-black transition-colors duration-200 py-2"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full bg-black text-white hover:bg-gray-800 rounded-2xl transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
} 