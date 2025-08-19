"use client"

import { useState, useEffect } from "react"
import { Users, Heart, Share, MessageCircle, TrendingUp, Eye } from "lucide-react"

interface SocialPost {
  id: string
  platform: "twitter" | "instagram" | "facebook" | "linkedin" | "tiktok"
  content: string
  likes: number
  shares: number
  comments: number
  reach: number
  engagement: number
  date: string
  hashtags: string[]
}

export default function SocialAnalyticsDashboard() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null)
  const [metrics, setMetrics] = useState({
    totalPosts: 0,
    totalReach: 0,
    totalEngagement: 0,
    engagementRate: 0,
    topPlatform: "",
    followers: 0,
  })

  useEffect(() => {
    const generatePosts = (): SocialPost[] => {
      const platforms = ["twitter", "instagram", "facebook", "linkedin", "tiktok"] as const
      const hashtags = ["#tech", "#coding", "#webdev", "#ai", "#startup", "#design", "#innovation"]

      return Array.from({ length: 12 }, (_, i) => {
        const platform = platforms[Math.floor(Math.random() * platforms.length)]
        const likes = Math.floor(Math.random() * 1000) + 10
        const shares = Math.floor(Math.random() * 200) + 5
        const comments = Math.floor(Math.random() * 100) + 2
        const reach = Math.floor(Math.random() * 5000) + 100
        const engagement = likes + shares + comments

        return {
          id: `post-${i + 1}`,
          platform,
          content: `Sample post content for ${platform} #${i + 1}. This is a mock post to demonstrate social media analytics.`,
          likes,
          shares,
          comments,
          reach,
          engagement,
          date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          hashtags: hashtags.slice(0, Math.floor(Math.random() * 3) + 1),
        }
      })
    }

    const updateData = () => {
      const newPosts = generatePosts()
      setPosts(newPosts)

      const totalReach = newPosts.reduce((acc, post) => acc + post.reach, 0)
      const totalEngagement = newPosts.reduce((acc, post) => acc + post.engagement, 0)
      const engagementRate = totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0

      // Calculate top platform
      const platformStats = newPosts.reduce((acc: any, post) => {
        if (!acc[post.platform]) acc[post.platform] = 0
        acc[post.platform] += post.engagement
        return acc
      }, {})

      const topPlatform = Object.entries(platformStats).reduce((a: any, b: any) =>
        platformStats[a[0]] > platformStats[b[0]] ? a : b,
      )[0]

      setMetrics({
        totalPosts: newPosts.length,
        totalReach,
        totalEngagement,
        engagementRate,
        topPlatform,
        followers: Math.floor(Math.random() * 10000) + 5000,
      })
    }

    updateData()
    const interval = setInterval(updateData, 4000)
    return () => clearInterval(interval)
  }, [])

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "text-blue-400 border-blue-400/30 bg-blue-400/5"
      case "instagram":
        return "text-pink-400 border-pink-400/30 bg-pink-400/5"
      case "facebook":
        return "text-blue-600 border-blue-600/30 bg-blue-600/5"
      case "linkedin":
        return "text-blue-500 border-blue-500/30 bg-blue-500/5"
      case "tiktok":
        return "text-purple-400 border-purple-400/30 bg-purple-400/5"
      default:
        return "text-gray-400 border-gray-400/30 bg-gray-400/5"
    }
  }

  const getPlatformIcon = (platform: string) => {
    // Using generic icons since we don't have platform-specific ones
    return <Users className="w-4 h-4" />
  }

  return (
    <div className="p-6 bg-gray-950 text-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="text-gray-400 text-sm mb-6">
          <div>$ social-analytics --platforms --engagement --real-time</div>
          <div className="text-pink-400">
            social@nexus:~/analytics$ monitoring {metrics.totalPosts} posts across 5 platforms
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div className="p-4 bg-pink-400/5 border border-pink-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-pink-400" />
            <span className="text-xs text-pink-400 font-mono">FOLLOWERS</span>
          </div>
          <div className="text-2xl font-bold text-pink-400">{metrics.followers.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Followers</div>
        </div>

        <div className="p-4 bg-blue-400/5 border border-blue-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-6 h-6 text-blue-400" />
            <span className="text-xs text-blue-400 font-mono">REACH</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{metrics.totalReach.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Reach</div>
        </div>

        <div className="p-4 bg-green-400/5 border border-green-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-6 h-6 text-green-400" />
            <span className="text-xs text-green-400 font-mono">ENGAGEMENT</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{metrics.totalEngagement.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Engagement</div>
        </div>

        <div className="p-4 bg-purple-400/5 border border-purple-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <span className="text-xs text-purple-400 font-mono">RATE</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{metrics.engagementRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-400">Engagement Rate</div>
        </div>

        <div className="p-4 bg-cyan-400/5 border border-cyan-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Share className="w-6 h-6 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-mono">POSTS</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400">{metrics.totalPosts}</div>
          <div className="text-sm text-gray-400">Total Posts</div>
        </div>

        <div className="p-4 bg-yellow-400/5 border border-yellow-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-yellow-400" />
            <span className="text-xs text-yellow-400 font-mono">TOP</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400 capitalize">{metrics.topPlatform}</div>
          <div className="text-sm text-gray-400">Best Platform</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts List */}
        <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-cyan-400 mb-4">Recent Posts</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {posts.map((post) => (
              <div
                key={post.id}
                className={`p-3 rounded border cursor-pointer transition-all hover:scale-[1.02] ${getPlatformColor(post.platform)}`}
                onClick={() => setSelectedPost(post)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(post.platform)}
                    <span className="text-xs font-mono capitalize">{post.platform}</span>
                  </div>
                  <span className="text-xs font-mono">{post.date}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2 line-clamp-2">{post.content}</p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share className="w-3 h-3" />
                      {post.shares}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.comments}
                    </span>
                  </div>
                  <span className="text-gray-400">Reach: {post.reach.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Post Details */}
        <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-cyan-400 mb-4">Post Analytics</h3>
          {selectedPost ? (
            <div className="space-y-4">
              <div className={`p-3 rounded border ${getPlatformColor(selectedPost.platform)}`}>
                <div className="flex items-center gap-2 mb-2">
                  {getPlatformIcon(selectedPost.platform)}
                  <span className="font-mono text-sm capitalize">{selectedPost.platform}</span>
                  <span className="text-xs text-gray-400">• {selectedPost.date}</span>
                </div>
                <p className="text-sm text-gray-300 mb-3">{selectedPost.content}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {selectedPost.hashtags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-800 px-2 py-1 rounded text-cyan-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-red-400/5 border border-red-400/30 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400">Likes</span>
                  </div>
                  <div className="text-xl font-bold">{selectedPost.likes.toLocaleString()}</div>
                </div>

                <div className="p-3 bg-blue-400/5 border border-blue-400/30 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Share className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-blue-400">Shares</span>
                  </div>
                  <div className="text-xl font-bold">{selectedPost.shares.toLocaleString()}</div>
                </div>

                <div className="p-3 bg-green-400/5 border border-green-400/30 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">Comments</span>
                  </div>
                  <div className="text-xl font-bold">{selectedPost.comments.toLocaleString()}</div>
                </div>

                <div className="p-3 bg-purple-400/5 border border-purple-400/30 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-400">Reach</span>
                  </div>
                  <div className="text-xl font-bold">{selectedPost.reach.toLocaleString()}</div>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded border border-gray-600/30">
                <h5 className="font-bold text-green-400 mb-2">Performance Metrics</h5>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Engagement Rate:</span>
                    <span className="text-green-400">
                      {((selectedPost.engagement / selectedPost.reach) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Engagement:</span>
                    <span className="text-green-400">{selectedPost.engagement.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform:</span>
                    <span className="text-green-400 capitalize">{selectedPost.platform}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a post to view detailed analytics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
