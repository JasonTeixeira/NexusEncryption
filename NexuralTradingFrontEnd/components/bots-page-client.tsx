"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Cpu,
  GitBranch,
  Crosshair,
  Zap,
  Atom,
  Play,
  Pause,
  TrendingUp,
  Activity,
  Target,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const tradingBots = [
  {
    id: "quantum",
    name: "Q",
    title: "Quantum Momentum Engine",
    description:
      "Analyzes market momentum across multiple timeframes to identify high-probability trend continuations with quantum-inspired algorithms.",
    icon: Cpu,
    category: "Momentum",
    accuracy: 87,
    trades: 2847,
    winRate: 73,
    avgReturn: 2.4,
    timeframe: "1m-4h",
    complexity: 5,
    features: [
      "Multi-timeframe momentum analysis",
      "Quantum-inspired pattern recognition",
      "Dynamic position sizing",
      "Real-time trend confirmation",
      "Advanced risk management",
    ],
    useCases: ["Trend Following", "Momentum Trading", "Breakout Strategies"],
    performance: {
      daily: 85,
      weekly: 78,
      monthly: 92,
      yearly: 88,
    },
    gradient: "from-blue-500/20 via-cyan-500/20 to-blue-600/20",
    glowColor: "shadow-blue-500/50",
  },
  {
    id: "reversal",
    name: "R",
    title: "Reversal Recognition Matrix",
    description:
      "Detects potential market reversals by identifying key exhaustion points and divergences in price action using advanced pattern recognition.",
    icon: GitBranch,
    category: "Reversal",
    accuracy: 82,
    trades: 1923,
    winRate: 69,
    avgReturn: 3.1,
    timeframe: "5m-1d",
    complexity: 4,
    features: [
      "Exhaustion point detection",
      "Divergence analysis",
      "Support/resistance mapping",
      "Volume confirmation signals",
      "Multi-indicator convergence",
    ],
    useCases: ["Reversal Trading", "Counter-trend", "Swing Trading"],
    performance: {
      daily: 79,
      weekly: 84,
      monthly: 81,
      yearly: 85,
    },
    gradient: "from-purple-500/20 via-pink-500/20 to-purple-600/20",
    glowColor: "shadow-purple-500/50",
  },
  {
    id: "execution",
    name: "X",
    title: "Execution Precision Protocol",
    description:
      "Focuses on sniper-like entries and exits, minimizing slippage and maximizing risk-to-reward ratios with institutional-grade execution.",
    icon: Crosshair,
    category: "Execution",
    accuracy: 91,
    trades: 3456,
    winRate: 76,
    avgReturn: 1.8,
    timeframe: "1m-1h",
    complexity: 5,
    features: [
      "Precision entry/exit timing",
      "Slippage minimization",
      "Smart order routing",
      "Liquidity analysis",
      "Execution cost optimization",
    ],
    useCases: ["Scalping", "High-frequency", "Precision Trading"],
    performance: {
      daily: 93,
      weekly: 89,
      monthly: 91,
      yearly: 90,
    },
    gradient: "from-green-500/20 via-emerald-500/20 to-green-600/20",
    glowColor: "shadow-green-500/50",
  },
  {
    id: "oracle",
    name: "O",
    title: "Oracle Volatility Scanner",
    description:
      "Scans for unusual volatility spikes and breakout opportunities, capitalizing on rapid market movements with predictive analytics.",
    icon: Zap,
    category: "Volatility",
    accuracy: 84,
    trades: 2134,
    winRate: 71,
    avgReturn: 2.9,
    timeframe: "1m-2h",
    complexity: 4,
    features: [
      "Volatility spike detection",
      "Breakout prediction",
      "News event correlation",
      "Market sentiment analysis",
      "Rapid execution protocols",
    ],
    useCases: ["Volatility Trading", "News Trading", "Breakout Strategies"],
    performance: {
      daily: 86,
      weekly: 82,
      monthly: 84,
      yearly: 83,
    },
    gradient: "from-yellow-500/20 via-orange-500/20 to-yellow-600/20",
    glowColor: "shadow-yellow-500/50",
  },
  {
    id: "zenith",
    name: "Z",
    title: "Zenith Mean Reversion",
    description:
      "Identifies over-extended assets and trades the statistical probability of price returning to its historical mean with advanced statistical models.",
    icon: Atom,
    category: "Mean Reversion",
    accuracy: 79,
    trades: 1876,
    winRate: 68,
    avgReturn: 2.2,
    timeframe: "15m-4h",
    complexity: 3,
    features: [
      "Statistical mean analysis",
      "Over-extension detection",
      "Probability modeling",
      "Historical pattern matching",
      "Risk-adjusted positioning",
    ],
    useCases: ["Mean Reversion", "Statistical Arbitrage", "Range Trading"],
    performance: {
      daily: 77,
      weekly: 81,
      monthly: 79,
      yearly: 80,
    },
    gradient: "from-red-500/20 via-rose-500/20 to-red-600/20",
    glowColor: "shadow-red-500/50",
  },
]

const categories = ["All", "Momentum", "Reversal", "Execution", "Volatility", "Mean Reversion"]

const stats = [
  { label: "Active Bots", value: "5", icon: Activity },
  { label: "Total Trades", value: "12.2K+", icon: BarChart3 },
  { label: "Avg Accuracy", value: "84.6%", icon: Target },
  { label: "Combined ROI", value: "247%", icon: TrendingUp },
]

export default function BotsPageClient() {
  const [selectedBot, setSelectedBot] = useState(tradingBots[0])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotation logic
  useEffect(() => {
    if (!isAutoRotating) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const filteredBots =
          selectedCategory === "All" ? tradingBots : tradingBots.filter((bot) => bot.category === selectedCategory)
        const nextIndex = (prev + 1) % filteredBots.length
        setSelectedBot(filteredBots[nextIndex])
        return nextIndex
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoRotating, selectedCategory])

  const filteredBots =
    selectedCategory === "All" ? tradingBots : tradingBots.filter((bot) => bot.category === selectedCategory)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    const newFilteredBots = category === "All" ? tradingBots : tradingBots.filter((bot) => bot.category === category)
    setSelectedBot(newFilteredBots[0])
    setCurrentIndex(0)
  }

  const handleBotSelect = (bot: (typeof tradingBots)[0]) => {
    setSelectedBot(bot)
    setIsAutoRotating(false)
    const botIndex = filteredBots.findIndex((b) => b.id === bot.id)
    setCurrentIndex(botIndex)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: 9999,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Badge
                variant="outline"
                className="mb-6 px-4 py-2 text-sm font-mono border-primary/50 text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI-POWERED TRADING BOTS
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 font-mono">
                <span className="text-white">NEXURAL</span>{" "}
                <span className="bg-gradient-to-r from-primary via-green-400 to-primary bg-clip-text text-transparent">
                  TRADING BOTS
                </span>
              </h1>

              <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed">
                Our proprietary suite of AI-powered trading bots, engineered for institutional-grade performance. Each
                bot specializes in different market conditions and trading strategies, powered by advanced machine
                learning algorithms and real-time market analysis.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                    className="text-center group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                      <stat.icon className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bot Showcase Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-mono">
                <span className="text-primary">BOT</span> SHOWCASE
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
                Explore our advanced trading bots in action. Each bot is designed for specific market conditions and
                trading strategies, delivering consistent performance across different market environments.
              </p>

              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-6 py-2 font-mono transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-primary text-black hover:bg-primary/90"
                        : "bg-green-800 border-green-700 text-white hover:bg-green-700 hover:border-green-600"
                    }`}
                  >
                    {category}
                    {category !== "All" && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {tradingBots.filter((bot) => bot.category === category).length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>

              {/* Auto-rotation Controls */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className="border-gray-700 text-gray-300 hover:border-primary/50 hover:text-primary"
                >
                  {isAutoRotating ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Auto-Rotation
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Resume Auto-Rotation
                    </>
                  )}
                </Button>
                <div className="text-sm text-gray-500">
                  Showing {currentIndex + 1} of {filteredBots.length} bots
                </div>
              </div>
            </motion.div>

            {/* Main Bot Display */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              {/* Bot Details */}
              <motion.div
                key={selectedBot.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${selectedBot.gradient} backdrop-blur-sm border border-gray-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <selectedBot.icon className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <div className="text-6xl font-mono font-bold text-gray-800 mb-2">{selectedBot.name}</div>
                    <Badge variant="outline" className="border-primary/50 text-primary">
                      {selectedBot.category}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-white mb-4 font-mono">{selectedBot.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed mb-6">{selectedBot.description}</p>

                  {/* Complexity Rating */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-sm text-gray-400">Complexity:</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < selectedBot.complexity ? "bg-primary" : "bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">{selectedBot.complexity}/5</span>
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Key Features:</h4>
                  <div className="space-y-2">
                    {selectedBot.features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Use Cases */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Use Cases:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBot.useCases.map((useCase) => (
                      <Badge key={useCase} variant="secondary" className="bg-gray-800 text-gray-300 hover:bg-gray-700">
                        {useCase}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Performance Metrics */}
              <motion.div
                key={`${selectedBot.id}-metrics`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Performance Metrics
                    </h4>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-1">{selectedBot.accuracy}%</div>
                        <div className="text-sm text-gray-400">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-1">{selectedBot.winRate}%</div>
                        <div className="text-sm text-gray-400">Win Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-1">
                          {selectedBot.trades.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">Total Trades</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-1">{selectedBot.avgReturn}%</div>
                        <div className="text-sm text-gray-400">Avg Return</div>
                      </div>
                    </div>

                    {/* Performance Chart */}
                    <div className="space-y-4">
                      <h5 className="text-sm font-semibold text-gray-300">Performance by Timeframe:</h5>
                      {Object.entries(selectedBot.performance).map(([period, value]) => (
                        <div key={period} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 capitalize">{period}</span>
                            <span className="text-primary font-semibold">{value}%</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-to-r from-primary to-green-400 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${value}%` }}
                              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-800">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          Timeframe: {selectedBot.timeframe}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <DollarSign className="w-4 h-4" />
                          Min Capital: $1,000
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full bg-primary text-black hover:bg-primary/90 font-semibold py-3" size="lg">
                  Deploy {selectedBot.name} Bot
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>

            {/* Bot Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {filteredBots.map((bot, index) => (
                <motion.div
                  key={bot.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className={`cursor-pointer group ${selectedBot.id === bot.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => handleBotSelect(bot)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`bg-gradient-to-br ${bot.gradient} backdrop-blur-sm border-gray-800 hover:border-primary/50 transition-all duration-300 hover:shadow-xl ${bot.glowColor} hover:shadow-xl`}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <bot.icon className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
                      </div>

                      <div className="text-4xl font-mono font-bold text-gray-700 mb-2 group-hover:text-primary transition-colors">
                        {bot.name}
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 font-mono line-clamp-2">{bot.title}</h3>

                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{bot.description}</p>

                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{bot.accuracy}% accuracy</span>
                        <Badge variant="outline" className="border-gray-600 text-gray-400">
                          {bot.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-mono">
                Ready to Deploy AI Trading Bots?
              </h2>
              <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of traders who trust Nexural's AI-powered bots for consistent, profitable trading across
                all market conditions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-black hover:bg-primary/90 font-semibold px-8">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:border-primary/50 hover:text-primary px-8 bg-transparent"
                >
                  View Pricing
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}
