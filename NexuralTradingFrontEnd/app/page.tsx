import FeaturesGrid from "@/components/FeaturesGrid"
import HeroSection from "@/components/HeroSection"
import IndicatorsSection from "@/components/IndicatorsSection"
import IntegrationsSection from "@/components/IntegrationsSection"
import NewsletterSection from "@/components/NewsletterSection"
import PartnersSection from "@/components/PartnersSection"
import PerformanceDashboard from "@/components/PerformanceDashboard"
import PricingSection from "@/components/PricingSection"
import RoadmapSection from "@/components/RoadmapSection"
import TradingBotsSection from "@/components/TradingBotsSection"
import WhatIsNexural from "@/components/WhatIsNexural"

export default function Home() {
  return (
    <>
      <HeroSection />
      <WhatIsNexural />
      <FeaturesGrid />
      <PerformanceDashboard />
      <IndicatorsSection />
      <TradingBotsSection />
      <IntegrationsSection />
      <RoadmapSection />
      <PricingSection />
      <PartnersSection />
      <NewsletterSection />
    </>
  )
}
