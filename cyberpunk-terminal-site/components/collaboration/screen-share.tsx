"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { webrtcService } from "@/lib/webrtc-service"

export function ScreenShare() {
  const [isSharing, setIsSharing] = useState(false)
  const [isReceiving, setIsReceiving] = useState(false)
  const [connectedPeers, setConnectedPeers] = useState<string[]>([])
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const startScreenShare = async () => {
    try {
      const stream = await webrtcService.initializeLocalStream(false, true, true)

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      setIsSharing(true)

      // Set up WebRTC event handlers
      webrtcService.setEventHandlers({
        onRemoteStream: (stream, peerId) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream
            setIsReceiving(true)
          }
        },
        onConnectionStateChange: (state, peerId) => {
          if (state === "connected") {
            setConnectedPeers((prev) => [...prev.filter((id) => id !== peerId), peerId])
          } else if (state === "disconnected") {
            setConnectedPeers((prev) => prev.filter((id) => id !== peerId))
          }
        },
      })
    } catch (error) {
      console.error("Error starting screen share:", error)
    }
  }

  const stopScreenShare = () => {
    webrtcService.closeAllConnections()
    setIsSharing(false)
    setIsReceiving(false)
    setConnectedPeers([])

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
  }

  return (
    <div className="bg-black/95 border border-cyan-500/50 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <span className="text-cyan-400 font-mono text-sm">Screen Share</span>
          {connectedPeers.length > 0 && (
            <span className="text-green-400 text-xs">({connectedPeers.length} connected)</span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={isSharing ? stopScreenShare : startScreenShare}
            className={`text-xs px-3 py-1 ${
              isSharing
                ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                : "bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30"
            }`}
          >
            {isSharing ? "Stop Sharing" : "Share Screen"}
          </Button>
        </div>
      </div>

      {/* Video Streams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Local Stream */}
        {isSharing && (
          <div className="space-y-2">
            <div className="text-cyan-400 text-xs">Your Screen</div>
            <div className="border border-cyan-500/30 rounded overflow-hidden bg-black">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="w-full h-64 object-contain"
                style={{ backgroundColor: "#000" }}
              />
            </div>
          </div>
        )}

        {/* Remote Stream */}
        {isReceiving && (
          <div className="space-y-2">
            <div className="text-green-400 text-xs">Remote Screen</div>
            <div className="border border-green-500/30 rounded overflow-hidden bg-black">
              <video
                ref={remoteVideoRef}
                autoPlay
                className="w-full h-64 object-contain"
                style={{ backgroundColor: "#000" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      {!isSharing && !isReceiving && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-sm mb-4">No active screen sharing session</div>
          <div className="text-gray-600 text-xs">
            Click "Share Screen" to start sharing your screen with collaborators
          </div>
        </div>
      )}

      {/* Connection Status */}
      {connectedPeers.length > 0 && (
        <div className="mt-4 p-3 bg-gray-900/50 border border-gray-700/50 rounded">
          <div className="text-cyan-400 text-xs mb-2">Connected Peers:</div>
          <div className="space-y-1">
            {connectedPeers.map((peerId) => (
              <div key={peerId} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300 text-xs font-mono">Peer {peerId.slice(0, 8)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
