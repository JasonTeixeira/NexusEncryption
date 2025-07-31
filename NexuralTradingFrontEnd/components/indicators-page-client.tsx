"use client"

import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import {
  TrendingUp,
  BarChart3,
  Activity,
  Zap,
  Brain,
  Target,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Eye,
  BookOpen,
  LineChart,
  Gauge,
  Waves,
  Layers,
  Users,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function IndicatorsPageClient() {
  const [selectedIndicator, setSelectedIndicator] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const indicators = [
    {
      id: 1,
      name: "Quantum Flow",
      category: "momentum",
      description: "Advanced momentum indicator that identifies trend strength using volume-weighted price movements",
      longDescription:
        "The Quantum Flow indicator revolutionizes momentum analysis by combining traditional price action with sophisticated volume analysis. It filters out market noise to reveal the true underlying trend strength, providing traders with unprecedented clarity in volatile markets.",
      accuracy: 94,
      signals: "1,247",
      timeframe: "1m - 1D",
      complexity: 3,
      icon: Waves,
      color: "from-blue-500 to-cyan-400",
      features: [
        "Volume-weighted momentum calculation",
        "Noise filtration algorithms",
        "Multi-timeframe analysis",
        "Real-time signal generation",
        "Divergence detection",
        "Trend strength scoring",
      ],
      useCases: ["Trend confirmation", "Entry/exit timing", "Momentum shifts", "Market regime detection"],
      chartData: [65, 78, 82, 75, 88, 92, 85, 90, 87, 94, 89, 96],
    },
    {
      id: 2,
      name: "Nexural Oscillator",
      category: "oscillator",
      description: "Proprietary oscillator measuring overbought/oversold conditions with adaptive parameters",
      longDescription:
        "Our flagship oscillator adapts to changing market conditions automatically, providing more accurate overbought and oversold signals than traditional RSI. It incorporates machine learning to optimize parameters in real-time.",
      accuracy: 91,
      signals: "2,156",
      timeframe: "5m - 4H",
      complexity: 2,
      icon: Activity,
      color: "from-green-500 to-emerald-400",
      features: [
        "Adaptive parameter optimization",
        "Machine learning integration",
        "Dynamic overbought/oversold levels",
        "Momentum divergence alerts",
        "Multi-asset compatibility",
        "Custom alert thresholds",
      ],
      useCases: [
        "Reversal identification",
        "Overbought/oversold detection",
        "Swing trading signals",
        "Risk management",
      ],
      chartData: [45, 52, 68, 75, 82, 78, 65, 58, 72, 85, 79, 73],
    },
    {
      id: 3,
      name: "Phase Reversal",
      category: "reversal",
      description: "Detects market turning points by analyzing price cycle phases with high precision",
      longDescription:
        "Phase Reversal uses advanced mathematical models to identify market cycles and predict turning points. It analyzes multiple price cycles simultaneously to provide early warning signals for major market reversals.",
      accuracy: 89,
      signals: "892",
      timeframe: "15m - 1D",
      complexity: 4,
      icon: RotateCcw,
      color: "from-purple-500 to-pink-400",
      features: [
        "Multi-cycle analysis",
        "Phase relationship mapping",
        "Turning point prediction",
        "Cycle strength measurement",
        "Harmonic pattern recognition",
        "Time-based projections",
      ],
      useCases: ["Market timing", "Reversal trading", "Cycle analysis", "Long-term positioning"],
      chartData: [30, 45, 65, 80, 75, 60, 40, 25, 35, 55, 70, 85],
    },
    {
      id: 4,
      name: "Volatility Matrix",
      category: "volatility",
      description: "Multi-dimensional volatility analysis across timeframes for strategic positioning",
      longDescription:
        "The Volatility Matrix provides a comprehensive view of market volatility across multiple dimensions and timeframes. It helps traders identify optimal entry points and adjust position sizing based on current market conditions.",
      accuracy: 87,
      signals: "1,543",
      timeframe: "1m - 1W",
      complexity: 3,
      icon: Layers,
      color: "from-orange-500 to-red-400",
      features: [
        "Multi-timeframe volatility tracking",
        "Regime change detection",
        "Volatility clustering analysis",
        "Risk-adjusted signals",
        "Position sizing recommendations",
        "Market stress indicators",
      ],
      useCases: ["Risk management", "Position sizing", "Market timing", "Volatility trading"],
      chartData: [20, 35, 55, 70, 85, 90, 75, 60, 45, 30, 40, 65],
    },
    {
      id: 5,
      name: "Echo Bands",
      category: "support_resistance",
      description: "Dynamic support and resistance levels that adapt to market conditions in real-time",
      longDescription:
        "Echo Bands create intelligent support and resistance levels that evolve with market structure. Unlike static levels, these bands adjust their sensitivity and positioning based on current volatility and trend strength.",
      accuracy: 92,
      signals: "1,789",
      timeframe: "5m - 1D",
      complexity: 2,
      icon: Gauge,
      color: "from-teal-500 to-blue-400",
      features: [
        "Adaptive band calculation",
        "Dynamic sensitivity adjustment",
        "Breakout confirmation",
        "Support/resistance strength",
        "Price target projection",
        "Band squeeze detection",
      ],
      useCases: ["Support/resistance trading", "Breakout strategies", "Range trading", "Price targeting"],
      chartData: [50, 55, 60, 58, 65, 70, 68, 72, 75, 73, 78, 80],
    },
    {
      id: 6,
      name: "Cognitive Trend",
      category: "trend",
      description: "AI-powered trend identification that filters noise and reveals true market direction",
      longDescription:
        "Cognitive Trend employs artificial intelligence to distinguish between genuine trends and market noise. It provides clear directional bias while filtering out false signals that plague traditional trend indicators.",
      accuracy: 96,
      signals: "987",
      timeframe: "1H - 1W",
      complexity: 4,
      icon: Brain,
      color: "from-indigo-500 to-purple-400",
      features: [
        "AI-powered trend detection",
        "Noise filtration algorithms",
        "Trend strength classification",
        "Direction change alerts",
        "Confidence scoring",
        "Multi-asset correlation",
      ],
      useCases: ["Trend following", "Direction confirmation", "Long-term positioning", "Portfolio allocation"],
      chartData: [40, 50, 65, 75, 80, 85, 88, 90, 92, 94, 95, 96],
    },
  ]

  const categories = [
    { id: "all", name: "All Indicators", icon: Target, count: indicators.length },
    {
      id: "momentum",
      name: "Momentum",
      icon: TrendingUp,
      count: indicators.filter((i) => i.category === "momentum").length,
    },
    {
      id: "oscillator",
      name: "Oscillators",
      icon: Activity,
      count: indicators.filter((i) => i.category === "oscillator").length,
    },
    { id: "trend", name: "Trend", icon: LineChart, count: indicators.filter((i) => i.category === "trend").length },
    {
      id: "volatility",
      name: "Volatility",
      icon: BarChart3,
      count: indicators.filter((i) => i.category === "volatility").length,
    },
    {
      id: "reversal",
      name: "Reversal",
      icon: RotateCcw,
      count: indicators.filter((i) => i.category === "reversal").length,
    },
    {
      id: "support_resistance",
      name: "S/R",
      icon: Layers,
      count: indicators.filter((i) => i.category === "support_resistance").length,
    },
  ]

  const stats = [
    { icon: Target, value: "94%", label: "Avg Accuracy", color: "text-primary" },
    { icon: Zap, value: "8,614", label: "Total Signals", color: "text-blue-400" },
    { icon: Users, value: "12k+", label: "Active Users", color: "text-green-400" },
    { icon: Clock, value: "24/7", label: "Monitoring", color: "text-yellow-400" },
  ]

  const filteredIndicators =
    activeCategory === "all" ? indicators : indicators.filter((indicator) => indicator.category === activeCategory)

  // Auto-rotate through indicators
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setSelectedIndicator((prev) => (prev + 1) % filteredIndicators.length)
      }, 4000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, filteredIndicators.length])

  const currentIndicator = filteredIndicators[selectedIndicator] || indicators[0]

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-blue-500/3" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: 9999,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/15 to-emerald-500/15 border border-primary/30 rounded-full px-6 py-3 mb-8 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary font-mono text-sm font-semibold tracking-wider">
                PROFESSIONAL TRADING INDICATORS
              </span>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-bold text-white mb-8 font-mono leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Proprietary{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                Indicators
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Advanced quantitative indicators designed for professional traders. Powered by AI, tested by
              professionals, trusted by institutions worldwide.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center group cursor-pointer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon
                    className={`w-8 h-8 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform`}
                  />
                  <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-300 font-mono font-semibold ${
                  activeCategory === category.id
                    ? "bg-primary text-black border-primary shadow-lg shadow-primary/25"
                    : "bg-gray-900/50 text-gray-300 border-gray-700 hover:border-primary/50 hover:text-primary"
                }`}
                onClick={() => {
                  setActiveCategory(category.id)
                  setSelectedIndicator(0)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.name}</span>
                <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                  {category.count}
                </Badge>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Indicator Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Indicator Details */}
            <motion.div
              className="space-y-8"
              key={currentIndicator.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  className={`p-4 rounded-xl bg-gradient-to-br ${currentIndicator.color} shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <currentIndicator.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-4xl font-bold text-white font-mono mb-2">{currentIndicator.name}</h2>
                  <p className="text-gray-400 text-lg">{currentIndicator.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{currentIndicator.accuracy}%</div>
                  <div className="text-gray-400 text-sm">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">{currentIndicator.signals}</div>
                  <div className="text-gray-400 text-sm">Signals</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">{currentIndicator.timeframe}</div>
                  <div className="text-gray-400 text-sm">Timeframe</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Key Features</h3>
                <div className="grid grid-cols-1 gap-3">
                  {currentIndicator.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-800"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-black font-bold px-8 py-3">
                  <Eye className="w-5 h-5 mr-2" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:border-primary hover:text-primary px-8 py-3 bg-transparent"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Documentation
                </Button>
              </div>
            </motion.div>

            {/* Interactive Chart */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-gray-700 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Live Performance</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:border-primary hover:text-primary bg-transparent"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:border-primary hover:text-primary bg-transparent"
                      onClick={() => setSelectedIndicator(0)}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Simulated Chart */}
                <div className="relative h-64 bg-gray-900/50 rounded-lg p-4 mb-6">
                  <div className="flex items-end justify-between h-full">
                    {currentIndicator.chartData.map((value, index) => (
                      <motion.div
                        key={index}
                        className={`bg-gradient-to-t ${currentIndicator.color} rounded-t opacity-80`}
                        style={{ height: `${value}%`, width: "6%" }}
                        initial={{ height: 0 }}
                        animate={{ height: `${value}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Accuracy Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Signal Accuracy</span>
                    <span className="text-primary font-semibold">{currentIndicator.accuracy}%</span>
                  </div>
                  <Progress value={currentIndicator.accuracy} className="h-2" />
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Indicator Grid */}
      <section className="py-20 bg-gray-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-mono">
              Complete Indicator <span className="text-primary">Suite</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Explore our full collection of professional trading indicators, each designed for specific market
              conditions and trading strategies.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredIndicators.map((indicator, index) => (
              <motion.div
                key={indicator.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setSelectedIndicator(index)}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card
                  className={`h-full bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-2 transition-all duration-500 ${
                    selectedIndicator === index
                      ? "border-primary shadow-xl shadow-primary/20"
                      : "border-gray-700 hover:border-primary/50"
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        className={`p-3 rounded-lg bg-gradient-to-br ${indicator.color} shadow-lg`}
                        animate={hoveredCard === index ? { rotate: [0, 5, -5, 0] } : {}}
                        transition={{ duration: 0.6 }}
                      >
                        <indicator.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="flex items-center gap-1">
                        {[...Array(indicator.complexity)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-primary rounded-full" />
                        ))}
                        {[...Array(5 - indicator.complexity)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-gray-600 rounded-full" />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-white mb-2">{indicator.name}</CardTitle>
                    <CardDescription className="text-gray-400 leading-relaxed">{indicator.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">{indicator.accuracy}%</div>
                        <div className="text-gray-500 text-xs">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-1">{indicator.signals}</div>
                        <div className="text-gray-500 text-xs">Signals</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-white">Use Cases</h4>
                      <div className="flex flex-wrap gap-2">
                        {indicator.useCases.slice(0, 3).map((useCase, i) => (
                          <Badge key={i} variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                            {useCase}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6 bg-gradient-to-r from-primary/20 to-emerald-500/20 border border-primary/30 text-primary hover:bg-primary hover:text-black transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedIndicator(index)
                      }}
                    >
                      Explore Indicator
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
              Ready to <span className="text-primary">Elevate</span> Your Trading?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of professional traders using our proprietary indicators to gain a competitive edge in the
              markets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary hover:bg-primary/90 text-black font-bold px-8 py-4 text-lg">
                <Zap className="w-5 h-5 mr-2" />
                Get Started Today
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:border-primary hover:text-primary px-8 py-4 text-lg bg-transparent"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
