import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import GlobalErrorListener from "../components/global-error-listener"
import TauriUpdater from "../components/tauri-updater"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nexus Encryption - Enterprise Security Platform",
  description: "Advanced encryption and security platform with enterprise-grade protection for your data and communications.",
  keywords: "encryption, security, cryptography, enterprise, data protection, AES-256, ChaCha20",
  authors: [{ name: "Nexus Encryption Team" }],
  creator: "Nexus Encryption",
  publisher: "Nexus Encryption",
  robots: "index, follow",
  openGraph: {
    title: "Nexus Encryption - Enterprise Security Platform",
    description: "Advanced encryption and security platform with enterprise-grade protection",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Encryption - Enterprise Security Platform",
    description: "Advanced encryption and security platform with enterprise-grade protection",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
  html {
    font-family: ${inter.style.fontFamily};
    --font-sans: ${inter.style.fontFamily};
    --font-mono: ${inter.style.fontFamily};
  }
        `}</style>
      </head>
      <body>
        <GlobalErrorListener />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="nexus-encryption-theme"
        >
          <TauriUpdater />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
