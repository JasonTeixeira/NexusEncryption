import type { Metadata } from "next"
import BacktestingPageClient from "@/components/backtesting-page-client"

export const metadata: Metadata = {
  title: "Backtesting | Nexural Trading - Validate Your Strategies",
  description:
    "Master the art of backtesting with our comprehensive guide. Learn methodologies, avoid pitfalls, and validate your quantitative trading strategies with confidence.",
  keywords:
    "backtesting, trading strategies, quantitative analysis, strategy validation, historical testing, trading performance",
}

export default function BacktestingPage() {
  return <BacktestingPageClient />
}
