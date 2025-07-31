"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Github, Twitter, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    platform: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Trading Bots", href: "/bots" },
      { name: "Indicators", href: "/indicators" },
      { name: "Strategy Lab", href: "/strategy-lab" },
      { name: "Risk Calculator", href: "/risk-calculator" },
      { name: "Backtesting", href: "/backtesting" },
    ],
    resources: [
      { name: "Blog", href: "/blog" },
      { name: "Training", href: "/training" },
      { name: "Glossary", href: "/glossary" },
      { name: "Q&A", href: "/qa" },
      { name: "About", href: "/about" },
      { name: "Pricing", href: "/pricing" },
    ],
    legal: [
      { name: "Terms of Service", href: "/legal#terms" },
      { name: "Privacy Policy", href: "/legal#privacy" },
      { name: "Risk Disclosure", href: "/legal#risk" },
      { name: "Compliance", href: "/legal#compliance" },
    ],
    company: [
      { name: "Careers", href: "/jobs" },
      { name: "Contact", href: "/contact" },
      { name: "Press Kit", href: "/about#press" },
      { name: "Partners", href: "/about#partners" },
    ],
  }

  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/nexural", icon: Twitter },
    { name: "LinkedIn", href: "https://linkedin.com/company/nexural", icon: Linkedin },
    { name: "GitHub", href: "https://github.com/nexural", icon: Github },
    { name: "Email", href: "mailto:contact@nexural.com", icon: Mail },
  ]

  return (
    <footer className="relative bg-black border-t border-primary/20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,255,102,0.03)_0%,transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="font-display text-3xl font-bold text-primary">NEXURAL</div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Advanced quantitative trading platform powered by artificial intelligence. Democratizing
                institutional-grade trading strategies for retail traders worldwide.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>New York, NY • London, UK</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>contact@nexural.com</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Platform Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-display text-lg font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm font-display"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-display text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm font-display"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-display text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm font-display"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-display text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm font-display"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Social Links & Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-primary/20 pt-8 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <span className="text-gray-400 text-sm font-display">Follow us:</span>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/5 border border-primary/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm font-display">Stay updated:</span>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-white/5 border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/40 focus:bg-white/10 transition-all text-sm font-display"
                />
                <button className="px-6 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors text-sm font-display">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="border-t border-primary/20 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm font-display">© {currentYear} NEXURAL. All rights reserved.</div>
            <div className="flex items-center gap-6 text-xs text-gray-500 font-display">
              <span>🔒 SSL Secured</span>
              <span>⚡ 99.9% Uptime</span>
              <span>🛡️ SOC 2 Compliant</span>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg"
        >
          <p className="text-xs text-gray-400 leading-relaxed font-display">
            <strong className="text-yellow-400">Risk Disclaimer:</strong> Trading futures and forex involves substantial
            risk of loss and is not suitable for all investors. Past performance is not indicative of future results.
            The high degree of leverage can work against you as well as for you. Before deciding to trade foreign
            exchange or futures, you should carefully consider your investment objectives, level of experience, and risk
            appetite. NEXURAL provides educational and analytical tools only and does not provide investment advice.
          </p>
        </motion.div>
      </div>

      {/* Floating Elements */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/10 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </footer>
  )
}
