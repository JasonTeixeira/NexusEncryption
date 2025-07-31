"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { submitContactForm } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Users,
  Zap,
  Globe,
  Headphones,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  })

  // Real-time validation
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required"
        if (value.trim().length < 2) return "Name must be at least 2 characters"
        break
      case "email":
        if (!value.trim()) return "Email is required"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return "Please enter a valid email address"
        break
      case "subject":
        if (!value.trim()) return "Subject is required"
        break
      case "message":
        if (!value.trim()) return "Message is required"
        if (value.trim().length < 10) return "Message must be at least 10 characters"
        break
    }
    return undefined
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    // Real-time validation
    const error = validateField(name, value)
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    newErrors.name = validateField("name", formData.name)
    newErrors.email = validateField("email", formData.email)
    newErrors.subject = validateField("subject", formData.subject)
    newErrors.message = validateField("message", formData.message)

    // Remove undefined errors
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key as keyof FormErrors]) {
        delete newErrors[key as keyof FormErrors]
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const formDataObj = new FormData()
      formDataObj.append("name", formData.name)
      formDataObj.append("email", formData.email)
      formDataObj.append("company", formData.company)
      formDataObj.append("subject", formData.subject)
      formDataObj.append("message", formData.message)

      await submitContactForm(formDataObj)
      setSubmitStatus("success")

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,136,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />

        {/* Floating particles */}
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
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-blue-400">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Ready to revolutionize your trading? Our team of experts is here to help you navigate the world of
            quantitative finance and AI-powered trading solutions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-gray-900/50 border-primary/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <MessageSquare className="w-6 h-6 mr-3 text-primary" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submitStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-400 mb-6">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button
                      onClick={() => setSubmitStatus("idle")}
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-gray-300 mb-2 block">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className={`bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-primary transition-colors ${
                            errors.name ? "border-red-500 focus:border-red-500" : ""
                          }`}
                          placeholder="John Doe"
                          aria-describedby={errors.name ? "name-error" : undefined}
                          aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            id="name-error"
                            className="text-red-400 text-sm mt-1 flex items-center"
                            role="alert"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.name}
                          </motion.p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-300 mb-2 block">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={`bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-primary transition-colors ${
                            errors.email ? "border-red-500 focus:border-red-500" : ""
                          }`}
                          placeholder="john@example.com"
                          aria-describedby={errors.email ? "email-error" : undefined}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            id="email-error"
                            className="text-red-400 text-sm mt-1 flex items-center"
                            role="alert"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.email}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="company" className="text-gray-300 mb-2 block">
                          Company
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-primary transition-colors"
                          placeholder="Your Company"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject" className="text-gray-300 mb-2 block">
                          Subject *
                        </Label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          className={`w-full bg-gray-800/50 border border-gray-700 text-white rounded-md px-3 py-2 focus:border-primary focus:outline-none transition-colors ${
                            errors.subject ? "border-red-500 focus:border-red-500" : ""
                          }`}
                          aria-describedby={errors.subject ? "subject-error" : undefined}
                          aria-invalid={!!errors.subject}
                        >
                          <option value="">Select a topic</option>
                          <option value="general">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="sales">Sales & Pricing</option>
                          <option value="partnership">Partnership</option>
                          <option value="media">Media & Press</option>
                        </select>
                        {errors.subject && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            id="subject-error"
                            className="text-red-400 text-sm mt-1 flex items-center"
                            role="alert"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.subject}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-gray-300 mb-2 block">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className={`bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-primary resize-none transition-colors ${
                          errors.message ? "border-red-500 focus:border-red-500" : ""
                        }`}
                        placeholder="Tell us about your project, questions, or how we can help..."
                        aria-describedby={errors.message ? "message-error" : undefined}
                        aria-invalid={!!errors.message}
                      />
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          id="message-error"
                          className="text-red-400 text-sm mt-1 flex items-center"
                          role="alert"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.message}
                        </motion.p>
                      )}
                      <p className="text-gray-500 text-sm mt-1">{formData.message.length}/500 characters</p>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || Object.keys(errors).length > 0}
                      className="w-full bg-primary text-black hover:bg-primary/90 font-semibold py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending Message...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </div>
                      )}
                    </Button>

                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center"
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-red-400 font-medium">Failed to send message</p>
                          <p className="text-red-300 text-sm">
                            Please try again or contact us directly at support@nexural.trading
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <Card className="bg-gray-900/50 border-primary/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Email</h4>
                    <a
                      href="mailto:support@nexural.trading"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      support@nexural.trading
                    </a>
                    <br />
                    <a
                      href="mailto:partnerships@nexural.trading"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      partnerships@nexural.trading
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Phone</h4>
                    <a href="tel:+15551234567" className="text-gray-400 hover:text-primary transition-colors">
                      +1 (555) 123-4567
                    </a>
                    <p className="text-gray-500 text-sm">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Address</h4>
                    <address className="text-gray-400 not-italic">
                      123 Financial District
                      <br />
                      New York, NY 10004
                      <br />
                      United States
                    </address>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Business Hours</h4>
                    <p className="text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                    <p className="text-gray-400">Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Options */}
            <Card className="bg-gray-900/50 border-primary/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white">Support Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <Headphones className="w-5 h-5 text-primary" />
                    <span className="text-white">Live Chat</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Online</Badge>
                </motion.div>

                <motion.div
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-white">Community Forum</span>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400">24/7</Badge>
                </motion.div>

                <motion.div
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="text-white">Knowledge Base</span>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-400">Self-Service</Badge>
                </motion.div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    <Zap className="w-12 h-12 text-primary mx-auto" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white">Fast Response</h3>
                  <p className="text-gray-400">Average response time under 2 hours</p>
                  <div className="flex justify-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">98%</div>
                      <div className="text-gray-500">Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">24/7</div>
                      <div className="text-gray-500">Support</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
