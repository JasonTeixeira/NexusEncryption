"use client"

import { useState } from "react"
import { useAccessibility } from "./accessibility-provider"
import { Settings, Eye, Volume2, Type, Contrast, Zap } from "lucide-react"

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    highContrast,
    reducedMotion,
    screenReaderMode,
    fontSize,
    toggleHighContrast,
    toggleReducedMotion,
    toggleScreenReaderMode,
    setFontSize,
    announceToScreenReader,
  } = useAccessibility()

  const handleToggle = (action: () => void, message: string) => {
    action()
    announceToScreenReader(message)
  }

  return (
    <div className="fixed top-16 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-gray-900/90 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-gray-800/90 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
        aria-label="Open accessibility menu"
        aria-expanded={isOpen}
        aria-controls="accessibility-menu"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          id="accessibility-menu"
          className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 shadow-2xl"
          role="menu"
          aria-label="Accessibility options"
        >
          <h3 className="text-cyan-400 font-mono text-lg mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Accessibility
          </h3>

          <div className="space-y-4">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <label htmlFor="high-contrast" className="text-gray-300 font-mono text-sm flex items-center gap-2">
                <Contrast className="w-4 h-4" />
                High Contrast
              </label>
              <button
                id="high-contrast"
                onClick={() =>
                  handleToggle(toggleHighContrast, `High contrast ${!highContrast ? "enabled" : "disabled"}`)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  highContrast ? "bg-cyan-600" : "bg-gray-600"
                }`}
                role="switch"
                aria-checked={highContrast}
                aria-label="Toggle high contrast mode"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    highContrast ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <label htmlFor="reduced-motion" className="text-gray-300 font-mono text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Reduce Motion
              </label>
              <button
                id="reduced-motion"
                onClick={() =>
                  handleToggle(toggleReducedMotion, `Reduced motion ${!reducedMotion ? "enabled" : "disabled"}`)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  reducedMotion ? "bg-cyan-600" : "bg-gray-600"
                }`}
                role="switch"
                aria-checked={reducedMotion}
                aria-label="Toggle reduced motion"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    reducedMotion ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Screen Reader Mode */}
            <div className="flex items-center justify-between">
              <label htmlFor="screen-reader" className="text-gray-300 font-mono text-sm flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Screen Reader
              </label>
              <button
                id="screen-reader"
                onClick={() =>
                  handleToggle(
                    toggleScreenReaderMode,
                    `Screen reader mode ${!screenReaderMode ? "enabled" : "disabled"}`,
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  screenReaderMode ? "bg-cyan-600" : "bg-gray-600"
                }`}
                role="switch"
                aria-checked={screenReaderMode}
                aria-label="Toggle screen reader optimizations"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    screenReaderMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-gray-300 font-mono text-sm flex items-center gap-2 mb-2">
                <Type className="w-4 h-4" />
                Font Size
              </label>
              <div className="flex gap-2">
                {(["normal", "large", "extra-large"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setFontSize(size)
                      announceToScreenReader(`Font size set to ${size.replace("-", " ")}`)
                    }}
                    className={`px-3 py-2 rounded font-mono text-xs border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                      fontSize === size
                        ? "bg-cyan-600 border-cyan-500 text-white"
                        : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                    }`}
                    aria-pressed={fontSize === size}
                  >
                    {size === "normal" && "A"}
                    {size === "large" && "A+"}
                    {size === "extra-large" && "A++"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-xs font-mono">
              Use Tab to navigate, Enter to activate, and Escape to close menus.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
