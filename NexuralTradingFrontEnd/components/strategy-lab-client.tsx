"use client"

import { useState, useEffect } from "react"
import { Search, Database, TrendingUp, Brain, Shield, Zap, Lock } from "lucide-react"

interface Ingredient {
  id: string
  title: string
  category: string
  complexity: number
  desc: string
  tags: string[]
  icon: string
}

interface Strategy {
  id: string
  title: string
  desc: string
  category: string
  difficulty: number
  components: string[]
  metrics: { label: string; value: string }[]
  implementation: { title: string; desc: string }[]
  risks: string
  featured?: boolean
}

interface StrategyLabClientProps {
  ingredients?: Ingredient[]
  strategies?: Strategy[]
}

// Category-specific icon mapping with Lucide React icons
const getCategoryIcon = (category: string) => {
  const iconMap = {
    data: Database,
    analysis: TrendingUp,
    ml: Brain,
    risk: Shield,
    execution: Zap,
    advanced: Lock,
  }

  const IconComponent = iconMap[category as keyof typeof iconMap] || Database
  return <IconComponent className="w-8 h-8 text-primary" />
}

export default function StrategyLabClient({ ingredients = [], strategies = [] }: StrategyLabClientProps) {
  const [activeTab, setActiveTab] = useState("ingredients")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null)

  // --- Fix: suppress benign "ResizeObserver loop" browser error ---
  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      if (
        event.message === "ResizeObserver loop completed with undelivered notifications." ||
        event.message === "ResizeObserver loop limit exceeded"
      ) {
        event.stopImmediatePropagation()
      }
    }

    window.addEventListener("error", handler)
    return () => window.removeEventListener("error", handler)
  }, [])

  // Properly organized ingredients by category
  const mockIngredients: Ingredient[] = [
    // DATA CATEGORY - Database Icon
    {
      id: "1",
      title: "OHLCV Data",
      category: "data",
      complexity: 1,
      desc: "The foundation of technical analysis. Open, High, Low, Close, and Volume data forms the basis for most trading strategies and indicators.",
      tags: ["Price Action", "Historical Data", "Candlesticks"],
      icon: "database",
    },
    {
      id: "2",
      title: "Order Book Data",
      category: "data",
      complexity: 2,
      desc: "Real-time Level 2/3 market depth showing all buy and sell orders. Essential for market making and understanding true supply/demand dynamics.",
      tags: ["Market Depth", "Liquidity", "Microstructure"],
      icon: "database",
    },
    {
      id: "3",
      title: "Tick Data",
      category: "data",
      complexity: 3,
      desc: "Every individual trade and quote update. The most granular data available, used by HFT firms for microsecond-level analysis.",
      tags: ["High Frequency", "Time & Sales", "Raw Feed"],
      icon: "database",
    },
    {
      id: "4",
      title: "Alternative Data",
      category: "data",
      complexity: 3,
      desc: "Non-traditional data sources like satellite imagery, web scraping, credit card transactions, and social media sentiment for unique alpha generation.",
      tags: ["Satellite", "Web Data", "Sentiment"],
      icon: "database",
    },
    {
      id: "5",
      title: "Economic Data",
      category: "data",
      complexity: 2,
      desc: "Macroeconomic indicators, central bank data, employment statistics, and GDP figures that drive fundamental analysis and macro strategies.",
      tags: ["GDP", "Employment", "Central Bank"],
      icon: "database",
    },
    {
      id: "6",
      title: "News & Events Data",
      category: "data",
      complexity: 2,
      desc: "Real-time news feeds, earnings announcements, corporate actions, and economic events that create market-moving opportunities.",
      tags: ["Earnings", "News Feed", "Events"],
      icon: "database",
    },

    // ANALYSIS CATEGORY - TrendingUp Icon
    {
      id: "7",
      title: "Technical Indicators",
      category: "analysis",
      complexity: 1,
      desc: "Mathematical calculations on price and volume data. From simple moving averages to complex oscillators like RSI, MACD, and Bollinger Bands.",
      tags: ["Moving Averages", "Oscillators", "Momentum"],
      icon: "trending-up",
    },
    {
      id: "8",
      title: "Statistical Models",
      category: "analysis",
      complexity: 3,
      desc: "Advanced mathematical models including ARIMA, GARCH for volatility, cointegration tests, and regime-switching models for market analysis.",
      tags: ["Time Series", "Cointegration", "GARCH"],
      icon: "trending-up",
    },
    {
      id: "9",
      title: "Market Microstructure",
      category: "analysis",
      complexity: 3,
      desc: "Study of order flow, market impact, bid-ask spreads, and price discovery mechanisms. Critical for execution optimization.",
      tags: ["Order Flow", "Market Impact", "Spreads"],
      icon: "trending-up",
    },
    {
      id: "10",
      title: "Factor Models",
      category: "analysis",
      complexity: 2,
      desc: "Decompose returns into systematic factors like value, momentum, quality, and volatility. Foundation of smart beta and risk premia strategies.",
      tags: ["Fama-French", "Risk Factors", "Alpha"],
      icon: "trending-up",
    },
    {
      id: "11",
      title: "Correlation Analysis",
      category: "analysis",
      complexity: 2,
      desc: "Study relationships between assets, sectors, and markets. Essential for pairs trading, portfolio construction, and risk management.",
      tags: ["Pairs Trading", "Correlation", "Covariance"],
      icon: "trending-up",
    },
    {
      id: "12",
      title: "Volatility Models",
      category: "analysis",
      complexity: 3,
      desc: "Advanced volatility forecasting using GARCH, stochastic volatility, and realized volatility models for options and risk management.",
      tags: ["GARCH", "Realized Vol", "VIX"],
      icon: "trending-up",
    },

    // ML CATEGORY - Brain Icon
    {
      id: "13",
      title: "Supervised Learning",
      category: "ml",
      complexity: 2,
      desc: "Classification and regression models for price prediction. Includes Random Forests, XGBoost, and Support Vector Machines trained on labeled data.",
      tags: ["Random Forest", "XGBoost", "SVM"],
      icon: "brain",
    },
    {
      id: "14",
      title: "Deep Learning",
      category: "ml",
      complexity: 3,
      desc: "Neural networks including LSTMs for time series, CNNs for pattern recognition, and Transformers for market regime detection.",
      tags: ["LSTM", "Transformers", "Autoencoders"],
      icon: "brain",
    },
    {
      id: "15",
      title: "Reinforcement Learning",
      category: "ml",
      complexity: 3,
      desc: "Agents that learn optimal trading policies through interaction with markets. Uses Q-learning, DQN, and Policy Gradient methods.",
      tags: ["Q-Learning", "PPO", "Adaptive"],
      icon: "brain",
    },
    {
      id: "16",
      title: "NLP & Sentiment Analysis",
      category: "ml",
      complexity: 2,
      desc: "Natural language processing for news, social media, and earnings calls. Extracts market sentiment and trading signals from text data.",
      tags: ["BERT", "Sentiment", "News Analysis"],
      icon: "brain",
    },
    {
      id: "17",
      title: "Unsupervised Learning",
      category: "ml",
      complexity: 2,
      desc: "Clustering, dimensionality reduction, and anomaly detection. Discover hidden patterns and market regimes without labeled data.",
      tags: ["K-Means", "PCA", "Anomaly Detection"],
      icon: "brain",
    },
    {
      id: "18",
      title: "Ensemble Methods",
      category: "ml",
      complexity: 2,
      desc: "Combine multiple models for better predictions. Includes bagging, boosting, and stacking techniques for robust alpha generation.",
      tags: ["Bagging", "Boosting", "Stacking"],
      icon: "brain",
    },

    // RISK CATEGORY - Shield Icon
    {
      id: "19",
      title: "Position Sizing",
      category: "risk",
      complexity: 2,
      desc: "Optimal capital allocation using Kelly Criterion, fixed fractional, or volatility-based methods to maximize returns while controlling risk.",
      tags: ["Kelly Criterion", "Risk Parity", "Volatility Sizing"],
      icon: "shield",
    },
    {
      id: "20",
      title: "Portfolio Optimization",
      category: "risk",
      complexity: 3,
      desc: "Modern portfolio theory, mean-variance optimization, Black-Litterman models, and risk budgeting for multi-asset allocation.",
      tags: ["Markowitz", "Black-Litterman", "Efficient Frontier"],
      icon: "shield",
    },
    {
      id: "21",
      title: "Risk Metrics",
      category: "risk",
      complexity: 1,
      desc: "VaR, CVaR, Sharpe ratio, maximum drawdown, and other metrics to measure and monitor portfolio risk in real-time.",
      tags: ["Value at Risk", "Sharpe Ratio", "Drawdown"],
      icon: "shield",
    },
    {
      id: "22",
      title: "Hedging Strategies",
      category: "risk",
      complexity: 3,
      desc: "Dynamic hedging, options overlays, tail risk protection, and correlation hedges to protect portfolios during market stress.",
      tags: ["Options Hedging", "Tail Risk", "Delta Neutral"],
      icon: "shield",
    },
    {
      id: "23",
      title: "Stress Testing",
      category: "risk",
      complexity: 2,
      desc: "Monte Carlo simulations, historical scenarios, and extreme value theory to test portfolio resilience under adverse conditions.",
      tags: ["Monte Carlo", "Scenarios", "Extreme Value"],
      icon: "shield",
    },
    {
      id: "24",
      title: "Credit Risk Models",
      category: "risk",
      complexity: 3,
      desc: "Assess counterparty risk, default probabilities, and credit spreads using structural and reduced-form models.",
      tags: ["Default Risk", "Credit Spreads", "Merton Model"],
      icon: "shield",
    },

    // EXECUTION CATEGORY - Zap Icon
    {
      id: "25",
      title: "Execution Algorithms",
      category: "execution",
      complexity: 2,
      desc: "TWAP, VWAP, Implementation Shortfall, and other algorithms to minimize market impact and achieve best execution.",
      tags: ["TWAP", "VWAP", "Iceberg"],
      icon: "zap",
    },
    {
      id: "26",
      title: "Smart Order Routing",
      category: "execution",
      complexity: 3,
      desc: "Intelligent routing across multiple venues, dark pools, and exchanges to find best prices and hidden liquidity.",
      tags: ["Multi-Venue", "Dark Pools", "Best Execution"],
      icon: "zap",
    },
    {
      id: "27",
      title: "Latency Optimization",
      category: "execution",
      complexity: 3,
      desc: "Co-location, network optimization, FPGA acceleration, and kernel bypass for microsecond-level execution speed.",
      tags: ["Co-location", "FPGA", "Low Latency"],
      icon: "zap",
    },
    {
      id: "28",
      title: "Trading Infrastructure",
      category: "execution",
      complexity: 2,
      desc: "FIX connectivity, API integration, message queues, and databases optimized for high-throughput trading systems.",
      tags: ["FIX Protocol", "REST/WebSocket", "Message Queues"],
      icon: "zap",
    },
    {
      id: "29",
      title: "Market Making",
      category: "execution",
      complexity: 3,
      desc: "Provide liquidity by continuously quoting bid-ask spreads. Includes inventory management and adverse selection protection.",
      tags: ["Bid-Ask", "Inventory", "Adverse Selection"],
      icon: "zap",
    },
    {
      id: "30",
      title: "Order Management Systems",
      category: "execution",
      complexity: 2,
      desc: "Sophisticated order handling, partial fills, order modification, and execution reporting for institutional trading.",
      tags: ["OMS", "Partial Fills", "Execution Reports"],
      icon: "zap",
    },

    // ADVANCED CATEGORY - Lock Icon
    {
      id: "31",
      title: "Kalman Filters",
      category: "advanced",
      complexity: 3,
      desc: "Dynamic state estimation for hedge ratios, signal extraction from noisy data, and adaptive parameter updating in real-time.",
      tags: ["State Estimation", "Noise Filtering", "Adaptive"],
      icon: "lock",
    },
    {
      id: "32",
      title: "Hidden Markov Models",
      category: "advanced",
      complexity: 3,
      desc: "Regime detection and switching models to identify market states and adapt strategies to changing conditions automatically.",
      tags: ["Regime Detection", "State Switching", "Baum-Welch"],
      icon: "lock",
    },
    {
      id: "33",
      title: "Stochastic Calculus",
      category: "advanced",
      complexity: 3,
      desc: "Mathematical framework for derivative pricing and continuous-time finance. Includes Ito's lemma, SDEs, and martingale theory.",
      tags: ["Ito Calculus", "SDEs", "Martingales"],
      icon: "lock",
    },
    {
      id: "34",
      title: "Quantum Computing",
      category: "advanced",
      complexity: 3,
      desc: "Quantum algorithms for portfolio optimization, option pricing, and risk analysis. Leverages superposition and entanglement.",
      tags: ["QAOA", "VQE", "Quantum Annealing"],
      icon: "lock",
    },
    {
      id: "35",
      title: "Fractional Calculus",
      category: "advanced",
      complexity: 3,
      desc: "Non-integer derivatives and integrals for modeling long-memory processes and anomalous diffusion in financial markets.",
      tags: ["Long Memory", "Fractional Brownian", "Hurst Exponent"],
      icon: "lock",
    },
    {
      id: "36",
      title: "Information Theory",
      category: "advanced",
      complexity: 3,
      desc: "Entropy, mutual information, and transfer entropy to measure information flow and dependencies in financial time series.",
      tags: ["Entropy", "Mutual Information", "Transfer Entropy"],
      icon: "lock",
    },
  ]

  const mockStrategies: Strategy[] = [
    {
      id: "1",
      title: "Mean Reversion Strategy",
      desc: "Statistical arbitrage strategy that profits from temporary price deviations from historical means.",
      category: "Statistical Arbitrage",
      difficulty: 3,
      components: ["Z-Score", "Bollinger Bands", "Position Sizing"],
      metrics: [
        { label: "Returns", value: "18.5%" },
        { label: "Sharpe", value: "2.1" },
        { label: "Max DD", value: "-8.2%" },
        { label: "Win Rate", value: "67%" },
      ],
      implementation: [
        { title: "Data Collection", desc: "Gather historical price data for target assets" },
        { title: "Statistical Analysis", desc: "Calculate rolling means and standard deviations" },
        { title: "Signal Generation", desc: "Identify mean reversion opportunities" },
      ],
      risks: "Strategy may fail during trending markets or structural breaks in mean reversion patterns.",
      featured: true,
    },
  ]

  const ingredientsData = ingredients.length > 0 ? ingredients : mockIngredients
  const strategiesData = strategies.length > 0 ? strategies : mockStrategies

  const filteredIngredients = ingredientsData.filter((ingredient) => {
    const matchesCategory = selectedCategory === "all" || ingredient.category === selectedCategory
    const matchesSearch =
      !searchTerm ||
      ingredient.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  const filteredStrategies = strategiesData.filter((strategy) => {
    const matchesSearch =
      !searchTerm ||
      strategy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.desc.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const categories = ["all", "data", "analysis", "ml", "risk", "execution", "advanced"]

  const getCategoryColor = (category: string) => {
    const colors = {
      data: "#00d4ff",
      analysis: "#ff9f40",
      ml: "#9370db",
      risk: "#ff5088",
      execution: "#50ff88",
      advanced: "#ffd700",
    }
    return colors[category as keyof typeof colors] || "#50ff88"
  }

  const getCategoryCount = (category: string) => {
    if (category === "all") return ingredientsData.length
    return ingredientsData.filter((ingredient) => ingredient.category === category).length
  }

  const renderComplexityDots = (complexity: number) => {
    return (
      <div className="flex gap-1 mb-4">
        {[1, 2, 3].map((dot) => (
          <span key={dot} className={`w-2 h-2 rounded-full ${dot <= complexity ? "bg-primary" : "bg-white/20"}`} />
        ))}
      </div>
    )
  }

  const switchTab = (tabName: string) => {
    setActiveTab(tabName)
  }

  const filterIngredients = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Grid Background */}
      <div
        className="fixed inset-0 opacity-50 pointer-events-none z-[-2]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(80, 255, 88, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(80, 255, 88, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          animation: "grid-move 20s linear infinite",
        }}
      />

      {/* Glow Orbs */}
      <div
        className="fixed w-[600px] h-[600px] bg-primary rounded-full filter blur-[120px] opacity-30 pointer-events-none z-[-1]"
        style={{
          top: "-300px",
          right: "-300px",
          animation: "float 20s ease-in-out infinite",
        }}
      />
      <div
        className="fixed w-[400px] h-[400px] bg-blue-500 rounded-full filter blur-[120px] opacity-30 pointer-events-none z-[-1]"
        style={{
          bottom: "-200px",
          left: "-200px",
          animation: "float 20s ease-in-out infinite reverse",
        }}
      />
      <div
        className="fixed w-[500px] h-[500px] bg-purple-500 rounded-full filter blur-[120px] opacity-20 pointer-events-none z-[-1]"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "pulse-glow 15s ease-in-out infinite",
        }}
      />

      <div className="max-w-7xl mx-auto px-8 py-8 relative">
        {/* Header */}
        <div className="text-center mb-16 pt-8">
          <div className="inline-block py-2 px-4 bg-primary/10 border border-primary rounded-full text-sm text-primary mb-4 uppercase tracking-widest">
            Professional Trading Education
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-wider mb-4 bg-gradient-to-b from-primary to-white bg-clip-text text-transparent">
            Strategy Lab
          </h1>
          <p className="text-lg text-white/70 font-light max-w-4xl mx-auto">
            The definitive encyclopedia of quantitative trading. Master 100+ professional techniques, explore
            institutional-grade strategies, and discover the exact methods used by the world's most successful
            algorithmic trading firms.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-8 mb-16 border-b border-primary/20 pb-4">
          <button
            className={`py-3 px-8 font-semibold uppercase tracking-wider relative transition-colors text-base ${
              activeTab === "ingredients" ? "text-primary" : "text-white/70"
            }`}
            onClick={() => switchTab("ingredients")}
          >
            <span
              className={`relative ${
                activeTab === "ingredients"
                  ? "after:content-[''] after:absolute after:bottom-[-1.2rem] after:left-0 after:w-full after:h-1 after:bg-primary after:scale-x-100"
                  : ""
              }`}
            >
              📦 Strategy Ingredients
            </span>
          </button>
          <button
            className={`py-3 px-8 font-semibold uppercase tracking-wider relative transition-colors text-base ${
              activeTab === "strategies" ? "text-primary" : "text-white/70"
            }`}
            onClick={() => switchTab("strategies")}
          >
            <span
              className={`relative ${
                activeTab === "strategies"
                  ? "after:content-[''] after:absolute after:bottom-[-1.2rem] after:left-0 after:w-full after:h-1 after:bg-primary after:scale-x-100"
                  : ""
              }`}
            >
              🎯 Complete Strategies
            </span>
          </button>
        </div>

        {/* Ingredients Tab */}
        {activeTab === "ingredients" && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold mb-4 uppercase bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Quantitative Trading Ingredients
              </h2>
              <p className="text-base text-white/70 max-w-4xl mx-auto">
                Deep dive into the building blocks of algorithmic trading. Each ingredient represents a crucial
                technique, tool, or concept used by professional quants to build robust trading systems. From basic
                price data to advanced machine learning, master the complete toolkit.
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-center">
              <div className="relative flex-grow max-w-lg w-full">
                <input
                  type="text"
                  placeholder="Search ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-4 pl-6 pr-12 bg-white/5 border border-primary/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-primary" />
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => filterIngredients(category)}
                    className={`py-2 px-5 border border-primary/20 rounded-full font-semibold uppercase text-xs tracking-wider transition-all hover:border-primary hover:text-primary hover:-translate-y-0.5 relative ${
                      selectedCategory === category
                        ? "bg-primary text-black border-primary shadow-lg shadow-primary/30"
                        : "text-white/70"
                    }`}
                  >
                    {category === "all" ? "ALL" : category.toUpperCase()}
                    <span className="ml-2 text-xs opacity-70">({getCategoryCount(category)})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Summary */}
            {selectedCategory !== "all" && (
              <div className="mb-8 p-6 bg-white/5 border border-primary/20 rounded-xl">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-primary/10 border-2 border-primary rounded-xl flex items-center justify-center">
                    {getCategoryIcon(selectedCategory)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary uppercase">{selectedCategory}</h3>
                    <p className="text-white/70">{getCategoryCount(selectedCategory)} ingredients in this category</p>
                  </div>
                </div>
              </div>
            )}

            {/* Ingredients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {filteredIngredients.map((ingredient) => {
                const categoryColor = getCategoryColor(ingredient.category)
                return (
                  <div
                    key={ingredient.id}
                    className="bg-white/5 border border-primary/20 rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 cursor-pointer relative overflow-hidden group h-[280px] flex flex-col"
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Header with Icon and Category */}
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="w-14 h-14 bg-primary/10 border-2 border-primary rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                        {getCategoryIcon(ingredient.category)}
                      </div>
                      <span
                        className="py-1.5 px-3 border rounded-full text-xs uppercase tracking-wider font-semibold"
                        style={{
                          backgroundColor: `${categoryColor}15`,
                          borderColor: `${categoryColor}50`,
                          color: categoryColor,
                        }}
                      >
                        {ingredient.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-2 relative z-10 leading-tight">
                      {ingredient.title}
                    </h3>

                    {/* Complexity Dots */}
                    {renderComplexityDots(ingredient.complexity)}

                    {/* Description */}
                    <p className="text-white/70 text-sm leading-relaxed mb-4 relative z-10 flex-grow line-clamp-3">
                      {ingredient.desc}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 relative z-10 mt-auto">
                      {ingredient.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="py-1 px-2 bg-white/5 border border-white/20 rounded text-xs text-white/60 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* No Results Message */}
            {filteredIngredients.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white/70 mb-2">No ingredients found</h3>
                <p className="text-white/50">Try adjusting your search or filter criteria</p>
              </div>
            )}

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 my-16 py-12 px-8 bg-white/5 border border-primary/20 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

              <div className="text-center relative z-10">
                <div className="text-5xl font-black text-primary">{ingredientsData.length}+</div>
                <div className="text-lg text-white/70 uppercase tracking-wider">Techniques</div>
              </div>
              <div className="text-center relative z-10">
                <div className="text-5xl font-black text-primary">6</div>
                <div className="text-lg text-white/70 uppercase tracking-wider">Categories</div>
              </div>
              <div className="text-center relative z-10">
                <div className="text-5xl font-black text-primary">
                  {ingredientsData.filter((i) => i.complexity === 3).length}+
                </div>
                <div className="text-lg text-white/70 uppercase tracking-wider">Advanced</div>
              </div>
              <div className="text-center relative z-10">
                <div className="text-5xl font-black text-primary">∞</div>
                <div className="text-lg text-white/70 uppercase tracking-wider">Combinations</div>
              </div>
            </div>
          </div>
        )}

        {/* Strategies Tab */}
        {activeTab === "strategies" && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold mb-4 uppercase bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Professional Trading Strategies
              </h2>
              <p className="text-base text-white/70 max-w-4xl mx-auto">
                Explore complete quantitative strategies used by hedge funds, proprietary trading firms, and
                institutional investors. Each strategy includes detailed implementation steps, risk considerations, and
                real-world performance metrics.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex justify-center mb-12">
              <div className="relative max-w-lg w-full">
                <input
                  type="text"
                  placeholder="Search strategies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-4 pl-6 pr-12 bg-white/5 border border-primary/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-primary" />
              </div>
            </div>

            {/* Strategies Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredStrategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className="bg-white/5 border border-primary/20 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-2xl hover:shadow-primary/30 cursor-pointer relative"
                  onClick={() => setExpandedStrategy(expandedStrategy === strategy.id ? null : strategy.id)}
                >
                  {strategy.featured && (
                    <div className="absolute top-4 right-4 py-1 px-3 bg-yellow-500 text-black rounded-full text-xs font-bold uppercase tracking-wider z-10">
                      Popular
                    </div>
                  )}

                  <div className="bg-primary/5 p-8 border-b border-primary/20">
                    <div className="text-sm text-primary uppercase font-semibold tracking-wider mb-2">
                      {strategy.category}
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{strategy.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <span>Difficulty:</span>
                      <div className="flex text-yellow-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={strategy.difficulty >= star ? "★" : "☆"}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <p className="text-white/70 mb-6">{strategy.desc}</p>
                    <div className="mb-6">
                      <div className="text-xs text-white/50 uppercase tracking-wider mb-3">Key Ingredients</div>
                      <div className="flex flex-wrap gap-2">
                        {strategy.components.map((comp) => (
                          <span
                            key={comp}
                            className="py-1 px-3 bg-primary/10 border border-primary/30 rounded-full text-sm text-primary"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-black/30 border-t border-primary/20">
                    {strategy.metrics.map((metric) => (
                      <div key={metric.label} className="text-center">
                        <div className="text-2xl font-bold text-primary">{metric.value}</div>
                        <div className="text-xs text-white/50 uppercase tracking-wider">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  {expandedStrategy === strategy.id && (
                    <div className="p-8 bg-black/50 border-t border-primary/20 animate-fade-in">
                      <h4 className="text-xl font-bold text-white mb-4">Implementation Steps</h4>
                      <div className="space-y-4 mb-6">
                        {strategy.implementation.map((step, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 bg-white/5 border border-primary/20 rounded-lg"
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-primary text-black rounded-full flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-semibold text-white">{step.title}</div>
                              <p className="text-sm text-white/70">{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                        <div className="font-bold text-red-500 mb-1">⚠️ Key Risks</div>
                        <p className="text-sm text-white/80">{strategy.risks}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-primary/10 to-blue-500/10 border-2 border-primary/30 rounded-2xl p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(80,255,88,0.1)_0%,transparent_70%)] animate-pulse" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 uppercase bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Ready to Build Your Edge?
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto mb-8">
              The Strategy Lab is just the beginning. Join Nexural to access our full suite of institutional-grade
              tools, backtesting engines, and live trading infrastructure.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
              {[
                { icon: "💻", text: "Code Exporter" },
                { icon: "📊", text: "Backtesting Engine" },
                { icon: "⚙️", text: "Parameter Tuning" },
                { icon: "📈", text: "Live Deployment" },
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-primary/10 border-2 border-primary rounded-xl flex items-center justify-center text-2xl transition-all hover:scale-110 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/40">
                    {feature.icon}
                  </div>
                  <span className="font-semibold text-white/80">{feature.text}</span>
                </div>
              ))}
            </div>
            <button className="py-4 px-10 bg-primary text-black rounded-lg font-bold text-lg uppercase tracking-widest transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/50">
              Join Nexural Now
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-50px, 50px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.3; transform: translate(-50%, -50%) scale(1.1); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
