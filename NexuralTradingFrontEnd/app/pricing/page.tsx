import type { Metadata } from "next"
import PricingPageClient from "@/components/pricing-page-client"

export const metadata: Metadata = {
  title: "Pricing - Choose Your Trading Edge | Nexural Trading",
  description:
    "Flexible pricing plans designed for every type of quantitative trader. From free community access to full automation solutions.",
}

export default function PricingPage() {
  return <PricingPageClient />
}
