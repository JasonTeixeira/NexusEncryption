import type React from "react"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import ScrollToTop from "@/components/ScrollToTop"
import SmoothScrollToTop from "@/components/SmoothScrollToTop"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  title: "NEXURAL Trading - Advanced Quantitative Trading Platform",
  description:
    "Professional quantitative trading platform with advanced algorithms, real-time market analysis, and institutional-grade trading tools.",
  keywords:
    "quantitative trading, algorithmic trading, market analysis, trading platform, financial technology, automated trading",
  authors: [{ name: "NEXURAL Trading" }],
  creator: "NEXURAL Trading",
  publisher: "NEXURAL Trading",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexural.com",
    title: "NEXURAL Trading - Advanced Quantitative Trading Platform",
    description:
      "Professional quantitative trading platform with advanced algorithms, real-time market analysis, and institutional-grade trading tools.",
    siteName: "NEXURAL Trading",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXURAL Trading - Advanced Quantitative Trading Platform",
    description:
      "Professional quantitative trading platform with advanced algorithms, real-time market analysis, and institutional-grade trading tools.",
    creator: "@nexuraltrading",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <ScrollToTop />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col bg-black">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <SmoothScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
