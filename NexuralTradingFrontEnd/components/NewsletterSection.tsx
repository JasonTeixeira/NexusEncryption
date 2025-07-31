"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle, Mail, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) {
      setStatus("error")
      setMessage("Please enter a valid email address.")
      return
    }

    setStatus("submitting")
    setMessage("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (email.includes("@")) {
      setStatus("success")
      setMessage("Success! You are now connected to the Nexural datastream.")
      setEmail("")
    } else {
      setStatus("error")
      setMessage("Invalid email format. Please try again.")
    }
  }

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 font-mono uppercase">
            ACCESS THE <span className="text-primary drop-shadow-[0_0_15px_rgba(184,255,0,0.7)]">DATASTREAM</span>
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Join our free newsletter for market analysis, bot performance reports, and exclusive insights from the
            Nexural core.
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form
            onSubmit={handleSubmit}
            className="cyberpunk-glass cyberpunk-card border-2 border-primary/30 p-4 pl-6 flex flex-col sm:flex-row items-center gap-4"
          >
            <Mail className="text-primary/70 hidden sm:block" />
            <Input
              type="email"
              placeholder="your_alias@domain.com"
              className="flex-grow bg-transparent border-none text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "submitting" || status === "success"}
            />
            <Button
              type="submit"
              size="lg"
              className={cn(
                "w-full sm:w-auto cyberpunk-button bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base uppercase tracking-wider transition-all duration-300",
                status === "submitting" && "animate-pulse",
              )}
              disabled={status === "submitting" || status === "success"}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={status}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  {status === "submitting" ? (
                    "Connecting..."
                  ) : status === "success" ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Connected
                    </>
                  ) : (
                    <>
                      Subscribe <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </motion.span>
              </AnimatePresence>
            </Button>
          </form>
          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "mt-4 text-sm font-mono flex items-center justify-center gap-2",
                  status === "success" && "text-primary",
                  status === "error" && "text-red-500",
                )}
              >
                {status === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
