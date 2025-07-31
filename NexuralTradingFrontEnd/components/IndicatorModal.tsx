"use client"

import type { Indicator } from "@/lib/indicator-data"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import Image from "next/image"

interface IndicatorModalProps {
  indicator: Indicator | null
  onClose: () => void
}

export default function IndicatorModal({ indicator, onClose }: IndicatorModalProps) {
  return (
    <AnimatePresence>
      {indicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-gray-900/80 cyberpunk-glass border border-primary/30 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-primary/20 rounded-full p-2 transition-all z-10"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <div className="p-6 md:p-8">
              <div className="relative w-full aspect-video rounded-md overflow-hidden border border-primary/20 mb-6">
                <Image
                  src={`/abstract-geometric-shapes.png?height=720&width=1280&query=${encodeURIComponent(indicator.name + " financial chart")}`}
                  alt={`${indicator.name} chart`}
                  layout="fill"
                  objectFit="cover"
                  className="bg-gray-800"
                />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white font-mono mb-4 text-primary">
                {indicator.name}
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-400 leading-relaxed">{indicator.description}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">How to Use</h3>
                  <p className="text-gray-400 leading-relaxed">{indicator.usage}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
