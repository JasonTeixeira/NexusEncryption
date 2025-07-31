"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// ——— Background grid for the Quant page header ———
const QuantHeaderBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:20px_20px]" />
  </div>
)

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Quant", href: "/quant" },
    { name: "Indicators", href: "/indicators" },
    { name: "Trading Bots", href: "/bots" },
    { name: "Blog", href: "/blog" },
    { name: "Training", href: "/training" },
    { name: "Glossary", href: "/glossary" },
    { name: "Strategy Lab", href: "/strategy-lab" },
  ]

  return (
    <>
      {/* Desktop / Tablet Nav Bar */}
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-black/80 backdrop-blur-lg border-b border-gray-800" : "bg-transparent",
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <QuantHeaderBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="flex flex-col items-start">
                <div className="flex items-baseline font-display">
                  <span className="text-2xl font-bold text-white">NEX</span>
                  <span className="text-2xl font-bold text-primary">URAL</span>
                </div>
                <div className="text-xs font-display text-gray-400 tracking-widest uppercase -mt-1">Trading</div>
              </div>
            </Link>

            {/* Links + CTA (desktop) */}
            <div className="hidden md:flex items-center">
              <nav className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-gray-300 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="ml-8">
                <Button
                  className="cyberpunk-button bg-primary text-black hover:bg-primary/90 font-bold font-display text-sm"
                  asChild
                >
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard size={16} />
                    <span>DASHBOARD</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-white">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="md:hidden fixed inset-0 bg-black z-40 pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <nav className="flex flex-col items-center space-y-8 mt-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-gray-300 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <Button
              className="cyberpunk-button bg-primary text-black hover:bg-primary/90 font-bold font-display text-sm mt-4"
              asChild
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <LayoutDashboard size={16} />
                <span>DASHBOARD</span>
              </Link>
            </Button>
          </nav>
        </motion.div>
      )}
    </>
  )
}
