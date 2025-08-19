import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { TransitionProvider } from "@/contexts/transition-context"
import { EntryProvider } from "@/contexts/entry-context"
import { SoundProvider } from "@/contexts/sound-context"
import { AccessibilityProvider } from "@/components/accessibility-provider"
import AccessibilityMenu from "@/components/accessibility-menu"
import ScrollToTop from "@/components/scroll-to-top"
import { AuthProvider } from "@/contexts/auth-context"
import { FloatingAITerminal } from "@/components/floating-ai-terminal"
import { ErrorBoundary } from "@/components/error-boundary"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Enhanced performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="canonical" href="https://jasonteixeira.dev" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
body {
  overflow-x: hidden;
}
/* Consistent transition styles for all elements */
* {
  transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
}
/* Skip link styling */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #00ff88;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
}
.skip-link:focus {
  top: 6px;
}
        `}</style>
      </head>
      <body>
        {/* Skip link for keyboard navigation */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <ErrorBoundary>
          <EntryProvider>
            <SoundProvider>
              <AccessibilityProvider>
                <AuthProvider>
                  <TransitionProvider>
                    <ScrollToTop />
                    <AccessibilityMenu />
                    <FloatingAITerminal />
                    <main id="main-content">{children}</main>
                  </TransitionProvider>
                </AuthProvider>
              </AccessibilityProvider>
            </SoundProvider>
          </EntryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'v0.app'
};
