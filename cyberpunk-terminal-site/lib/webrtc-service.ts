interface PeerConnection {
  id: string
  connection: RTCPeerConnection
  dataChannel?: RTCDataChannel
  stream?: MediaStream
}

export class WebRTCService {
  private peerConnections: Map<string, PeerConnection> = new Map()
  private localStream: MediaStream | null = null
  private onRemoteStream?: (stream: MediaStream, peerId: string) => void
  private onDataMessage?: (data: any, peerId: string) => void
  private onConnectionStateChange?: (state: string, peerId: string) => void

  private iceServers = [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }]

  constructor() {
    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    // WebSocket connection for signaling would be implemented here
    // For now, we'll use a mock signaling service
  }

  async initializeLocalStream(video = true, audio = true, screen = false) {
    try {
      if (screen) {
        this.localStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        })
      } else {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video,
          audio,
        })
      }

      return this.localStream
    } catch (error) {
      console.error("Error accessing media devices:", error)
      throw error
    }
  }

  async createPeerConnection(peerId: string, isInitiator = false) {
    const peerConnection = new RTCPeerConnection({
      iceServers: this.iceServers,
    })

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.localStream!)
      })
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams
      this.onRemoteStream?.(remoteStream, peerId)
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to remote peer via signaling
        this.sendSignalingMessage(peerId, {
          type: "ice-candidate",
          candidate: event.candidate,
        })
      }
    }

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      this.onConnectionStateChange?.(peerConnection.connectionState, peerId)
    }

    // Create data channel for text/data communication
    let dataChannel: RTCDataChannel
    if (isInitiator) {
      dataChannel = peerConnection.createDataChannel("collaboration", {
        ordered: true,
      })
    } else {
      peerConnection.ondatachannel = (event) => {
        dataChannel = event.channel
        this.setupDataChannel(dataChannel, peerId)
      }
    }

    if (dataChannel!) {
      this.setupDataChannel(dataChannel, peerId)
    }

    const connection: PeerConnection = {
      id: peerId,
      connection: peerConnection,
      dataChannel,
      stream: this.localStream || undefined,
    }

    this.peerConnections.set(peerId, connection)

    return connection
  }

  private setupDataChannel(dataChannel: RTCDataChannel, peerId: string) {
    dataChannel.onopen = () => {
      console.log(`Data channel opened with ${peerId}`)
    }

    dataChannel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.onDataMessage?.(data, peerId)
      } catch (error) {
        console.error("Error parsing data channel message:", error)
      }
    }

    dataChannel.onerror = (error) => {
      console.error("Data channel error:", error)
    }
  }

  async createOffer(peerId: string) {
    const peer = this.peerConnections.get(peerId)
    if (!peer) throw new Error("Peer connection not found")

    const offer = await peer.connection.createOffer()
    await peer.connection.setLocalDescription(offer)

    // Send offer via signaling
    this.sendSignalingMessage(peerId, {
      type: "offer",
      offer,
    })

    return offer
  }

  async createAnswer(peerId: string, offer: RTCSessionDescriptionInit) {
    const peer = this.peerConnections.get(peerId)
    if (!peer) throw new Error("Peer connection not found")

    await peer.connection.setRemoteDescription(offer)
    const answer = await peer.connection.createAnswer()
    await peer.connection.setLocalDescription(answer)

    // Send answer via signaling
    this.sendSignalingMessage(peerId, {
      type: "answer",
      answer,
    })

    return answer
  }

  async handleAnswer(peerId: string, answer: RTCSessionDescriptionInit) {
    const peer = this.peerConnections.get(peerId)
    if (!peer) throw new Error("Peer connection not found")

    await peer.connection.setRemoteDescription(answer)
  }

  async handleIceCandidate(peerId: string, candidate: RTCIceCandidateInit) {
    const peer = this.peerConnections.get(peerId)
    if (!peer) throw new Error("Peer connection not found")

    await peer.connection.addIceCandidate(candidate)
  }

  sendData(peerId: string, data: any) {
    const peer = this.peerConnections.get(peerId)
    if (peer?.dataChannel && peer.dataChannel.readyState === "open") {
      peer.dataChannel.send(JSON.stringify(data))
    }
  }

  broadcastData(data: any) {
    this.peerConnections.forEach((peer, peerId) => {
      this.sendData(peerId, data)
    })
  }

  private sendSignalingMessage(peerId: string, message: any) {
    // In a real implementation, this would send via WebSocket
    console.log("Signaling message:", { peerId, message })
  }

  closePeerConnection(peerId: string) {
    const peer = this.peerConnections.get(peerId)
    if (peer) {
      peer.connection.close()
      this.peerConnections.delete(peerId)
    }
  }

  closeAllConnections() {
    this.peerConnections.forEach((peer) => {
      peer.connection.close()
    })
    this.peerConnections.clear()

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }
  }

  setEventHandlers(handlers: {
    onRemoteStream?: (stream: MediaStream, peerId: string) => void
    onDataMessage?: (data: any, peerId: string) => void
    onConnectionStateChange?: (state: string, peerId: string) => void
  }) {
    this.onRemoteStream = handlers.onRemoteStream
    this.onDataMessage = handlers.onDataMessage
    this.onConnectionStateChange = handlers.onConnectionStateChange
  }
}

export const webrtcService = new WebRTCService()
