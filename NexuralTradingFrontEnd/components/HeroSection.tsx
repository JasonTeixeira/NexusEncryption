"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import {
  PlayCircle,
  Zap,
  ArrowLeftRight,
  BarChart,
  BrainCircuit,
  GitBranch,
  AreaChart,
  AppWindow,
  Droplets,
  Smile,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import VideoModal from "./VideoModal"
import HeroBackground from "./HeroBackground"

const quantData = [
  { symbol: "BTC/USD", price: 68450.23, change: 0.012 },
  { symbol: "ETH/USD", price: 3550.11, change: -0.005 },
  { symbol: "SPX", price: 5470.5, change: 0.003 },
  { symbol: "VIX", price: 12.88, change: 0.02 },
  { symbol: "Δ", value: 0.58, name: "Delta" },
  { symbol: "Γ", value: 0.02, name: "Gamma" },
  { symbol: "Θ", value: -0.045, name: "Theta" },
  { symbol: "ν", value: 0.32, name: "Vega" },
  { symbol: "WTI Crude", price: 80.55, change: 0.015 },
  { symbol: "Gold", price: 2330.7, change: -0.002 },
]

const TickerTape = () => {
  const [data, setData] = useState(quantData)

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((item) => {
          const randomFactor = (Math.random() - 0.5) * 0.01
          if (item.price) {
            return { ...item, price: item.price * (1 + randomFactor), change: randomFactor }
          }
          if (item.value) {
            return { ...item, value: item.value * (1 + randomFactor) }
          }
          return item
        }),
      )
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  const extendedData = [...data, ...data, ...data, ...data]

  return (
    <div className="w-full overflow-hidden whitespace-nowrap bg-gray-900/50 border-y border-gray-800 py-3">
      <motion.div
        className="flex"
        animate={{ x: ["0%", "-25%"] }}
        transition={{ ease: "linear", duration: 60, repeat: Number.POSITIVE_INFINITY }}
      >
        {extendedData.map((item, index) => (
          <div key={index} className="flex items-center mx-6 text-sm font-mono">
            <span className="text-gray-300 font-semibold">{item.symbol}</span>
            {item.price && (
              <>
                <span className={`ml-3 font-bold ${item.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                  ${item.price.toFixed(2)}
                </span>
                <span className={`ml-2 text-xs ${item.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change * 100).toFixed(2)}%
                </span>
              </>
            )}
            {item.value && <span className="ml-3 text-cyan-400 font-bold">{item.value.toFixed(3)}</span>}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

const AdvancedStatsGrid = () => {
  const initialStats = useMemo(
    () => [
      { id: "flow", label: "Order Flow", value: 68, icon: ArrowLeftRight, animation: "animate-flow-pulse" },
      { id: "regime", label: "Market Regime", value: "Trending", icon: BarChart, animation: "animate-regime-pulse" },
      {
        id: "sentiment",
        label: "Market Sentiment",
        value: "Bullish",
        icon: BrainCircuit,
        animation: "animate-sentiment-wave",
      },
      { id: "fractal", label: "Fractal Dimension", value: 1.42, icon: GitBranch, animation: "animate-fractal-grow" },
      { id: "iv_skew", label: "IV Surface Skew", value: 18.4, icon: AreaChart, animation: "animate-iv-skew" },
      { id: "correlation", label: "Correlation Matrix", value: 0.84, icon: AppWindow, animation: "animate-corr-pulse" },
      { id: "liquidity", label: "Liquidity Depth", value: 4.2, icon: Droplets, animation: "animate-liquidity-bubble" },
      { id: "vol_smile", label: "Volatility Smile", value: 0.23, icon: Smile, animation: "animate-smile-morph" },
    ],
    [],
  )

  const [stats, setStats] = useState(initialStats)

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) =>
        prevStats.map((stat) => {
          switch (stat.id) {
            case "flow":
              return { ...stat, value: Math.floor(Math.random() * 101) }
            case "regime":
              const regimes = ["Trending", "Ranging", "Volatile", "Breakout"]
              return { ...stat, value: regimes[Math.floor(Math.random() * regimes.length)] }
            case "sentiment":
              return { ...stat, value: Math.random() > 0.5 ? "Bullish" : "Bearish" }
            case "fractal":
              return { ...stat, value: Number((Math.random() * 0.6 + 1.2).toFixed(2)) }
            case "iv_skew":
              return { ...stat, value: Number((Math.random() * 30 + 10).toFixed(1)) }
            case "correlation":
              return { ...stat, value: Number((Math.random() * 0.4 + 0.6).toFixed(2)) }
            case "liquidity":
              return { ...stat, value: Number((Math.random() * 5 + 2).toFixed(1)) }
            case "vol_smile":
              return { ...stat, value: Number((Math.random() * 0.5).toFixed(2)) }
            default:
              return stat
          }
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const renderVisualization = (stat: (typeof stats)[0]) => {
    switch (stat.id) {
      case "flow":
        const flowValue = stat.value as number
        return (
          <div className="w-full mt-auto flex flex-col items-center">
            <div className="w-full">
              <div className="flex justify-between text-xs text-gray-400 mb-1 px-1">
                <span>SELL</span>
                <span>BUY</span>
              </div>
              <div className="flow-meter">
                <div
                  className="flow-fill"
                  style={{ width: `${flowValue}%`, backgroundColor: `hsl(${flowValue * 1.2}, 70%, 50%)` }}
                />
              </div>
            </div>
            <div className="text-3xl font-mono text-white mt-4">{flowValue}%</div>
          </div>
        )
      case "liquidity":
        return (
          <div className="w-full mt-auto flex flex-col items-center">
            <div className="liquidity-chart">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="liquidity-bar"
                  style={{ animationDelay: `${i * 0.15}s`, height: `${Math.random() * 60 + 20}%` }}
                />
              ))}
            </div>
            <div className="text-3xl font-mono text-white mt-4">${stat.value}B</div>
          </div>
        )
      case "iv_skew":
        return (
          <div className="w-full mt-auto flex flex-col items-center">
            <div className="iv-surface">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="iv-bar"
                  style={{ animationDelay: `${i * 0.2}s`, height: `${Math.sin((i / 9) * Math.PI) * 80 + 20}%` }}
                />
              ))}
            </div>
            <div className="text-3xl font-mono text-white mt-4">{stat.value as number}%</div>
          </div>
        )
      case "correlation":
        return (
          <div className="w-full mt-auto flex flex-col items-center">
            <div className="corr-matrix">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="corr-cell"
                  style={{ backgroundColor: `hsla(var(--primary) / ${Math.random() * 0.5})` }}
                />
              ))}
            </div>
            <div className="text-3xl font-mono text-white mt-4">{stat.value as number}</div>
          </div>
        )
      case "regime":
        const regimes = ["Trending", "Ranging", "Volatile", "Breakout"]
        const activeIndex = regimes.indexOf(stat.value as string)
        return (
          <div className="w-full mt-auto flex flex-col items-center">
            <div className="regime-blocks">
              {regimes.map((r, i) => (
                <div key={r} className={`regime-block ${i === activeIndex ? "active" : ""}`} />
              ))}
            </div>
            <div className="text-2xl font-mono text-white mt-3">{stat.value as string}</div>
          </div>
        )
      default:
        return (
          <div className="m-auto text-center">
            <div className="text-5xl font-bold font-mono text-white">{stat.value}</div>
          </div>
        )
    }
  }

  return (
    <motion.div
      className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.8, staggerChildren: 0.1 }}
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.id}
          className="cyberpunk-metric-card flex flex-col h-56"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="text-xs text-gray-400 uppercase tracking-widest font-display">{stat.label}</div>
            <stat.icon className={`w-5 h-5 text-primary metric-icon ${stat.animation}`} />
          </div>
          <div className="flex-grow flex items-center justify-center">{renderVisualization(stat)}</div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
        <HeroBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-8 text-white">
              <span className="text-primary flicker-glitch text-glow" style={{ color: "hsl(var(--primary))" }}>
                QUANT
              </span>{" "}
              TRADING
              <br />
              FOR EVERYONE
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 font-light tracking-wide mb-12 max-w-3xl mx-auto">
              Trade futures with quantitative models without price impact or slippage
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                className="group text-base font-semibold font-display tracking-wide border-2 border-primary text-primary bg-transparent hover:bg-primary/10 transition-all duration-300 px-6 py-3"
              >
                <Zap className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:animate-pulse" />
                Join FREE Discord
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsModalOpen(true)}
                className="group text-base font-semibold font-display tracking-wide border-2 border-gray-700 text-gray-400 bg-transparent hover:border-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 px-6 py-3"
              >
                <PlayCircle className="mr-2 transition-transform duration-300 group-hover:scale-110" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-16"
            >
              <TickerTape />
            </motion.div>
          </motion.div>

          <AdvancedStatsGrid />
        </div>
      </section>

      <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} videoId="dQw4w9WgXcQ" />
    </>
  )
}
