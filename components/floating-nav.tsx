"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <>
      <nav
        className={`-translate-x-1/2 fixed top-4 left-1/2 z-50 hidden transform transition-all duration-500 ease-out md:block ${
          isScrolled ? "translate-y-0 opacity-100" : "translate-y-2 opacity-90"
        }`}
      >
        <div className="rounded-full border border-gray-200/50 bg-white/80 px-6 py-3 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center gap-24">
            {/* Logo */}
            <Link className="group flex items-center space-x-2" href="/">
              <Image
                alt="Forged"
                height={100}
                src="/forged-black.svg"
                width={100}
              />
            </Link>

            <div className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  className="group relative font-medium text-gray-600 text-sm transition-colors duration-200 hover:text-black"
                  href={item.href}
                  key={item.name}
                >
                  {item.name}
                  <div className="-bottom-1 absolute left-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            <Link href="/dashboard">
              <Button
                className="rounded-full bg-black px-6 text-white transition-all duration-300 hover:scale-105 hover:bg-gray-800 hover:shadow-lg"
                size="sm"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <nav className="fixed top-4 left-5 z-50 w-11/12 max-w-sm md:hidden">
        <div className="rounded-full border border-gray-200/50 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <Link className="flex items-center space-x-2" href="/">
              <Image
                alt="Forged"
                height={80}
                src="/forged-black.svg"
                width={80}
              />
            </Link>

            <Button
              className="h-10 w-10 rounded-full p-0"
              onClick={() => setIsOpen(!isOpen)}
              size="sm"
              variant="ghost"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">{isOpen ? "Close" : "Open"}</span>
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="slide-in-from-top-5 mt-2 animate-in overflow-hidden rounded-3xl border border-gray-200/50 bg-white/95 shadow-2xl backdrop-blur-xl duration-300">
            <div className="space-y-4 px-6 py-4">
              {navItems.map((item) => (
                <Link
                  className="block py-2 font-medium text-gray-600 text-sm transition-colors duration-200 hover:text-black"
                  href={item.href}
                  key={item.name}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                <Button
                  className="w-full rounded-2xl bg-black text-white transition-all duration-300 hover:bg-gray-800"
                  size="lg"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
