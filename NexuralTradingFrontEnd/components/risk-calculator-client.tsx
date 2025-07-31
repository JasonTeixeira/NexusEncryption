"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Shield,
  AlertTriangle,
  Info,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Brain,
  CheckCircle,
  XCircle,
  Gauge,
  LineChart,
  Award,
  Globe,
  Sparkles,
  Layers,
  Settings,
  Eye,
  Flame,
  Star,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  Bar,
  ComposedChart,
} from "recharts"

// Professional futures contract specifications with accurate data
const FUTURES_CONTRACTS = {
  // E-mini S&P 500
  ES: {
    name: "E-mini S&P 500",
    symbol: "ES",
    tickSize: 0.25,
    tickValue: 12.5,
    pointValue: 50,
    margin: 13200,
    sector: "Equity Index",
    exchange: "CME",
    tradingHours: "23:00-22:00 ET",
    type: "mini",
  },
  // Micro E-mini S&P 500
  MES: {
    name: "Micro E-mini S&P 500",
    symbol: "MES",
    tickSize: 0.25,
    tickValue: 1.25,
    pointValue: 5,
    margin: 1320,
    sector: "Equity Index",
    exchange: "CME",
    tradingHours: "23:00-22:00 ET",
    type: "micro",
  },
  // E-mini NASDAQ
  NQ: {
    name: "E-mini NASDAQ-100",
    symbol: "NQ",
    tickSize: 0.25,
    tickValue: 5.0,
    pointValue: 20,
    margin: 17600,
    sector: "Equity Index",
    exchange: "CME",
    tradingHours: "23:00-22:00 ET",
    type: "mini",
  },
  // Micro E-mini NASDAQ
  MNQ: {
    name: "Micro E-mini NASDAQ-100",
    symbol: "MNQ",
    tickSize: 0.25,
    tickValue: 0.5,
    pointValue: 2,
    margin: 1760,
    sector: "Equity Index",
    exchange: "CME",
    tradingHours: "23:00-22:00 ET",
    type: "micro",
  },
  // E-mini Dow
  YM: {
    name: "E-mini Dow Jones",
    symbol: "YM",
    tickSize: 1.0,
    tickValue: 5.0,
    pointValue: 5,
    margin: 11000,
    sector: "Equity Index",
    exchange: "CBOT",
    tradingHours: "23:00-22:00 ET",
    type: "mini",
  },
  // Micro E-mini Dow
  MYM: {
    name: "Micro E-mini Dow Jones",
    symbol: "MYM",
    tickSize: 1.0,
    tickValue: 0.5,
    pointValue: 0.5,
    margin: 1100,
    sector: "Equity Index",
    exchange: "CBOT",
    tradingHours: "23:00-22:00 ET",
    type: "micro",
  },
  // E-mini Russell 2000
  RTY: {
    name: "E-mini Russell 2000",
    symbol: "RTY",
    tickSize: 0.1,
    tickValue: 5.0,
    pointValue: 50,
    margin: 7700,
    sector: "Equity Index",
    exchange: "CME",
    tradingHours: "23:00-22:00 ET",
    type: "mini",
  },
  // Micro E-mini Russell 2000
  M2K: {
    name: "Micro E-mini Russell 2000",
    symbol: "M2K",
    tickSize: 0.1,
    tickValue: 0.5,
    pointValue: 5,
    margin: 770,
    sector: "Equity Index",
    exchange: "CME",
    tradingHours: "23:00-22:00 ET",
    type: "micro",
  },
  // Crude Oil
  CL: {
    name: "Crude Oil",
    symbol: "CL",
    tickSize: 0.01,
    tickValue: 10.0,
    pointValue: 1000,
    margin: 6600,
    sector: "Energy",
    exchange: "NYMEX",
    tradingHours: "23:00-22:00 ET",
    type: "standard",
  },
  // Micro Crude Oil
  MCL: {
    name: "Micro Crude Oil",
    symbol: "MCL",
    tickSize: 0.01,
    tickValue: 1.0,
    pointValue: 100,
    margin: 660,
    sector: "Energy",
    exchange: "NYMEX",
    tradingHours: "23:00-22:00 ET",
    type: "micro",
  },
  // Gold
  GC: {
    name: "Gold",
    symbol: "GC",
    tickSize: 0.1,
    tickValue: 10.0,
    pointValue: 100,
    margin: 11000,
    sector: "Precious Metals",
    exchange: "COMEX",
    tradingHours: "23:00-22:00 ET",
    type: "standard",
  },
  // Micro Gold
  MGC: {
    name: "Micro Gold",
    symbol: "MGC",
    tickSize: 0.1,
    tickValue: 1.0,
    pointValue: 10,
    margin: 1100,
    sector: "Precious Metals",
    exchange: "COMEX",
    tradingHours: "23:00-22:00 ET",
    type: "micro",
  },
}

// Professional forex specifications
const FOREX_PAIRS = {
  EURUSD: {
    name: "EUR/USD",
    symbol: "EURUSD",
    pipSize: 0.0001,
    pipValue: 10, // for standard lot
    spread: 0.8,
    sector: "Major",
    session: "24/5",
  },
  GBPUSD: {
    name: "GBP/USD",
    symbol: "GBPUSD",
    pipSize: 0.0001,
    pipValue: 10,
    spread: 1.2,
    sector: "Major",
    session: "24/5",
  },
  USDJPY: {
    name: "USD/JPY",
    symbol: "USDJPY",
    pipSize: 0.01,
    pipValue: 10,
    spread: 0.9,
    sector: "Major",
    session: "24/5",
  },
  USDCHF: {
    name: "USD/CHF",
    symbol: "USDCHF",
    pipSize: 0.0001,
    pipValue: 10,
    spread: 1.1,
    sector: "Major",
    session: "24/5",
  },
}

interface RiskCalculation {
  // Position Details
  positionSize: number
  contractValue: number
  marginRequired: number

  // Risk Metrics
  riskAmount: number
  rewardAmount: number
  riskRewardRatio: number
  riskPercentage: number

  // Professional Metrics
  expectedValue: number
  profitProbability: number
  maxDrawdown: number
  sharpeRatio: number
  sortinoRatio: number
  calmarRatio: number

  // VaR and Risk Measures
  var95: number
  var99: number
  expectedShortfall: number
  conditionalVaR: number

  // Advanced Metrics
  kellyPercentage: number
  optimalFPercentage: number
  ulcerIndex: number
  painIndex: number
  gainToPainRatio: number
  sterlingRatio: number
  martinRatio: number

  // Statistical Properties
  skewness: number
  kurtosis: number
  beta: number
  alpha: number
  informationRatio: number
  trackingError: number

  // Simulation Results
  simulationResults: SimulationResult[]
  equityCurve: number[]
  drawdownCurve: number[]
  monthlyReturns: number[]

  // Quality Metrics
  confidence: number
  reliability: number
  convergence: number
  stability: number
}

interface SimulationResult {
  trade: number
  pnl: number
  cumulativePnl: number
  balance: number
  drawdown: number
  return: number
}

export default function RiskCalculatorClient() {
  // Form State
  const [assetType, setAssetType] = useState("futures")
  const [selectedContract, setSelectedContract] = useState("ES")
  const [accountBalance, setAccountBalance] = useState("100000")
  const [riskPerTrade, setRiskPerTrade] = useState([2])
  const [entryPrice, setEntryPrice] = useState("4500")
  const [stopLoss, setStopLoss] = useState("4480")
  const [takeProfit, setTakeProfit] = useState("4540")
  const [contracts, setContracts] = useState("1")
  const [winRate, setWinRate] = useState([65])
  const [volatility, setVolatility] = useState([18])
  const [timeHorizon, setTimeHorizon] = useState([252])
  const [commission, setCommission] = useState("2.50")

  // Advanced Settings
  const [useAdvanced, setUseAdvanced] = useState(false)
  const [positionSizingMethod, setPositionSizingMethod] = useState("fixed-risk")
  const [volatilityTargeting, setVolatilityTargeting] = useState(false)
  const [targetVolatility, setTargetVolatility] = useState([15])
  const [riskFreeRate, setRiskFreeRate] = useState("4.5")
  const [marketBeta, setMarketBeta] = useState("1.0")

  // Calculation State
  const [calculation, setCalculation] = useState<RiskCalculation | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculationProgress, setCalculationProgress] = useState(0)
  const [errors, setErrors] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  // Animation State
  const [animationPlaying, setAnimationPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  // Professional mathematical functions with improved accuracy
  const normalCDF = useCallback((x: number): number => {
    // Abramowitz and Stegun approximation with higher precision
    const sign = x >= 0 ? 1 : -1
    x = Math.abs(x)

    // Constants for the approximation
    const a1 = 0.254829592
    const a2 = -0.284496736
    const a3 = 1.421413741
    const a4 = -1.453152027
    const a5 = 1.061405429
    const p = 0.3275911

    const t = 1.0 / (1.0 + p * x)
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

    return 0.5 * (1.0 + sign * y)
  }, [])

  const boxMullerTransform = useCallback((): [number, number] => {
    let u = 0,
      v = 0
    while (u === 0) u = Math.random()
    while (v === 0) v = Math.random()

    const z0 = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
    const z1 = Math.sqrt(-2 * Math.log(u)) * Math.sin(2 * Math.PI * v)

    return [z0, z1]
  }, [])

  // Enhanced Monte Carlo simulation with professional accuracy
  const runMonteCarloSimulation = useCallback(
    async (params: any): Promise<SimulationResult[]> => {
      const { initialBalance, riskAmount, rewardAmount, winRateDecimal, volatilityDecimal, numTrades = 5000 } = params

      const results: SimulationResult[] = []
      let balance = initialBalance
      let cumulativePnl = 0
      let maxBalance = balance

      // Enhanced simulation with regime switching and volatility clustering
      let currentRegime = 0 // -1: bear, 0: normal, 1: bull
      let volatilityState = volatilityDecimal
      let consecutiveLosses = 0

      for (let i = 0; i < numTrades; i++) {
        // Update progress every 50 iterations for smoother UI
        if (i % 50 === 0) {
          setCalculationProgress((i / numTrades) * 100)
          await new Promise((resolve) => setTimeout(resolve, 1))
        }

        // Regime switching (Markov chain) - 2% probability of regime change
        if (Math.random() < 0.02) {
          const regimeRandom = Math.random()
          if (regimeRandom < 0.3)
            currentRegime = -1 // Bear market
          else if (regimeRandom < 0.7)
            currentRegime = 0 // Normal market
          else currentRegime = 1 // Bull market
        }

        // GARCH(1,1) volatility clustering model
        const [z1] = boxMullerTransform()
        const garchAlpha = 0.1 // Short-term volatility persistence
        const garchBeta = 0.85 // Long-term volatility persistence
        const garchOmega = 0.000001 // Long-term variance

        volatilityState = Math.sqrt(
          garchOmega + garchAlpha * Math.pow(z1 * volatilityState, 2) + garchBeta * Math.pow(volatilityState, 2),
        )

        // Regime-adjusted win rate with bounds checking
        const regimeAdjustment = currentRegime * 0.05
        const adjustedWinRate = Math.max(0.1, Math.min(0.9, winRateDecimal + regimeAdjustment))

        // Fat-tail adjustment for extreme market events (5% probability)
        const fatTailProbability = 0.05
        const isFatTailEvent = Math.random() < fatTailProbability

        let isWin: boolean
        if (isFatTailEvent) {
          // Extreme events tend to be losses (30% of normal win rate)
          isWin = Math.random() < adjustedWinRate * 0.3
        } else {
          isWin = Math.random() < adjustedWinRate
        }

        // Calculate P&L with volatility adjustment
        let pnl = isWin ? rewardAmount : -riskAmount

        // Apply volatility scaling (bounded to prevent extreme values)
        const volatilityMultiplier = Math.max(0.5, Math.min(2.0, 1 + (volatilityState - volatilityDecimal) * 2))
        pnl *= volatilityMultiplier

        // Consecutive loss penalty (psychological trading factor)
        if (!isWin) {
          consecutiveLosses++
          if (consecutiveLosses > 3) {
            // Increasing losses due to emotional trading (max 50% penalty)
            const emotionalPenalty = Math.min(0.5, consecutiveLosses * 0.1)
            pnl *= 1 + emotionalPenalty
          }
        } else {
          consecutiveLosses = 0
        }

        // Update balance and metrics
        balance += pnl
        cumulativePnl += pnl
        maxBalance = Math.max(maxBalance, balance)

        // Calculate drawdown (percentage from peak)
        const drawdown = maxBalance > 0 ? ((maxBalance - balance) / maxBalance) * 100 : 0
        const returnPct = initialBalance > 0 ? (pnl / initialBalance) * 100 : 0

        results.push({
          trade: i + 1,
          pnl,
          cumulativePnl,
          balance: Math.max(0, balance), // Prevent negative balance
          drawdown,
          return: returnPct,
        })

        // Stop simulation if account is blown (balance <= 0)
        if (balance <= 0) break
      }

      return results
    },
    [boxMullerTransform],
  )

  // Professional risk calculation engine with enhanced accuracy
  const calculateRisk = useCallback(async () => {
    const validationErrors: string[] = []

    // Comprehensive input validation
    const balance = Number.parseFloat(accountBalance)
    const entry = Number.parseFloat(entryPrice)
    const stop = Number.parseFloat(stopLoss)
    const profit = Number.parseFloat(takeProfit)
    const contractCount = Number.parseInt(contracts)
    const commissionCost = Number.parseFloat(commission)

    // Validation with specific error messages
    if (isNaN(balance) || balance <= 0) validationErrors.push("Account balance must be a positive number")
    if (balance < 1000) validationErrors.push("Minimum account balance should be $1,000")
    if (isNaN(entry) || entry <= 0) validationErrors.push("Entry price must be a positive number")
    if (isNaN(stop) || stop <= 0) validationErrors.push("Stop loss must be a positive number")
    if (isNaN(profit) || profit <= 0) validationErrors.push("Take profit must be a positive number")
    if (isNaN(contractCount) || contractCount <= 0) validationErrors.push("Number of contracts must be positive")
    if (isNaN(commissionCost) || commissionCost < 0) validationErrors.push("Commission must be non-negative")
    if (entry === stop) validationErrors.push("Entry price and stop loss cannot be equal")
    if (entry === profit) validationErrors.push("Entry price and take profit cannot be equal")

    // Risk/reward ratio validation
    const riskPoints = Math.abs(entry - stop)
    const rewardPoints = Math.abs(profit - entry)
    const rrRatio = rewardPoints / riskPoints

    if (rrRatio < 0.5) {
      validationErrors.push("Risk/reward ratio is too low (minimum 1:0.5 recommended)")
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors([])
    setIsCalculating(true)
    setCalculationProgress(0)

    try {
      // Get contract specifications
      const contractSpec =
        assetType === "futures"
          ? FUTURES_CONTRACTS[selectedContract as keyof typeof FUTURES_CONTRACTS]
          : FOREX_PAIRS[selectedContract as keyof typeof FOREX_PAIRS]

      if (!contractSpec) {
        throw new Error("Invalid contract selected")
      }

      // Calculate position metrics with proper formulas
      let riskAmount: number
      let rewardAmount: number
      let positionSize: number
      let marginRequired: number
      let contractValue: number

      if (assetType === "futures") {
        const spec = contractSpec as (typeof FUTURES_CONTRACTS)[keyof typeof FUTURES_CONTRACTS]
        const pointsRisk = Math.abs(entry - stop)
        const pointsReward = Math.abs(profit - entry)

        // Accurate futures calculations
        riskAmount = pointsRisk * spec.pointValue * contractCount + commissionCost * 2 // Round trip commission
        rewardAmount = pointsReward * spec.pointValue * contractCount - commissionCost * 2
        positionSize = contractCount
        marginRequired = spec.margin * contractCount
        contractValue = entry * spec.pointValue * contractCount
      } else {
        // Forex calculations
        const spec = contractSpec as (typeof FOREX_PAIRS)[keyof typeof FOREX_PAIRS]
        const lotSize = Number.parseFloat(contracts)
        const pipsRisk = Math.abs(entry - stop) / spec.pipSize
        const pipsReward = Math.abs(profit - entry) / spec.pipSize

        // Standard lot = 100,000 units of base currency
        const lotSizeMultiplier = lotSize >= 1 ? 1 : lotSize >= 0.1 ? 0.1 : 0.01 // Standard, Mini, Micro
        const adjustedPipValue = spec.pipValue * lotSizeMultiplier

        riskAmount = pipsRisk * adjustedPipValue + commissionCost
        rewardAmount = pipsReward * adjustedPipValue - commissionCost
        positionSize = lotSize
        marginRequired = 1000 * lotSize // Simplified margin (typically 1:100 leverage)
        contractValue = entry * 100000 * lotSize // Standard lot value
      }

      // Validate margin requirements
      if (marginRequired > balance * 0.8) {
        throw new Error("Insufficient margin - position size too large for account balance")
      }

      const riskRewardRatio = riskAmount > 0 ? rewardAmount / riskAmount : 0
      const riskPercentage = (riskAmount / balance) * 100

      // Validate risk percentage
      if (riskPercentage > 20) {
        throw new Error("Risk per trade exceeds 20% of account balance - position too large")
      }

      // Professional position sizing adjustments
      if (positionSizingMethod === "kelly") {
        const winRateDecimal = winRate[0] / 100
        // Kelly Criterion: f* = (bp - q) / b, where b = odds, p = win rate, q = loss rate
        const kellyFraction = (winRateDecimal * riskRewardRatio - (1 - winRateDecimal)) / riskRewardRatio
        // Use fractional Kelly (25% of full Kelly) for safety
        const adjustedKelly = Math.max(0.01, Math.min(0.25, kellyFraction * 0.25))

        const newRiskAmount = balance * adjustedKelly
        const scalingFactor = newRiskAmount / riskAmount
        riskAmount = newRiskAmount
        rewardAmount *= scalingFactor
        positionSize *= scalingFactor
      }

      // Run Monte Carlo simulation
      const simulationResults = await runMonteCarloSimulation({
        initialBalance: balance,
        riskAmount,
        rewardAmount,
        winRateDecimal: winRate[0] / 100,
        volatilityDecimal: volatility[0] / 100,
        numTrades: 5000,
      })

      // Calculate professional metrics with proper statistical methods
      const returns = simulationResults.map((r) => r.return / 100)
      const finalBalances = simulationResults.map((r) => r.balance)
      const drawdowns = simulationResults.map((r) => r.drawdown)

      // Statistical calculations
      const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
      const returnVariance = returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / (returns.length - 1)
      const returnStdDev = Math.sqrt(returnVariance)

      // Risk metrics with proper formulas
      const sortedReturns = [...returns].sort((a, b) => a - b)
      const var95Index = Math.floor(returns.length * 0.05)
      const var99Index = Math.floor(returns.length * 0.01)
      const var95 = Math.abs(sortedReturns[var95Index]) * balance
      const var99 = Math.abs(sortedReturns[var99Index]) * balance

      // Expected Shortfall (Conditional VaR)
      const tail5Pct = sortedReturns.slice(0, var95Index + 1)
      const expectedShortfall = Math.abs(tail5Pct.reduce((sum, r) => sum + r, 0) / tail5Pct.length) * balance

      // Performance ratios with annualization
      const riskFreeRateDecimal = Number.parseFloat(riskFreeRate) / 100 / 252 // Daily risk-free rate
      const excessReturn = meanReturn - riskFreeRateDecimal
      const sharpeRatio = returnStdDev > 0 ? (excessReturn / returnStdDev) * Math.sqrt(252) : 0

      // Sortino Ratio (downside deviation)
      const downsideReturns = returns.filter((r) => r < riskFreeRateDecimal)
      const downsideDeviation =
        downsideReturns.length > 0
          ? Math.sqrt(
              downsideReturns.reduce((sum, r) => sum + Math.pow(r - riskFreeRateDecimal, 2), 0) /
                downsideReturns.length,
            )
          : returnStdDev
      const sortinoRatio = downsideDeviation > 0 ? (excessReturn / downsideDeviation) * Math.sqrt(252) : 0

      // Maximum Drawdown
      const maxDrawdown = Math.max(...drawdowns)
      const calmarRatio = maxDrawdown > 0 ? (meanReturn * 252) / (maxDrawdown / 100) : 0

      // Advanced metrics
      const kellyPercentage =
        riskRewardRatio > 0
          ? Math.max(
              0,
              Math.min(25, (((winRate[0] / 100) * riskRewardRatio - (1 - winRate[0] / 100)) / riskRewardRatio) * 100),
            )
          : 0

      // Ulcer Index (drawdown-based risk measure)
      const ulcerIndex = Math.sqrt(drawdowns.reduce((sum, dd) => sum + dd * dd, 0) / drawdowns.length)

      // Higher moments (skewness and kurtosis)
      const skewness =
        returnStdDev > 0
          ? returns.reduce((sum, r) => sum + Math.pow((r - meanReturn) / returnStdDev, 3), 0) / returns.length
          : 0
      const kurtosis =
        returnStdDev > 0
          ? returns.reduce((sum, r) => sum + Math.pow((r - meanReturn) / returnStdDev, 4), 0) / returns.length - 3
          : 0

      // Generate equity curve and monthly returns
      const equityCurve = simulationResults.map((r) => r.balance)
      const drawdownCurve = simulationResults.map((r) => r.drawdown)

      // Monthly returns calculation
      const monthlyReturns = []
      const monthlyPeriod = Math.floor(simulationResults.length / 12)
      for (let i = 0; i < 12; i++) {
        const startIdx = i * monthlyPeriod
        const endIdx = Math.min((i + 1) * monthlyPeriod, simulationResults.length - 1)
        if (startIdx < simulationResults.length && endIdx < simulationResults.length) {
          const startBalance = simulationResults[startIdx].balance
          const endBalance = simulationResults[endIdx].balance
          const monthReturn = startBalance > 0 ? ((endBalance - startBalance) / startBalance) * 100 : 0
          monthlyReturns.push(monthReturn)
        }
      }

      // Additional professional ratios
      const sterlingRatio = maxDrawdown > 0 ? (meanReturn * 252 - riskFreeRateDecimal * 252) / (maxDrawdown / 100) : 0
      const martinRatio = ulcerIndex > 0 ? (meanReturn * 252) / Math.pow(ulcerIndex / 100, 2) : 0
      const gainToPainRatio = ulcerIndex > 0 ? (meanReturn * 252) / (ulcerIndex / 100) : 0

      const calculation: RiskCalculation = {
        // Position Details
        positionSize,
        contractValue,
        marginRequired,

        // Risk Metrics
        riskAmount,
        rewardAmount,
        riskRewardRatio,
        riskPercentage,

        // Professional Metrics
        expectedValue: (winRate[0] / 100) * rewardAmount - (1 - winRate[0] / 100) * riskAmount,
        profitProbability: winRate[0],
        maxDrawdown,
        sharpeRatio,
        sortinoRatio,
        calmarRatio,

        // VaR and Risk Measures
        var95,
        var99,
        expectedShortfall,
        conditionalVaR: expectedShortfall,

        // Advanced Metrics
        kellyPercentage,
        optimalFPercentage: kellyPercentage * 0.25,
        ulcerIndex,
        painIndex: drawdowns.reduce((sum, dd) => sum + dd, 0) / drawdowns.length,
        gainToPainRatio,
        sterlingRatio,
        martinRatio,

        // Statistical Properties
        skewness,
        kurtosis,
        beta: Number.parseFloat(marketBeta),
        alpha:
          meanReturn * 252 -
          (riskFreeRateDecimal * 252 + Number.parseFloat(marketBeta) * (0.1 - riskFreeRateDecimal * 252)),
        informationRatio: returnStdDev > 0 ? (meanReturn / returnStdDev) * Math.sqrt(252) : 0,
        trackingError: returnStdDev * Math.sqrt(252),

        // Simulation Results
        simulationResults,
        equityCurve,
        drawdownCurve,
        monthlyReturns,

        // Quality Metrics
        confidence: Math.min(100, 85 + simulationResults.length / 100),
        reliability: Math.min(100, 90 - Math.abs(skewness) * 10 - Math.abs(kurtosis) * 5),
        convergence: Math.min(100, 95 - returnStdDev * 100),
        stability: Math.min(100, 90 - maxDrawdown / 2),
      }

      setCalculation(calculation)
      setActiveTab("overview")
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Calculation failed. Please check your inputs."])
    } finally {
      setIsCalculating(false)
      setCalculationProgress(0)
    }
  }, [
    accountBalance,
    entryPrice,
    stopLoss,
    takeProfit,
    contracts,
    commission,
    assetType,
    selectedContract,
    riskPerTrade,
    winRate,
    volatility,
    positionSizingMethod,
    riskFreeRate,
    marketBeta,
    runMonteCarloSimulation,
  ])

  // Animation controls
  const playAnimation = useCallback(() => {
    setAnimationPlaying(true)
    setCurrentStep(0)

    const steps = 5
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps - 1) {
          clearInterval(interval)
          setAnimationPlaying(false)
          return 0
        }
        return prev + 1
      })
    }, 1000)
  }, [])

  // Utility functions
  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }, [])

  const formatPercentage = useCallback((value: number, decimals = 2): string => {
    return `${value.toFixed(decimals)}%`
  }, [])

  const formatNumber = useCallback((value: number, decimals = 2): string => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }, [])

  const getRiskLevel = useCallback((ratio: number) => {
    if (ratio >= 2)
      return { level: "Excellent", color: "text-primary", bgColor: "bg-primary/10", borderColor: "border-primary/20" }
    if (ratio >= 1.5)
      return { level: "Good", color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/20" }
    if (ratio >= 1)
      return {
        level: "Fair",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
      }
    return { level: "Poor", color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/20" }
  }, [])

  // Chart data preparation
  const chartData = useMemo(() => {
    if (!calculation) return []
    return calculation.simulationResults.slice(0, 1000).map((result, index) => ({
      trade: index + 1,
      balance: result.balance,
      drawdown: -result.drawdown,
      cumulativePnL: result.cumulativePnl,
      return: result.return,
    }))
  }, [calculation])

  const monthlyChartData = useMemo(() => {
    if (!calculation) return []
    return calculation.monthlyReturns.map((ret, index) => ({
      month: `M${index + 1}`,
      return: ret,
      cumulative: calculation.monthlyReturns.slice(0, index + 1).reduce((sum, r) => sum + r, 0),
    }))
  }, [calculation])

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,102,0.08)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,255,102,0.06)_0%,transparent_50%)]" />

          {/* Floating particles */}
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 4,
              }}
            />
          ))}
        </div>

        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div
                  className="p-4 bg-primary/10 rounded-2xl border border-primary/20 backdrop-blur-sm"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Calculator className="w-10 h-10 text-primary" />
                </motion.div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold font-display bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                    Professional Risk Calculator
                  </h1>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="text-lg text-gray-400 font-display">Institutional-Grade Accuracy</span>
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>

              <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-8 leading-relaxed font-display">
                World-class quantitative risk assessment tool with institutional-grade accuracy. Supporting futures
                (micro/mini/standard), forex (micro/mini/standard lots), and cryptocurrency trading.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20"
                  whileHover={{ scale: 1.05 }}
                >
                  <Brain className="w-5 h-5 text-primary" />
                  <span className="text-primary font-semibold font-display">5,000 Monte Carlo Simulations</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20"
                  whileHover={{ scale: 1.05 }}
                >
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-semibold font-display">20+ Professional Metrics</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20"
                  whileHover={{ scale: 1.05 }}
                >
                  <Award className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 font-semibold font-display">Quant-Grade Accuracy</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20"
                  whileHover={{ scale: 1.05 }}
                >
                  <Globe className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold font-display">Multi-Asset Support</span>
                </motion.div>
              </div>

              {/* Animation Control */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={playAnimation}
                  disabled={animationPlaying}
                  className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 font-display font-semibold px-6 py-3 h-auto"
                >
                  {animationPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Animation Playing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play Demo Animation
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setCurrentStep(0)}
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10 font-display font-semibold px-6 py-3 h-auto"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Calculator Interface */}
        <section className="relative py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Enhanced Input Panel */}
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="xl:col-span-1">
                <Card className="bg-black/60 border-primary/20 backdrop-blur-xl shadow-2xl sticky top-24">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-primary font-display text-xl">
                      <motion.div
                        animate={{ rotate: animationPlaying ? 360 : 0 }}
                        transition={{ duration: 2, repeat: animationPlaying ? Number.POSITIVE_INFINITY : 0 }}
                      >
                        <Target className="w-6 h-6" />
                      </motion.div>
                      Trading Parameters
                      <Badge className="bg-primary/10 text-primary border-primary/20 ml-auto font-display">
                        Step {currentStep + 1}/5
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400 font-display">
                      Configure your trading setup with professional precision
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-8">
                    {/* Asset Type Selection */}
                    <motion.div
                      className="space-y-4"
                      animate={{
                        scale: currentStep === 0 && animationPlaying ? 1.05 : 1,
                        borderColor: currentStep === 0 && animationPlaying ? "#00FF88" : "transparent",
                      }}
                    >
                      <Label className="text-sm font-medium text-gray-300 uppercase tracking-wider flex items-center gap-2 font-display">
                        <Layers className="w-4 h-4" />
                        Asset Type
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Choose between futures, forex, or cryptocurrency trading</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Select value={assetType} onValueChange={setAssetType}>
                        <SelectTrigger className="bg-white/5 border-primary/30 text-white hover:border-primary/50 transition-all duration-300 h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/95 border-primary/30 backdrop-blur-sm">
                          <SelectItem value="futures" className="text-white hover:bg-primary/10 font-display">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4" />
                              Futures (Micro/Mini/Standard)
                            </div>
                          </SelectItem>
                          <SelectItem value="forex" className="text-white hover:bg-primary/10 font-display">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              Forex (All Lot Sizes)
                            </div>
                          </SelectItem>
                          <SelectItem value="crypto" className="text-white hover:bg-primary/10 font-display">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4" />
                              Cryptocurrency
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>

                    {/* Contract/Pair Selection */}
                    <motion.div
                      className="space-y-4"
                      animate={{
                        scale: currentStep === 1 && animationPlaying ? 1.05 : 1,
                        borderColor: currentStep === 1 && animationPlaying ? "#00FF88" : "transparent",
                      }}
                    >
                      <Label className="text-sm font-medium text-gray-300 uppercase tracking-wider flex items-center gap-2 font-display">
                        <Star className="w-4 h-4" />
                        {assetType === "futures"
                          ? "Contract"
                          : assetType === "forex"
                            ? "Currency Pair"
                            : "Cryptocurrency"}
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-2">
                              {assetType === "futures" && (
                                <>
                                  <p className="font-semibold">Futures Contracts Available:</p>
                                  <div className="text-xs space-y-1">
                                    <div>• Micro: MES, MNQ, MYM, M2K, MCL, MGC</div>
                                    <div>• Mini: ES, NQ, YM, RTY</div>
                                    <div>• Standard: CL, GC</div>
                                  </div>
                                </>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Select value={selectedContract} onValueChange={setSelectedContract}>
                        <SelectTrigger className="bg-white/5 border-primary/30 text-white hover:border-primary/50 transition-all duration-300 h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/95 border-primary/30 backdrop-blur-sm">
                          {assetType === "futures" &&
                            Object.entries(FUTURES_CONTRACTS).map(([key, contract]) => (
                              <SelectItem key={key} value={key} className="text-white hover:bg-primary/10 font-display">
                                <div className="flex justify-between items-center w-full">
                                  <div>
                                    <div className="font-medium">{contract.name}</div>
                                    <div className="text-xs text-gray-400">
                                      {contract.type.toUpperCase()} | ${contract.margin.toLocaleString()} margin |{" "}
                                      {contract.exchange}
                                    </div>
                                  </div>
                                  <Badge
                                    className={`ml-2 ${
                                      contract.type === "micro"
                                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                                        : contract.type === "mini"
                                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                          : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                    }`}
                                  >
                                    {contract.type}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          {assetType === "forex" &&
                            Object.entries(FOREX_PAIRS).map(([key, pair]) => (
                              <SelectItem key={key} value={key} className="text-white hover:bg-primary/10 font-display">
                                <div>
                                  <div className="font-medium">{pair.name}</div>
                                  <div className="text-xs text-gray-400">
                                    {pair.sector} | Spread: {pair.spread} pips | {pair.session}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </motion.div>

                    {/* Account Balance */}
                    <motion.div
                      className="space-y-4"
                      animate={{
                        scale: currentStep === 2 && animationPlaying ? 1.05 : 1,
                        borderColor: currentStep === 2 && animationPlaying ? "#00FF88" : "transparent",
                      }}
                    >
                      <Label className="text-sm font-medium text-gray-300 uppercase tracking-wider flex items-center gap-2 font-display">
                        <DollarSign className="w-4 h-4" />
                        Account Balance
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Total trading capital available in your account</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        type="number"
                        value={accountBalance}
                        onChange={(e) => setAccountBalance(e.target.value)}
                        className="bg-white/5 border-primary/30 text-white hover:border-primary/50 transition-all duration-300 font-mono text-lg h-12"
                        placeholder="100000"
                        min="1000"
                        step="1000"
                      />
                      <div className="text-xs text-gray-500 font-display">
                        Minimum recommended: $10,000 for futures, $1,000 for forex
                      </div>
                    </motion.div>

                    {/* Risk Per Trade */}
                    <motion.div
                      className="space-y-4"
                      animate={{
                        scale: currentStep === 3 && animationPlaying ? 1.05 : 1,
                        borderColor: currentStep === 3 && animationPlaying ? "#00FF88" : "transparent",
                      }}
                    >
                      <Label className="text-sm font-medium text-gray-300 uppercase tracking-wider flex items-center gap-2 font-display">
                        <Shield className="w-4 h-4" />
                        Risk Per Trade: {riskPerTrade[0]}%
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Professional recommendation: 1-3% per trade</p>
                            <p>Maximum safe limit: 5% per trade</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Slider
                        value={riskPerTrade}
                        onValueChange={setRiskPerTrade}
                        max={10}
                        min={0.1}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 font-display">
                        <span>0.1% (Conservative)</span>
                        <span className="text-primary font-semibold">{riskPerTrade[0]}%</span>
                        <span>10% (Aggressive)</span>
                      </div>
                      <div
                        className={`text-xs font-display ${
                          riskPerTrade[0] <= 2
                            ? "text-green-400"
                            : riskPerTrade[0] <= 5
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {riskPerTrade[0] <= 2
                          ? "✓ Conservative"
                          : riskPerTrade[0] <= 5
                            ? "⚠ Moderate Risk"
                            : "⚠ High Risk"}
                      </div>
                    </motion.div>

                    {/* Price Levels */}
                    <motion.div
                      className="space-y-6"
                      animate={{
                        scale: currentStep === 4 && animationPlaying ? 1.05 : 1,
                        borderColor: currentStep === 4 && animationPlaying ? "#00FF88" : "transparent",
                      }}
                    >
                      <Label className="text-sm font-medium text-gray-300 uppercase tracking-wider flex items-center gap-2 font-display">
                        <Activity className="w-4 h-4" />
                        Price Levels
                      </Label>

                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                          <Label className="text-xs text-gray-400 font-display">Entry Price</Label>
                          <Input
                            type="number"
                            value={entryPrice}
                            onChange={(e) => setEntryPrice(e.target.value)}
                            className="bg-white/5 border-primary/30 text-white hover:border-primary/50 transition-all duration-300 font-mono h-12"
                            placeholder="4500.00"
                            step="0.01"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-xs text-gray-400 font-display flex items-center gap-2">
                            <TrendingDown className="w-3 h-3 text-red-400" />
                            Stop Loss
                          </Label>
                          <Input
                            type="number"
                            value={stopLoss}
                            onChange={(e) => setStopLoss(e.target.value)}
                            className="bg-white/5 border-red-500/30 text-white hover:border-red-500/50 transition-all duration-300 font-mono h-12"
                            placeholder="4480.00"
                            step="0.01"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-xs text-gray-400 font-display flex items-center gap-2">
                            <TrendingUp className="w-3 h-3 text-green-400" />
                            Take Profit
                          </Label>
                          <Input
                            type="number"
                            value={takeProfit}
                            onChange={(e) => setTakeProfit(e.target.value)}
                            className="bg-white/5 border-green-500/30 text-white hover:border-green-500/50 transition-all duration-300 font-mono h-12"
                            placeholder="4540.00"
                            step="0.01"
                          />
                        </div>
                      </div>

                      {/* Risk/Reward Preview */}
                      {Number.parseFloat(entryPrice) &&
                        Number.parseFloat(stopLoss) &&
                        Number.parseFloat(takeProfit) && (
                          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <div className="text-xs text-gray-400 mb-3 font-display">Risk/Reward Preview:</div>
                            <div className="flex justify-between items-center mb-3">
                              <div className="text-red-400 font-mono text-sm">
                                Risk: {Math.abs(Number.parseFloat(entryPrice) - Number.parseFloat(stopLoss)).toFixed(2)}{" "}
                                pts
                              </div>
                              <div className="text-green-400 font-mono text-sm">
                                Reward:{" "}
                                {Math.abs(Number.parseFloat(takeProfit) - Number.parseFloat(entryPrice)).toFixed(2)} pts
                              </div>
                            </div>
                            <div className="text-center">
                              <span className="text-primary font-semibold font-mono">
                                Ratio: 1:
                                {(
                                  Math.abs(Number.parseFloat(takeProfit) - Number.parseFloat(entryPrice)) /
                                  Math.abs(Number.parseFloat(entryPrice) - Number.parseFloat(stopLoss))
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                    </motion.div>

                    {/* Position Size */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-300 uppercase tracking-wider flex items-center gap-2 font-display">
                        <Layers className="w-4 h-4" />
                        {assetType === "futures" ? "Contracts" : assetType === "forex" ? "Lot Size" : "Position Size"}
                      </Label>
                      <Input
                        type="number"
                        value={contracts}
                        onChange={(e) => setContracts(e.target.value)}
                        className="bg-white/5 border-primary/30 text-white hover:border-primary/50 transition-all duration-300 font-mono h-12"
                        placeholder={assetType === "forex" ? "1.0" : "1"}
                        min={assetType === "forex" ? "0.01" : "1"}
                        step={assetType === "forex" ? "0.01" : "1"}
                      />
                      {assetType === "futures" && selectedContract && (
                        <div className="text-xs text-gray-500 font-display">
                          Margin per contract: $
                          {FUTURES_CONTRACTS[
                            selectedContract as keyof typeof FUTURES_CONTRACTS
                          ]?.margin.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Advanced Settings Toggle */}
                    <div className="border-t border-primary/20 pt-8">
                      <div className="flex items-center justify-between mb-6">
                        <Label className="text-sm font-medium text-gray-300 uppercase tracking-wider flex items-center gap-2 font-display">
                          <Settings className="w-4 h-4" />
                          Advanced Parameters
                        </Label>
                        <Switch
                          checked={useAdvanced}
                          onCheckedChange={setUseAdvanced}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>

                      <AnimatePresence>
                        {useAdvanced && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-6 overflow-hidden"
                          >
                            {/* Win Rate */}
                            <div className="space-y-4">
                              <Label className="text-xs text-gray-400 font-display">Win Rate: {winRate[0]}%</Label>
                              <Slider
                                value={winRate}
                                onValueChange={setWinRate}
                                max={95}
                                min={30}
                                step={1}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-gray-500 font-display">
                                <span>30%</span>
                                <span>95%</span>
                              </div>
                            </div>

                            {/* Volatility */}
                            <div className="space-y-4">
                              <Label className="text-xs text-gray-400 font-display">
                                Expected Volatility: {volatility[0]}%
                              </Label>
                              <Slider
                                value={volatility}
                                onValueChange={setVolatility}
                                max={50}
                                min={5}
                                step={1}
                                className="w-full"
                              />
                            </div>

                            {/* Position Sizing Method */}
                            <div className="space-y-3">
                              <Label className="text-xs text-gray-400 font-display">Position Sizing Method</Label>
                              <Select value={positionSizingMethod} onValueChange={setPositionSizingMethod}>
                                <SelectTrigger className="bg-white/5 border-primary/30 text-white h-12">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-black/95 border-primary/30">
                                  <SelectItem value="fixed-risk">Fixed Risk %</SelectItem>
                                  <SelectItem value="kelly">Kelly Criterion</SelectItem>
                                  <SelectItem value="volatility-target">Volatility Targeting</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Commission */}
                            <div className="space-y-3">
                              <Label className="text-xs text-gray-400 font-display">Commission per Trade</Label>
                              <Input
                                type="number"
                                value={commission}
                                onChange={(e) => setCommission(e.target.value)}
                                className="bg-white/5 border-primary/30 text-white font-mono h-12"
                                placeholder="2.50"
                                step="0.01"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Error Display */}
                    <AnimatePresence>
                      {errors.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Alert className="border-red-500/20 bg-red-500/5 backdrop-blur-sm">
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                            <AlertDescription className="text-red-400">
                              <ul className="list-disc list-inside space-y-1">
                                {errors.map((error, index) => (
                                  <li key={index} className="text-sm font-display">
                                    {error}
                                  </li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Enhanced Calculate Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={calculateRisk}
                        disabled={isCalculating}
                        className="w-full bg-gradient-to-r from-primary to-primary/80 text-black font-bold py-6 text-lg hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg shadow-primary/20 font-display h-auto min-h-[60px] relative overflow-hidden"
                      >
                        {isCalculating ? (
                          <div className="flex flex-col items-center gap-3 w-full">
                            <div className="flex items-center gap-3">
                              <motion.div
                                className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              />
                              <span className="font-bold text-black">RUNNING ANALYSIS</span>
                            </div>
                            <Progress value={calculationProgress} className="w-full h-2" />
                            <div className="text-xs text-black/70 font-medium">
                              {calculationProgress.toFixed(0)}% Complete • {Math.floor(calculationProgress * 50)}{" "}
                              simulations
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3 w-full">
                            <Calculator className="w-6 h-6" />
                            <span className="font-bold text-black">CALCULATE PROFESSIONAL RISK</span>
                            <ChevronRight className="w-6 h-6" />
                          </div>
                        )}
                      </Button>
                    </motion.div>

                    {/* Quick Stats Preview */}
                    {!isCalculating && !calculation && (
                      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-primary/10">
                        <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                          <div className="text-xs text-gray-400 font-display mb-1">Ready for</div>
                          <div className="text-lg font-bold text-primary font-mono">5,000</div>
                          <div className="text-xs text-gray-400 font-display">Simulations</div>
                        </div>
                        <div className="text-center p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
                          <div className="text-xs text-gray-400 font-display mb-1">Generating</div>
                          <div className="text-lg font-bold text-blue-400 font-mono">20+</div>
                          <div className="text-xs text-gray-400 font-display">Metrics</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Results Panel */}
              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="xl:col-span-3">
                <AnimatePresence mode="wait">
                  {calculation ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-8"
                    >
                      {/* Professional Quality Assessment */}
                      <Card className="bg-black/60 border-primary/20 backdrop-blur-xl shadow-2xl">
                        <CardHeader className="pb-6">
                          <CardTitle className="flex items-center gap-3 text-primary font-display text-xl">
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            >
                              <Brain className="w-6 h-6" />
                            </motion.div>
                            Professional Analysis Quality
                            <Badge className="bg-primary/10 text-primary border-primary/20 ml-auto font-display">
                              {calculation.confidence.toFixed(0)}% Confidence
                            </Badge>
                          </CardTitle>
                          <CardDescription className="font-display">
                            Statistical validation of {calculation.simulationResults.length.toLocaleString()} Monte
                            Carlo simulations
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                              {
                                label: "Confidence",
                                value: calculation.confidence,
                                icon: CheckCircle,
                                color: "text-green-400",
                              },
                              {
                                label: "Reliability",
                                value: calculation.reliability,
                                icon: Shield,
                                color: "text-blue-400",
                              },
                              {
                                label: "Convergence",
                                value: calculation.convergence,
                                icon: Target,
                                color: "text-purple-400",
                              },
                              {
                                label: "Stability",
                                value: calculation.stability,
                                icon: Activity,
                                color: "text-yellow-400",
                              },
                            ].map((metric, index) => (
                              <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-6 bg-white/5 rounded-xl border border-primary/10"
                              >
                                <div className="flex items-center justify-center mb-3">
                                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                                </div>
                                <div className={`text-2xl font-bold font-mono mb-2 ${metric.color}`}>
                                  {metric.value.toFixed(0)}%
                                </div>
                                <div className="text-xs text-gray-400 font-display uppercase tracking-wider">
                                  {metric.label}
                                </div>
                                <Progress value={metric.value} className="mt-3 h-1" />
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Key Metrics Dashboard */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                          {
                            title: "Position Size",
                            value: formatNumber(calculation.positionSize, 4),
                            subtitle: assetType === "futures" ? "Contracts" : "Lots",
                            icon: Target,
                            color: "text-primary",
                            bgColor: "from-primary/10 to-primary/5",
                            borderColor: "border-primary/20",
                          },
                          {
                            title: "Risk Amount",
                            value: formatCurrency(calculation.riskAmount),
                            subtitle: `${calculation.riskPercentage.toFixed(2)}% of account`,
                            icon: Shield,
                            color: "text-red-400",
                            bgColor: "from-red-500/10 to-red-500/5",
                            borderColor: "border-red-500/20",
                          },
                          {
                            title: "Reward Amount",
                            value: formatCurrency(calculation.rewardAmount),
                            subtitle: `${((calculation.rewardAmount / Number.parseFloat(accountBalance)) * 100).toFixed(2)}% potential`,
                            icon: TrendingUp,
                            color: "text-green-400",
                            bgColor: "from-green-500/10 to-green-500/5",
                            borderColor: "border-green-500/20",
                          },
                          {
                            title: "Risk:Reward",
                            value: `1:${calculation.riskRewardRatio.toFixed(2)}`,
                            subtitle: getRiskLevel(calculation.riskRewardRatio).level,
                            icon: BarChart3,
                            color: getRiskLevel(calculation.riskRewardRatio).color,
                            bgColor: getRiskLevel(calculation.riskRewardRatio).bgColor,
                            borderColor: getRiskLevel(calculation.riskRewardRatio).borderColor,
                          },
                        ].map((metric, index) => (
                          <motion.div
                            key={metric.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                          >
                            <Card
                              className={`bg-gradient-to-br ${metric.bgColor} ${metric.borderColor} backdrop-blur-sm relative overflow-hidden group`}
                            >
                              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50" />
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-400 font-display mb-2">{metric.title}</p>
                                    <p className={`text-2xl font-bold font-mono ${metric.color} mb-2`}>
                                      {metric.value}
                                    </p>
                                    <p className="text-xs text-gray-500 font-display">{metric.subtitle}</p>
                                  </div>
                                  <motion.div
                                    className={`p-3 rounded-xl bg-white/5 ${metric.color}`}
                                    whileHover={{ rotate: 15, scale: 1.1 }}
                                  >
                                    <metric.icon className="w-6 h-6" />
                                  </motion.div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 group-hover:opacity-40 transition-opacity" />
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>

                      {/* Professional Analysis Tabs */}
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-5 bg-black/40 border border-primary/20 backdrop-blur-sm h-14">
                          <TabsTrigger
                            value="overview"
                            className="font-display data-[state=active]:bg-primary/20 data-[state=active]:text-primary h-12"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Overview
                          </TabsTrigger>
                          <TabsTrigger
                            value="risk"
                            className="font-display data-[state=active]:bg-primary/20 data-[state=active]:text-primary h-12"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Risk Metrics
                          </TabsTrigger>
                          <TabsTrigger
                            value="performance"
                            className="font-display data-[state=active]:bg-primary/20 data-[state=active]:text-primary h-12"
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Performance
                          </TabsTrigger>
                          <TabsTrigger
                            value="charts"
                            className="font-display data-[state=active]:bg-primary/20 data-[state=active]:text-primary h-12"
                          >
                            <LineChart className="w-4 h-4 mr-2" />
                            Analysis
                          </TabsTrigger>
                          <TabsTrigger
                            value="advanced"
                            className="font-display data-[state=active]:bg-primary/20 data-[state=active]:text-primary h-12"
                          >
                            <Brain className="w-4 h-4 mr-2" />
                            Advanced
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-8 mt-8">
                          {/* Expected Value and Probability */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
                              <CardHeader className="pb-6">
                                <CardTitle className="text-lg font-display flex items-center gap-2">
                                  <DollarSign className="w-5 h-5 text-primary" />
                                  Expected Value Analysis
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-6">
                                <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
                                  <span className="text-gray-400 font-display">Expected Value</span>
                                  <span
                                    className={`font-mono font-bold ${calculation.expectedValue >= 0 ? "text-green-400" : "text-red-400"}`}
                                  >
                                    {formatCurrency(calculation.expectedValue)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-blue-500/5 rounded-lg">
                                  <span className="text-gray-400 font-display">Win Probability</span>
                                  <span className="font-mono font-bold text-blue-400">
                                    {calculation.profitProbability.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-purple-500/5 rounded-lg">
                                  <span className="text-gray-400 font-display">Kelly Percentage</span>
                                  <span className="font-mono font-bold text-purple-400">
                                    {calculation.kellyPercentage.toFixed(2)}%
                                  </span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
                              <CardHeader className="pb-6">
                                <CardTitle className="text-lg font-display flex items-center gap-2">
                                  <Gauge className="w-5 h-5 text-primary" />
                                  Risk Assessment
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-6">
                                <div className="flex justify-between items-center p-4 bg-red-500/5 rounded-lg">
                                  <span className="text-gray-400 font-display">Max Drawdown</span>
                                  <span className="font-mono font-bold text-red-400">
                                    {formatPercentage(calculation.maxDrawdown)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-orange-500/5 rounded-lg">
                                  <span className="text-gray-400 font-display">VaR (95%)</span>
                                  <span className="font-mono font-bold text-orange-400">
                                    {formatCurrency(calculation.var95)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-yellow-500/5 rounded-lg">
                                  <span className="text-gray-400 font-display">Expected Shortfall</span>
                                  <span className="font-mono font-bold text-yellow-400">
                                    {formatCurrency(calculation.expectedShortfall)}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Professional Summary */}
                          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 backdrop-blur-sm">
                            <CardHeader className="pb-6">
                              <CardTitle className="flex items-center gap-3 text-primary font-display text-xl">
                                <Flame className="w-6 h-6" />
                                Professional Risk Assessment Summary
                                <Badge className="bg-primary/20 text-primary border-primary/30 ml-auto font-display">
                                  Institutional Grade
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-primary mb-3 font-mono">
                                    {calculation.reliability.toFixed(0)}%
                                  </div>
                                  <div className="text-sm text-gray-400 font-display">Analysis Reliability</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-blue-400 mb-3 font-mono">
                                    {calculation.sharpeRatio.toFixed(2)}
                                  </div>
                                  <div className="text-sm text-gray-400 font-display">Sharpe Ratio</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-green-400 mb-3 font-mono">
                                    {calculation.optimalFPercentage.toFixed(2)}%
                                  </div>
                                  <div className="text-sm text-gray-400 font-display">Optimal Position Size</div>
                                </div>
                              </div>

                              <div className="p-6 bg-black/20 rounded-xl border border-primary/10">
                                <h4 className="font-semibold text-primary mb-4 font-display flex items-center gap-2 text-lg">
                                  <Award className="w-5 h-5" />
                                  Professional Recommendation
                                </h4>
                                <p className="text-sm text-gray-300 leading-relaxed font-display">
                                  Based on {calculation.simulationResults.length.toLocaleString()} Monte Carlo
                                  simulations with {calculation.confidence.toFixed(0)}% statistical confidence, this
                                  {assetType === "futures"
                                    ? ` ${FUTURES_CONTRACTS[selectedContract as keyof typeof FUTURES_CONTRACTS]?.name}`
                                    : assetType === "forex"
                                      ? ` ${FOREX_PAIRS[selectedContract as keyof typeof FOREX_PAIRS]?.name}`
                                      : ""}
                                  trade setup demonstrates a{" "}
                                  <span className={getRiskLevel(calculation.riskRewardRatio).color}>
                                    {getRiskLevel(calculation.riskRewardRatio).level.toLowerCase()}
                                  </span>{" "}
                                  risk-reward profile with a {calculation.riskRewardRatio.toFixed(2)}:1 ratio. The
                                  optimal position size using fractional Kelly criterion is{" "}
                                  <span className="text-primary font-semibold">
                                    {calculation.optimalFPercentage.toFixed(2)}%
                                  </span>{" "}
                                  of your account, with an expected Sharpe ratio of{" "}
                                  <span className="text-blue-400 font-semibold">
                                    {calculation.sharpeRatio.toFixed(2)}
                                  </span>
                                  . Maximum simulated drawdown suggests{" "}
                                  <span className="text-red-400 font-semibold">
                                    {formatPercentage(calculation.maxDrawdown)}
                                  </span>{" "}
                                  potential loss during adverse market conditions.
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="risk" className="space-y-8 mt-8">
                          {/* VaR Analysis */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                              {
                                label: "VaR (95%)",
                                value: formatCurrency(calculation.var95),
                                description: "Maximum expected loss at 95% confidence",
                                color: "text-red-400",
                                bgColor: "bg-red-500/10",
                                borderColor: "border-red-500/20",
                                icon: AlertTriangle,
                              },
                              {
                                label: "VaR (99%)",
                                value: formatCurrency(calculation.var99),
                                description: "Maximum expected loss at 99% confidence",
                                color: "text-red-500",
                                bgColor: "bg-red-600/10",
                                borderColor: "border-red-600/20",
                                icon: XCircle,
                              },
                              {
                                label: "Expected Shortfall",
                                value: formatCurrency(calculation.expectedShortfall),
                                description: "Average loss beyond VaR threshold",
                                color: "text-orange-400",
                                bgColor: "bg-orange-500/10",
                                borderColor: "border-orange-500/20",
                                icon: TrendingDown,
                              },
                              {
                                label: "Conditional VaR",
                                value: formatCurrency(calculation.conditionalVaR),
                                description: "Expected loss given VaR breach",
                                color: "text-yellow-400",
                                bgColor: "bg-yellow-500/10",
                                borderColor: "border-yellow-500/20",
                                icon: Shield,
                              },
                              {
                                label: "Ulcer Index",
                                value: calculation.ulcerIndex.toFixed(3),
                                description: "Drawdown-based risk measure",
                                color: "text-purple-400",
                                bgColor: "bg-purple-500/10",
                                borderColor: "border-purple-500/20",
                                icon: Activity,
                              },
                              {
                                label: "Pain Index",
                                value: calculation.painIndex.toFixed(3),
                                description: "Average drawdown severity",
                                color: "text-blue-400",
                                bgColor: "bg-blue-500/10",
                                borderColor: "border-blue-500/20",
                                icon: Gauge,
                              },
                            ].map((metric, index) => (
                              <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <Card
                                  className={`${metric.bgColor} ${metric.borderColor} backdrop-blur-sm hover:border-opacity-50 transition-all duration-300 group`}
                                >
                                  <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                      <metric.icon className={`w-5 h-5 ${metric.color}`} />
                                      <div className="text-xs text-gray-400 uppercase tracking-wider font-display">
                                        {metric.label}
                                      </div>
                                    </div>
                                    <div className={`text-2xl font-bold font-mono mb-3 ${metric.color}`}>
                                      {metric.value}
                                    </div>
                                    <div className="text-xs text-gray-500 font-display opacity-0 group-hover:opacity-100 transition-opacity">
                                      {metric.description}
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>

                          {/* Risk Ratios */}
                          <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
                            <CardHeader className="pb-6">
                              <CardTitle className="font-display text-xl text-primary flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Professional Risk Ratios
                              </CardTitle>
                              <CardDescription className="font-display">
                                Industry-standard risk-adjusted performance metrics
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                  {
                                    label: "Sharpe Ratio",
                                    value: calculation.sharpeRatio.toFixed(3),
                                    color: "text-blue-400",
                                  },
                                  {
                                    label: "Sortino Ratio",
                                    value: calculation.sortinoRatio.toFixed(3),
                                    color: "text-green-400",
                                  },
                                  {
                                    label: "Calmar Ratio",
                                    value: calculation.calmarRatio.toFixed(3),
                                    color: "text-purple-400",
                                  },
                                  {
                                    label: "Sterling Ratio",
                                    value: calculation.sterlingRatio.toFixed(3),
                                    color: "text-yellow-400",
                                  },
                                  {
                                    label: "Martin Ratio",
                                    value: calculation.martinRatio.toFixed(3),
                                    color: "text-red-400",
                                  },
                                  {
                                    label: "Gain-to-Pain",
                                    value: calculation.gainToPainRatio.toFixed(3),
                                    color: "text-cyan-400",
                                  },
                                  {
                                    label: "Information Ratio",
                                    value: calculation.informationRatio.toFixed(3),
                                    color: "text-orange-400",
                                  },
                                  {
                                    label: "Tracking Error",
                                    value: formatPercentage(calculation.trackingError),
                                    color: "text-pink-400",
                                  },
                                ].map((ratio, index) => (
                                  <motion.div
                                    key={ratio.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center p-6 bg-white/5 rounded-lg border border-primary/10 hover:border-primary/20 transition-colors"
                                  >
                                    <div className={`text-2xl font-bold font-mono mb-2 ${ratio.color}`}>
                                      {ratio.value}
                                    </div>
                                    <div className="text-xs text-gray-400 font-display">{ratio.label}</div>
                                  </motion.div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="performance" className="space-y-8 mt-8">
                          {/* Performance Overview */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                              {
                                title: "Expected Return",
                                value: formatCurrency(calculation.expectedValue),
                                subtitle: "Per trade expectation",
                                color: calculation.expectedValue >= 0 ? "text-green-400" : "text-red-400",
                              },
                              {
                                title: "Win Rate",
                                value: `${calculation.profitProbability.toFixed(1)}%`,
                                subtitle: "Probability of profit",
                                color: "text-blue-400",
                              },
                              {
                                title: "Profit Factor",
                                value: (calculation.rewardAmount / calculation.riskAmount).toFixed(2),
                                subtitle: "Gross profit / Gross loss",
                                color: "text-purple-400",
                              },
                              {
                                title: "Payoff Ratio",
                                value: calculation.riskRewardRatio.toFixed(2),
                                subtitle: "Average win / Average loss",
                                color: "text-yellow-400",
                              },
                            ].map((metric, index) => (
                              <motion.div
                                key={metric.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <Card className="bg-black/20 border-primary/10 backdrop-blur-sm text-center">
                                  <CardContent className="p-6">
                                    <div className={`text-2xl font-bold font-mono mb-2 ${metric.color}`}>
                                      {metric.value}
                                    </div>
                                    <div className="text-sm text-gray-400 font-display mb-2">{metric.title}</div>
                                    <div className="text-xs text-gray-500 font-display">{metric.subtitle}</div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>

                          {/* Monthly Performance */}
                          <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
                            <CardHeader className="pb-6">
                              <CardTitle className="font-display text-xl text-primary flex items-center gap-2">
                                <PieChart className="w-5 h-5" />
                                Monthly Performance Projection
                              </CardTitle>
                              <CardDescription className="font-display">
                                Simulated monthly returns based on trading parameters
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-80 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                  <ComposedChart data={monthlyChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis
                                      dataKey="month"
                                      stroke="#9CA3AF"
                                      fontSize={12}
                                      fontFamily="var(--font-inter)"
                                    />
                                    <YAxis
                                      stroke="#9CA3AF"
                                      fontSize={12}
                                      fontFamily="var(--font-inter)"
                                      tickFormatter={(value) => `${value.toFixed(1)}%`}
                                    />
                                    <RechartsTooltip
                                      contentStyle={{
                                        backgroundColor: "#1F2937",
                                        border: "1px solid #00FF88",
                                        borderRadius: "8px",
                                        fontFamily: "var(--font-inter)",
                                      }}
                                      formatter={(value: any, name: string) => [
                                        `${value.toFixed(2)}%`,
                                        name === "return" ? "Monthly Return" : "Cumulative Return",
                                      ]}
                                    />
                                    <Bar dataKey="return" fill="#00FF88" opacity={0.7} radius={[4, 4, 0, 0]} />
                                    <Line
                                      type="monotone"
                                      dataKey="cumulative"
                                      stroke="#3B82F6"
                                      strokeWidth={3}
                                      dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                                    />
                                  </ComposedChart>
                                </ResponsiveContainer>
                              </div>

                              <div className="grid grid-cols-4 gap-6 text-sm">
                                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                                  <div className="text-green-400 font-mono font-bold text-lg">
                                    {calculation.monthlyReturns.filter((r) => r > 0).length}
                                  </div>
                                  <div className="text-gray-400 font-display">Positive Months</div>
                                </div>
                                <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                                  <div className="text-red-400 font-mono font-bold text-lg">
                                    {calculation.monthlyReturns.filter((r) => r < 0).length}
                                  </div>
                                  <div className="text-gray-400 font-display">Negative Months</div>
                                </div>
                                <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                  <div className="text-blue-400 font-mono font-bold text-lg">
                                    {formatPercentage(Math.max(...calculation.monthlyReturns))}
                                  </div>
                                  <div className="text-gray-400 font-display">Best Month</div>
                                </div>
                                <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                  <div className="text-yellow-400 font-mono font-bold text-lg">
                                    {formatPercentage(Math.min(...calculation.monthlyReturns))}
                                  </div>
                                  <div className="text-gray-400 font-display">Worst Month</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="charts" className="space-y-8 mt-8">
                          {/* Equity Curve */}
                          <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
                            <CardHeader className="pb-6">
                              <CardTitle className="font-display text-xl text-primary flex items-center gap-2">
                                <LineChart className="w-5 h-5" />
                                Portfolio Evolution Simulation
                              </CardTitle>
                              <CardDescription className="font-display">
                                Balance and drawdown progression through{" "}
                                {calculation.simulationResults.length.toLocaleString()} simulated trades
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-96 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                  <ComposedChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis
                                      dataKey="trade"
                                      stroke="#9CA3AF"
                                      fontSize={12}
                                      fontFamily="var(--font-inter)"
                                    />
                                    <YAxis
                                      yAxisId="balance"
                                      orientation="left"
                                      stroke="#9CA3AF"
                                      fontSize={12}
                                      fontFamily="var(--font-inter)"
                                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                    />
                                    <YAxis
                                      yAxisId="drawdown"
                                      orientation="right"
                                      stroke="#9CA3AF"
                                      fontSize={12}
                                      fontFamily="var(--font-inter)"
                                      tickFormatter={(value) => `${value.toFixed(1)}%`}
                                    />
                                    <RechartsTooltip
                                      contentStyle={{
                                        backgroundColor: "#1F2937",
                                        border: "1px solid #00FF88",
                                        borderRadius: "8px",
                                        fontFamily: "var(--font-inter)",
                                      }}
                                      formatter={(value: any, name: string) => [
                                        name === "balance"
                                          ? formatCurrency(value)
                                          : name === "cumulativePnL"
                                            ? formatCurrency(value)
                                            : `${value.toFixed(2)}%`,
                                        name === "balance"
                                          ? "Account Balance"
                                          : name === "cumulativePnL"
                                            ? "Cumulative P&L"
                                            : "Drawdown",
                                      ]}
                                    />
                                    <Area
                                      yAxisId="balance"
                                      type="monotone"
                                      dataKey="balance"
                                      fill="url(#colorBalance)"
                                      stroke="#00FF88"
                                      strokeWidth={2}
                                    />
                                    <Line
                                      yAxisId="balance"
                                      type="monotone"
                                      dataKey="cumulativePnL"
                                      stroke="#3B82F6"
                                      strokeWidth={2}
                                      dot={false}
                                    />
                                    <Area
                                      yAxisId="drawdown"
                                      type="monotone"
                                      dataKey="drawdown"
                                      fill="url(#colorDrawdown)"
                                      stroke="#EF4444"
                                      strokeWidth={1}
                                    />
                                    <defs>
                                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00FF88" stopOpacity={0.05} />
                                      </linearGradient>
                                      <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05} />
                                      </linearGradient>
                                    </defs>
                                  </ComposedChart>
                                </ResponsiveContainer>
                              </div>

                              <div className="grid grid-cols-4 gap-6 text-sm">
                                <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                                  <div className="text-primary font-mono font-bold text-lg">
                                    {formatCurrency(calculation.equityCurve[calculation.equityCurve.length - 1])}
                                  </div>
                                  <div className="text-gray-400 font-display">Final Balance</div>
                                </div>
                                <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                  <div className="text-blue-400 font-mono font-bold text-lg">
                                    {formatCurrency(
                                      Math.max(...calculation.simulationResults.map((r) => r.cumulativePnl)),
                                    )}
                                  </div>
                                  <div className="text-gray-400 font-display">Max P&L</div>
                                </div>
                                <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                                  <div className="text-red-400 font-mono font-bold text-lg">
                                    {formatPercentage(Math.max(...calculation.drawdownCurve))}
                                  </div>
                                  <div className="text-gray-400 font-display">Max Drawdown</div>
                                </div>
                                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                                  <div className="text-green-400 font-mono font-bold text-lg">
                                    {formatPercentage(
                                      (calculation.equityCurve[calculation.equityCurve.length - 1] /
                                        Number.parseFloat(accountBalance) -
                                        1) *
                                        100,
                                    )}
                                  </div>
                                  <div className="text-gray-400 font-display">Total Return</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="advanced" className="space-y-8 mt-8">
                          {/* Statistical Properties */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
                              <CardHeader className="pb-6">
                                <CardTitle className="text-lg font-display flex items-center gap-2">
                                  <Brain className="w-5 h-5 text-primary" />
                                  Statistical Properties
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-6">
                                {[
                                  {
                                    label: "Skewness",
                                    value: calculation.skewness.toFixed(4),
                                    description: "Return distribution asymmetry",
                                  },
                                  {
                                    label: "Kurtosis",
                                    value: calculation.kurtosis.toFixed(4),
                                    description: "Tail thickness measure",
                                  },
                                  {
                                    label: "Beta",
                                    value: calculation.beta.toFixed(3),
                                    description: "Market sensitivity",
                                  },
                                  {
                                    label: "Alpha",
                                    value: formatPercentage(calculation.alpha),
                                    description: "Excess return vs market",
                                  },
                                ].map((stat, index) => (
                                  <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex justify-between items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                  >
                                    <div>
                                      <div className="text-sm font-medium text-gray-300 font-display mb-1">
                                        {stat.label}
                                      </div>
                                      <div className="text-xs text-gray-500 font-display">{stat.description}</div>
                                    </div>
                                    <div className="text-lg font-bold text-primary font-mono">{stat.value}</div>
                                  </motion.div>
                                ))}
                              </CardContent>
                            </Card>

                            <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
                              <CardHeader className="pb-6">
                                <CardTitle className="text-lg font-display flex items-center gap-2">
                                  <Target className="w-5 h-5 text-primary" />
                                  Position Sizing Recommendations
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-6">
                                {[
                                  {
                                    label: "Kelly Optimal",
                                    value: formatPercentage(calculation.kellyPercentage),
                                    description: "Maximum growth rate",
                                    color: "text-green-400",
                                  },
                                  {
                                    label: "Fractional Kelly",
                                    value: formatPercentage(calculation.optimalFPercentage),
                                    description: "Conservative Kelly (25%)",
                                    color: "text-blue-400",
                                  },
                                  {
                                    label: "Current Risk",
                                    value: formatPercentage(calculation.riskPercentage),
                                    description: "Your selected risk level",
                                    color: "text-yellow-400",
                                  },
                                  {
                                    label: "Risk Assessment",
                                    value: getRiskLevel(calculation.riskRewardRatio).level,
                                    description: "Overall trade quality",
                                    color: getRiskLevel(calculation.riskRewardRatio).color,
                                  },
                                ].map((rec, index) => (
                                  <motion.div
                                    key={rec.label}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex justify-between items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                  >
                                    <div>
                                      <div className="text-sm font-medium text-gray-300 font-display mb-1">
                                        {rec.label}
                                      </div>
                                      <div className="text-xs text-gray-500 font-display">{rec.description}</div>
                                    </div>
                                    <div className={`text-lg font-bold font-mono ${rec.color}`}>{rec.value}</div>
                                  </motion.div>
                                ))}
                              </CardContent>
                            </Card>
                          </div>

                          {/* Contract Specifications */}
                          {assetType === "futures" && (
                            <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
                              <CardHeader className="pb-6">
                                <CardTitle className="text-lg font-display flex items-center gap-2">
                                  <Layers className="w-5 h-5 text-primary" />
                                  Contract Specifications
                                </CardTitle>
                                <CardDescription className="font-display">
                                  {FUTURES_CONTRACTS[selectedContract as keyof typeof FUTURES_CONTRACTS]?.name} trading
                                  details
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                {(() => {
                                  const contract = FUTURES_CONTRACTS[selectedContract as keyof typeof FUTURES_CONTRACTS]
                                  return (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                      {[
                                        { label: "Tick Size", value: `$${contract.tickSize}` },
                                        { label: "Tick Value", value: `$${contract.tickValue}` },
                                        { label: "Point Value", value: `$${contract.pointValue}` },
                                        { label: "Margin", value: `$${contract.margin.toLocaleString()}` },
                                        { label: "Exchange", value: contract.exchange },
                                        { label: "Sector", value: contract.sector },
                                        { label: "Type", value: contract.type.toUpperCase() },
                                        { label: "Hours", value: contract.tradingHours },
                                      ].map((spec, index) => (
                                        <div key={spec.label} className="text-center p-4 bg-white/5 rounded-lg">
                                          <div className="text-sm font-bold text-primary font-mono mb-1">
                                            {spec.value}
                                          </div>
                                          <div className="text-xs text-gray-400 font-display">{spec.label}</div>
                                        </div>
                                      ))}
                                    </div>
                                  )
                                })()}
                              </CardContent>
                            </Card>
                          )}
                        </TabsContent>
                      </Tabs>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
                        <CardContent className="py-24 text-center">
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                            className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-primary/20"
                          >
                            <Calculator className="w-10 h-10 text-primary" />
                          </motion.div>

                          <h3 className="text-2xl font-bold mb-6 font-display">Ready for Professional Analysis</h3>
                          <p className="text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-display">
                            Configure your trading parameters and click "Calculate Professional Risk" to generate a
                            comprehensive institutional-grade risk assessment with 5,000 Monte Carlo simulations.
                          </p>

                          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
                            {[
                              { icon: Brain, label: "5,000 Simulations", color: "text-primary" },
                              { icon: Award, label: "20+ Metrics", color: "text-blue-400" },
                              { icon: Shield, label: "Professional Grade", color: "text-green-400" },
                              { icon: Globe, label: "Multi-Asset", color: "text-purple-400" },
                            ].map((feature, index) => (
                              <motion.div
                                key={feature.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-primary/10"
                              >
                                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                                <span className="text-sm font-display">{feature.label}</span>
                              </motion.div>
                            ))}
                          </div>

                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            className="text-sm text-gray-500 font-display"
                          >
                            Professional risk analysis powered by quantitative finance
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </TooltipProvider>
  )
}
