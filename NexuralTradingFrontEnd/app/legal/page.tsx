import LegalPageClient from "@/components/legal-page-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Legal Disclaimer - Nexural Trading",
  description:
    "Terms of Service, Complete Risk Disclosure, and legal information for Nexural Trading services and products.",
}

export default function LegalPage() {
  return <LegalPageClient />
}
