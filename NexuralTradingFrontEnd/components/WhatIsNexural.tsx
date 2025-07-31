"use client"

import { motion } from "framer-motion"

export default function WhatIsNexural() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
              WHAT IS <span className="text-primary">NEXURAL?</span>
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Nexural Trading is a discretionary/automation trading community.
Education here is FREE.

 
            </p>
          </motion.div>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between text-lg font-mono text-gray-400">
              <span>PERSON 01</span>
              <span>PERSON 02</span>
            </div>
            <div className="cyberpunk-card border border-gray-800 p-6 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-sm text-gray-400">PRICE: $2,500,000</p>
                <p className="font-mono text-sm text-gray-400">VALUE: $2,500,000</p>
                <p className="font-mono text-sm text-gray-400">ETH: 0.00</p>
                <p className="font-mono text-sm text-gray-400">FEES: $0.00</p>
              </div>
              <div className="w-px h-24 bg-gray-700" />
              <div className="text-right">
                <p className="text-lg text-gray-300">
                  Our smart contract acts as a middle-man. This allows anyone to trade OTC deals completely risk free.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="font-mono text-primary text-lg border-2 border-primary py-2 px-6 cyberpunk-button">
                ACCEPTED
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
