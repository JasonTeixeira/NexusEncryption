"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTransition } from "@/contexts/transition-context"

interface Command {
  name: string
  description: string
  action: () => void
  category: string
}

interface TerminalCommandInterfaceProps {
  customCommands?: Command[]
  showPrompt?: boolean
  placeholder?: string
}

export default function TerminalCommandInterface({ 
  customCommands = [], 
  showPrompt = true,
  placeholder = "Type command to continue..."
}: TerminalCommandInterfaceProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<Command[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { navigateWithTransition } = useTransition()

  // Base navigation commands
  const baseCommands: Command[] = [
    {
      name: "home",
      description: "Navigate to home page",
      action: () => navigateWithTransition("/", "HOME"),
      category: "navigation"
    },
    {
      name: "about",
      description: "View professional background",
      action: () => navigateWithTransition("/about", "ABOUT"),
      category: "navigation"
    },
    {
      name: "projects",
      description: "Explore project portfolio",
      action: () => navigateWithTransition("/projects", "PROJECTS"),
      category: "navigation"
    },
    {
      name: "skills",
      description: "View technical skills matrix",
      action: () => navigateWithTransition("/skills", "SKILLS"),
      category: "navigation"
    },
    {
      name: "contact",
      description: "Get in touch",
      action: () => navigateWithTransition("/contact", "CONTACT"),
      category: "navigation"
    },
    {
      name: "dashboards",
      description: "Access data dashboards",
      action: () => navigateWithTransition("/dashboards", "DASHBOARDS"),
      category: "navigation"
    },
    {
      name: "blog",
      description: "Read technical articles",
      action: () => navigateWithTransition("/blog", "BLOG"),
      category: "navigation"
    },
    {
      name: "clear",
      description: "Clear terminal screen",
      action: () => {
        setInput("")
        setHistory([])
      },
      category: "system"
    },
    {
      name: "help",
      description: "Show available commands",
      action: () => {
        console.log("Available commands:", [...baseCommands, ...customCommands])
      },
      category: "system"
    }
  ]

  const allCommands = [...baseCommands, ...customCommands]

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Handle input changes and suggestions
  useEffect(() => {
    if (input.trim()) {
      const filtered = allCommands.filter(cmd => 
        cmd.name.toLowerCase().includes(input.toLowerCase()) ||
        cmd.description.toLowerCase().includes(input.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [input, allCommands])

  const executeCommand = (commandName: string) => {
    const command = allCommands.find(cmd => cmd.name.toLowerCase() === commandName.toLowerCase())
    
    if (command) {
      command.action()
      setHistory(prev => [...prev, commandName])
      setInput("")
      setShowSuggestions(false)
    } else {
      console.log(`Command not found: ${commandName}`)
      setHistory(prev => [...prev, `${commandName} (not found)`])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        if (input.trim()) {
          executeCommand(input.trim())
        }
        break
        
      case 'Tab':
        e.preventDefault()
        if (suggestions.length > 0) {
          setInput(suggestions[0].name)
          setShowSuggestions(false)
        }
        break
        
      case 'ArrowUp':
        e.preventDefault()
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1
          setHistoryIndex(newIndex)
          setInput(history[history.length - 1 - newIndex] || "")
        }
        break
        
      case 'ArrowDown':
        e.preventDefault()
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1
          setHistoryIndex(newIndex)
          setInput(history[history.length - 1 - newIndex] || "")
        } else if (historyIndex === 0) {
          setHistoryIndex(-1)
          setInput("")
        }
        break
        
      case 'Escape':
        setShowSuggestions(false)
        setInput("")
        break
    }
  }

  const handleSuggestionClick = (command: Command) => {
    setInput(command.name)
    setShowSuggestions(false)
    executeCommand(command.name)
  }

  return (
    <div className="relative">
      {/* Command Input */}
      {showPrompt && (
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-green-400 font-bold">$</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full bg-transparent border-2 border-green-500/30 rounded px-3 py-2 text-green-400 placeholder-gray-500 focus:border-green-500 focus:outline-none terminal-glow"
              autoComplete="off"
            />
            
            {/* Cursor */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-green-400 animate-pulse">|</span>
            </div>
          </div>
        </div>
      )}

      {/* Command Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-900/95 backdrop-blur-sm border border-green-500/30 rounded-lg shadow-2xl">
          <div className="p-2">
            <div className="text-xs text-gray-400 mb-2 px-2">Suggestions:</div>
            {suggestions.map((command, index) => (
              <button
                key={command.name}
                onClick={() => handleSuggestionClick(command)}
                className="w-full text-left px-3 py-2 rounded hover:bg-green-500/10 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-green-400 font-mono">{command.name}</span>
                    <span className="text-gray-400 text-sm ml-2">{command.description}</span>
                  </div>
                  <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {command.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Help Text */}
          <div className="border-t border-green-500/20 px-3 py-2 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>TAB: autocomplete</span>
              <span>↑↓: history</span>
              <span>ESC: cancel</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Commands */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {allCommands.filter(cmd => cmd.category === 'navigation').slice(0, 8).map((command) => (
          <button
            key={command.name}
            onClick={() => executeCommand(command.name)}
            className="cyber-button px-3 py-2 rounded text-sm transition-all duration-300 hover:scale-105"
          >
            {command.name}
          </button>
        ))}
      </div>
    </div>
  )
}
