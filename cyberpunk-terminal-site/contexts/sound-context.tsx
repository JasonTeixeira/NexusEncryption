"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react"

interface SoundContextType {
  isMuted: boolean
  toggleMute: () => void
  playTyping: () => void
  playCommand: () => void
  playSuccess: () => void
  playError: () => void
  playTransition: () => void
  playBootSequence: () => void
  playNavigation: () => void
  playHover: () => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
    }

    // Initialize on first user interaction
    const handleFirstInteraction = () => {
      initAudio()
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)
    }

    document.addEventListener("click", handleFirstInteraction)
    document.addEventListener("keydown", handleFirstInteraction)

    return () => {
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)
    }
  }, [])

  const generateTypingSound = useCallback(() => {
    if (!audioContextRef.current || isMuted) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime)
    oscillator.type = "sawtooth"

    filter.type = "lowpass"
    filter.frequency.setValueAtTime(1200, ctx.currentTime)

    gainNode.gain.setValueAtTime(0.12, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.08)
  }, [isMuted])

  const generateCommandSound = useCallback(() => {
    if (!audioContextRef.current || isMuted) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(200, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15)
    oscillator.type = "sawtooth"

    filter.type = "lowpass"
    filter.frequency.setValueAtTime(800, ctx.currentTime)

    gainNode.gain.setValueAtTime(0.18, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.15)
  }, [isMuted])

  const generateSuccessSound = useCallback(() => {
    if (!audioContextRef.current || isMuted) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(300, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.1)
    oscillator.type = "triangle"

    filter.type = "lowpass"
    filter.frequency.setValueAtTime(1000, ctx.currentTime)

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.2)
  }, [isMuted])

  const generateErrorSound = useCallback(() => {
    if (!audioContextRef.current || isMuted) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(120, ctx.currentTime)
    oscillator.frequency.setValueAtTime(180, ctx.currentTime + 0.05)
    oscillator.frequency.setValueAtTime(100, ctx.currentTime + 0.1)
    oscillator.type = "sawtooth"

    filter.type = "lowpass"
    filter.frequency.setValueAtTime(600, ctx.currentTime)

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.25)
  }, [isMuted])

  const generateTransitionSound = useCallback(() => {
    if (!audioContextRef.current || isMuted) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4)
    oscillator.type = "sawtooth"

    filter.type = "lowpass"
    filter.frequency.setValueAtTime(1500, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.4)

    gainNode.gain.setValueAtTime(0.12, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.4)
  }, [isMuted])

  const generateBootSound = useCallback(() => {
    if (!audioContextRef.current || isMuted) return

    const ctx = audioContextRef.current

    const frequencies = [250, 200, 150]
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      oscillator.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.2)
      oscillator.type = "sawtooth"

      filter.type = "lowpass"
      filter.frequency.setValueAtTime(800, ctx.currentTime + index * 0.2)

      gainNode.gain.setValueAtTime(0.12, ctx.currentTime + index * 0.2)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.2 + 0.15)

      oscillator.start(ctx.currentTime + index * 0.2)
      oscillator.stop(ctx.currentTime + index * 0.2 + 0.15)
    })
  }, [isMuted])

  const generateNavigationSound = useCallback(() => {
    if (!audioContextRef.current || isMuted) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(400, ctx.currentTime)
    oscillator.type = "triangle"

    filter.type = "lowpass"
    filter.frequency.setValueAtTime(800, ctx.currentTime)

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.06)
  }, [isMuted])

  const generateHoverSound = useCallback(() => {
    if (!audioContextRef.current || isMuted) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(600, ctx.currentTime)
    oscillator.type = "sawtooth"

    filter.type = "lowpass"
    filter.frequency.setValueAtTime(1000, ctx.currentTime)

    gainNode.gain.setValueAtTime(0.04, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.05)
  }, [isMuted])

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const value: SoundContextType = {
    isMuted,
    toggleMute,
    playTyping: generateTypingSound,
    playCommand: generateCommandSound,
    playSuccess: generateSuccessSound,
    playError: generateErrorSound,
    playTransition: generateTransitionSound,
    playBootSequence: generateBootSound,
    playNavigation: generateNavigationSound,
    playHover: generateHoverSound,
  }

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider")
  }
  return context
}

export const useSoundContext = useSound
