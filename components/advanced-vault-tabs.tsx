"use client"

import { useState, useEffect } from "react"
import { AdvancedVaultManager, type SecureNote, type BreachAlert } from "../lib/advanced-vault-features"
import { Shield, FileText, AlertTriangle, BarChart3 } from "lucide-react"

export const SecureNotesTab = () => {
  const [notes, setNotes] = useState<SecureNote[]>([])
  const [isAddingNote, setIsAddingNote] = useState(false)
  const vaultManager = AdvancedVaultManager.getInstance()

  useEffect(() => {
    setNotes(vaultManager.getSecureNotes())
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Secure Notes
        </h2>
        <button
          onClick={() => setIsAddingNote(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Add Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">{note.title}</h3>
              {note.encrypted && <Shield className="h-4 w-4 text-green-400" />}
            </div>
            <p className="text-sm text-gray-400 mb-2">{note.category}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {note.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500">Modified: {note.lastModified.toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export const BreachMonitoringTab = () => {
  const [alerts, setAlerts] = useState<BreachAlert[]>([])
  const vaultManager = AdvancedVaultManager.getInstance()

  useEffect(() => {
    setAlerts(vaultManager.getBreachAlerts())
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500 bg-red-500/10"
      case "high":
        return "text-orange-500 bg-orange-500/10"
      case "medium":
        return "text-yellow-500 bg-yellow-500/10"
      default:
        return "text-blue-500 bg-blue-500/10"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          Breach Monitoring
        </h2>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          Scan Now
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div>
                  <h3 className="font-semibold text-white">Password Breach Detected</h3>
                  <p className="text-sm text-gray-400">Source: {alert.breachSource}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </span>
                {!alert.resolved && (
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                    Resolve
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Detected: {alert.detectedAt.toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export const SecurityReportTab = () => {
  const [report, setReport] = useState<any>(null)
  const vaultManager = AdvancedVaultManager.getInstance()

  useEffect(() => {
    vaultManager.generateSecurityReport().then(setReport)
  }, [])

  if (!report) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <BarChart3 className="h-6 w-6" />
        Security Report
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Password Health</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Strong:</span>
              <span className="text-green-400">{report.strongPasswords}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Weak:</span>
              <span className="text-red-400">{report.weakPasswords}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duplicates:</span>
              <span className="text-yellow-400">{report.duplicatePasswords}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Security Issues</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Breached:</span>
              <span className="text-red-400">{report.breachedPasswords}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Old Passwords:</span>
              <span className="text-orange-400">{report.oldPasswords}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Shared:</span>
              <span className="text-blue-400">{report.sharedPasswords}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Recommendations</h3>
          <ul className="space-y-1">
            {report.recommendations.map((rec: string, index: number) => (
              <li key={index} className="text-sm text-gray-400">
                • {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
