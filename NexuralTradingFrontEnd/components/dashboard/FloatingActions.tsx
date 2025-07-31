"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RefreshCw, Settings, BarChart3 } from "lucide-react"

interface FloatingActionsProps {
  onRefresh: () => void
}

export default function FloatingActions({ onRefresh }: FloatingActionsProps) {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={onRefresh}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-blue-400 text-black shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
        >
          <RefreshCw className="h-6 w-6" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
      >
        <Button className="w-12 h-12 rounded-full bg-black/50 border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300">
          <Settings className="h-5 w-5" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
      >
        <Button className="w-12 h-12 rounded-full bg-black/50 border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300">
          <BarChart3 className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  )
}
