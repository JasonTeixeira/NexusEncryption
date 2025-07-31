"use client"

import type React from "react"

import { useState, useMemo, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import type { Post } from "@/lib/blog-data"
import {
  Search,
  Tag,
  Calendar,
  Clock,
  TrendingUp,
  Grid3X3,
  List,
  Share2,
  Bookmark,
  Eye,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Activity,
  Users,
  MessageCircle,
  Heart,
  Filter,
  Play,
  Pause,
  Star,
  Award,
  Flame,
  BookOpen,
  Coffee,
  Brain,
  Mail,
  ChevronDown,
  Rocket,
  TrendingDown,
  Layers,
  LineChart,
  Settings,
  ThumbsUp,
  Share,
  ExternalLink,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// Advanced Trading Data Visualization Component
const TradingDataViz = () => {
  const [activeMetric, setActiveMetric] = useState("volume")
  const [isAnimating, setIsAnimating] = useState(true)
  const [timeframe, setTimeframe] = useState("1D")

  const metrics = {
    volume: { value: 2847.3, change: 12.4, color: "text-green-400", unit: "M" },
    volatility: { value: 18.7, change: -3.2, color: "text-red-400", unit: "%" },
    sharpe: { value: 1.84, change: 5.1, color: "text-blue-400", unit: "" },
    drawdown: { value: -8.2, change: 2.3, color: "text-yellow-400", unit: "%" },
  }

  const chartData = Array.from({ length: 24 }, (_, i) => ({
    time: i,
    value: Math.random() * 100 + 50,
  }))

  return (
    <Card className="bg-gray-900/50 border-primary/20 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Live Market Metrics
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-16 h-8 bg-gray-800 border-gray-700 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1H">1H</SelectItem>
                <SelectItem value="1D">1D</SelectItem>
                <SelectItem value="1W">1W</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAnimating(!isAnimating)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(metrics).map(([key, data]) => (
            <motion.div
              key={key}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                activeMetric === key ? "border-primary bg-primary/10" : "border-gray-700 hover:border-gray-600"
              }`}
              onClick={() => setActiveMetric(key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-xs text-gray-400 uppercase tracking-wide">{key}</div>
              <div className={`text-lg font-bold ${data.color}`}>
                {data.value}
                {data.unit}
              </div>
              <div className={`text-xs flex items-center ${data.change > 0 ? "text-green-400" : "text-red-400"}`}>
                {data.change > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {Math.abs(data.change)}%
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mini Chart */}
        <div className="h-24 bg-gray-800/50 rounded-lg relative overflow-hidden">
          <svg className="w-full h-full">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(0, 255, 136)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(0, 255, 136)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={`M 0,${96 - chartData[0].value * 0.4} ${chartData
                .map((point, i) => `L ${(i / (chartData.length - 1)) * 100}%,${96 - point.value * 0.4}`)
                .join(" ")}`}
              fill="none"
              stroke="rgb(0, 255, 136)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isAnimating ? 1 : 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d={`M 0,${96 - chartData[0].value * 0.4} ${chartData
                .map((point, i) => `L ${(i / (chartData.length - 1)) * 100}%,${96 - point.value * 0.4}`)
                .join(" ")} L 100%,96 L 0,96 Z`}
              fill="url(#chartGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: isAnimating ? 1 : 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
          <div className="absolute top-2 right-2 text-xs text-gray-400">{activeMetric.toUpperCase()}</div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: 2 min ago</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Personalized Recommendations Component
const PersonalizedRecommendations = ({ posts }: { posts: Post[] }) => {
  const [userPreferences, setUserPreferences] = useState({
    experience: "intermediate",
    interests: ["momentum", "risk-management", "volatility"],
    readingTime: 5,
    contentType: "all",
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const recommendedPosts = useMemo(() => {
    return posts
      .filter((post) =>
        userPreferences.interests.some(
          (interest) => post.title.toLowerCase().includes(interest) || post.excerpt.toLowerCase().includes(interest),
        ),
      )
      .slice(0, 4)
  }, [posts, userPreferences])

  const interestOptions = [
    "momentum",
    "risk-management",
    "volatility",
    "machine-learning",
    "backtesting",
    "options",
    "crypto",
    "forex",
  ]

  return (
    <Card className="bg-gray-900/50 border-primary/20 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            For You
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pb-4 border-b border-gray-700"
            >
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Experience Level</label>
                <Select
                  value={userPreferences.experience}
                  onValueChange={(value) => setUserPreferences((prev) => ({ ...prev, experience: value }))}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <Button
                      key={interest}
                      variant={userPreferences.interests.includes(interest) ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setUserPreferences((prev) => ({
                          ...prev,
                          interests: prev.interests.includes(interest)
                            ? prev.interests.filter((i) => i !== interest)
                            : [...prev.interests, interest],
                        }))
                      }
                      className={`text-xs rounded-full ${
                        userPreferences.interests.includes(interest)
                          ? "bg-primary text-black"
                          : "border-gray-700 text-gray-400"
                      }`}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Reading Time: {userPreferences.readingTime} min
                </label>
                <Slider
                  value={[userPreferences.readingTime]}
                  onValueChange={(value) => setUserPreferences((prev) => ({ ...prev, readingTime: value[0] }))}
                  max={15}
                  min={2}
                  step={1}
                  className="w-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {recommendedPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={post.image || "/placeholder.svg?height=64&width=64"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{Math.floor(Math.random() * 3) + 3} min read</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{post.author.name}</span>
                      <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">
                        {Math.floor(Math.random() * 20) + 80}% match
                      </Badge>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10 bg-transparent">
          <Rocket className="w-4 h-4 mr-2" />
          Get More Recommendations
        </Button>
      </CardContent>
    </Card>
  )
}

// Real-time Activity Feed
const ActivityFeed = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "comment",
      user: "Alex Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      action: "commented on",
      target: "Understanding Market Volatility",
      time: "2m ago",
      isNew: true,
    },
    {
      id: 2,
      type: "like",
      user: "Sarah Kim",
      avatar: "/placeholder.svg?height=32&width=32",
      action: "liked",
      target: "Building Your First Momentum Bot",
      time: "5m ago",
      isNew: true,
    },
    {
      id: 3,
      type: "share",
      user: "Mike Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      action: "shared",
      target: "Psychology of Algorithmic Trading",
      time: "8m ago",
      isNew: false,
    },
    {
      id: 4,
      type: "bookmark",
      user: "Emma Davis",
      avatar: "/placeholder.svg?height=32&width=32",
      action: "bookmarked",
      target: "Mean Reversion Strategies",
      time: "12m ago",
      isNew: false,
    },
    {
      id: 5,
      type: "view",
      user: "David Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      action: "viewed",
      target: "Risk Management for Quants",
      time: "15m ago",
      isNew: false,
    },
  ])

  const [filter, setFilter] = useState("all")

  const getIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageCircle className="w-4 h-4 text-blue-400" />
      case "like":
        return <Heart className="w-4 h-4 text-red-400" />
      case "share":
        return <Share2 className="w-4 h-4 text-green-400" />
      case "bookmark":
        return <Bookmark className="w-4 h-4 text-yellow-400" />
      case "view":
        return <Eye className="w-4 h-4 text-purple-400" />
      default:
        return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  const filteredActivities = activities.filter((activity) => filter === "all" || activity.type === filter)

  return (
    <Card className="bg-gray-900/50 border-primary/20 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Community Activity
            {activities.filter((a) => a.isNew).length > 0 && (
              <Badge className="bg-red-500 text-white text-xs ml-2">{activities.filter((a) => a.isNew).length}</Badge>
            )}
          </CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-20 h-8 bg-gray-800 border-gray-700 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="comment">Comments</SelectItem>
              <SelectItem value="like">Likes</SelectItem>
              <SelectItem value="share">Shares</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors relative ${
                activity.isNew ? "bg-primary/5 border border-primary/20" : ""
              }`}
            >
              {activity.isNew && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
              <Avatar className="w-8 h-8">
                <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                <AvatarFallback className="bg-gray-700 text-white text-xs">
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-sm">
                <div className="flex items-center gap-2 mb-1">
                  {getIcon(activity.type)}
                  <span className="text-white font-medium">{activity.user}</span>
                  <span className="text-gray-400">{activity.action}</span>
                </div>
                <div className="text-primary hover:text-primary/80 cursor-pointer transition-colors">
                  {activity.target}
                </div>
                <div className="text-gray-500 text-xs mt-1">{activity.time}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{filteredActivities.length} activities</span>
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 h-6 text-xs">
            View All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Advanced Search Component
const AdvancedSearch = ({
  onSearch,
  onFilter,
}: { onSearch: (term: string) => void; onFilter: (filters: any) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    dateRange: "all",
    readTime: "all",
    difficulty: "all",
    hasVideo: false,
    hasCode: false,
    author: "all",
    sortBy: "date",
  })

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    onSearch(term)
  }

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters = {
      dateRange: "all",
      readTime: "all",
      difficulty: "all",
      hasVideo: false,
      hasCode: false,
      author: "all",
      sortBy: "date",
    }
    setFilters(defaultFilters)
    setSearchTerm("")
    onSearch("")
    onFilter(defaultFilters)
  }

  const activeFiltersCount = Object.values(filters).filter(
    (value, index) => value !== Object.values(filters)[index] || value === true,
  ).length

  return (
    <Card className="bg-gray-900/50 border-primary/20 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <Input
            type="text"
            placeholder="Search articles, strategies, authors..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 pr-20 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-primary"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                {activeFiltersCount}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white h-8 w-8 p-0"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6 border-t border-gray-700 pt-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Date Range</label>
                  <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="week">Past Week</SelectItem>
                      <SelectItem value="month">Past Month</SelectItem>
                      <SelectItem value="quarter">Past Quarter</SelectItem>
                      <SelectItem value="year">Past Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Reading Time</label>
                  <Select value={filters.readTime} onValueChange={(value) => handleFilterChange("readTime", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Length</SelectItem>
                      <SelectItem value="quick">Under 3 min</SelectItem>
                      <SelectItem value="short">3-5 min</SelectItem>
                      <SelectItem value="medium">5-10 min</SelectItem>
                      <SelectItem value="long">Over 10 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Difficulty</label>
                  <Select value={filters.difficulty} onValueChange={(value) => handleFilterChange("difficulty", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Sort By</label>
                  <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Latest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                      <SelectItem value="views">Most Viewed</SelectItem>
                      <SelectItem value="comments">Most Discussed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-3 block">Content Features</label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={filters.hasVideo}
                        onCheckedChange={(checked) => handleFilterChange("hasVideo", checked)}
                      />
                      <label className="text-sm text-gray-400 flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Has Video Content
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={filters.hasCode}
                        onCheckedChange={(checked) => handleFilterChange("hasCode", checked)}
                      />
                      <label className="text-sm text-gray-400 flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Has Code Examples
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {activeFiltersCount > 0 ? `${activeFiltersCount} filters active` : "No filters applied"}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="border-gray-700 text-gray-400 hover:border-primary hover:text-primary bg-transparent"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

// Enhanced Post Card Component
const EnhancedPostCard = ({ post, index, viewMode }: { post: Post; index: number; viewMode: "grid" | "list" }) => {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100) + 20)
  const [isLiked, setIsLiked] = useState(false)
  const [views] = useState(Math.floor(Math.random() * 1000) + 100)
  const [comments] = useState(Math.floor(Math.random() * 50) + 5)
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })

  const readingTime = Math.floor(Math.random() * 8) + 3
  const difficulty = ["Beginner", "Intermediate", "Advanced", "Expert"][Math.floor(Math.random() * 4)]
  const engagement = Math.floor(Math.random() * 50) + 70
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1)

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: `/blog/${post.slug}`,
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`)
    }
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group ${viewMode === "list" ? "flex" : ""}`}
    >
      <Card
        className={`bg-gray-900/30 border-primary/10 hover:border-primary/40 hover:bg-gray-900/50 transition-all duration-500 backdrop-blur-sm overflow-hidden ${
          viewMode === "list" ? "flex h-48" : "h-full"
        }`}
      >
        <div className={`relative overflow-hidden ${viewMode === "list" ? "w-64 flex-shrink-0" : ""}`}>
          <Link href={`/blog/${post.slug}`}>
            <Image
              src={post.image || "/placeholder.svg?height=300&width=500"}
              alt={post.title}
              width={500}
              height={300}
              className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                viewMode === "list" ? "w-full h-full" : "w-full h-48"
              }`}
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge className="bg-primary/90 text-black text-xs">
              <Tag className="w-3 h-3 mr-1" />
              {post.category}
            </Badge>
            {Math.random() > 0.7 && (
              <Badge className="bg-orange-500/90 text-white text-xs">
                <Flame className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            )}
            {Math.random() > 0.8 && (
              <Badge className="bg-blue-500/90 text-white text-xs">
                <Award className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          {/* Engagement Overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {views}
                </div>
                <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {comments}
                </div>
              </div>
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                {rating}
              </div>
            </div>
          </div>

          {/* Reading Progress Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${engagement}%` }}
              transition={{ duration: 2, delay: index * 0.1 }}
            />
          </div>
        </div>

        <CardContent className={`p-6 flex-1 ${viewMode === "list" ? "flex flex-col justify-between" : ""}`}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                {difficulty}
              </Badge>
              <span className="text-gray-500 text-xs">•</span>
              <span className="text-gray-500 text-xs flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {readingTime} min read
              </span>
              <span className="text-gray-500 text-xs">•</span>
              <div className="flex items-center text-xs text-gray-500">
                <ThumbsUp className="w-3 h-3 mr-1 text-green-400" />
                {Math.floor(Math.random() * 50) + 20}
              </div>
            </div>

            <Link href={`/blog/${post.slug}`}>
              <h3
                className={`font-bold text-white mb-3 group-hover:text-primary transition-colors leading-tight ${
                  viewMode === "list" ? "text-lg line-clamp-2" : "text-xl line-clamp-2"
                }`}
              >
                {post.title}
              </h3>
            </Link>

            <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {["trading", "strategy", "analysis"].slice(0, Math.floor(Math.random() * 3) + 1).map((tag) => (
                <Badge key={tag} variant="outline" className="border-gray-600 text-gray-400 text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center">
              <Avatar className="w-8 h-8 mr-3">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback className="bg-gray-700 text-white text-xs">
                  {post.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-white font-medium text-sm">{post.author.name}</div>
                <div className="text-gray-500 text-xs flex items-center">
                  <Calendar size={10} className="mr-1" />
                  {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  setIsLiked(!isLiked)
                  setLikes((prev) => (isLiked ? prev - 1 : prev + 1))
                }}
                className={`h-8 w-8 p-0 ${isLiked ? "text-red-400" : "text-gray-400"} hover:bg-primary/10`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <span className="text-xs text-gray-500 mr-2">{likes}</span>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  setIsBookmarked(!isBookmarked)
                }}
                className={`h-8 w-8 p-0 ${isBookmarked ? "text-primary" : "text-gray-400"} hover:bg-primary/10`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="h-8 w-8 p-0 text-gray-400 hover:bg-primary/10 hover:text-primary"
              >
                <Share className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-400 hover:bg-primary/10 hover:text-primary"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Author Spotlight Component
const AuthorSpotlight = ({ posts }: { posts: Post[] }) => {
  const authors = useMemo(() => {
    const authorMap = new Map()
    posts.forEach((post) => {
      const author = post.author
      if (authorMap.has(author.name)) {
        authorMap.get(author.name).posts++
      } else {
        authorMap.set(author.name, {
          ...author,
          posts: 1,
          expertise: ["Trading", "Analysis", "Strategy"][Math.floor(Math.random() * 3)],
          followers: Math.floor(Math.random() * 5000) + 1000,
        })
      }
    })
    return Array.from(authorMap.values()).slice(0, 3)
  }, [posts])

  return (
    <Card className="bg-gray-900/50 border-primary/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Featured Authors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {authors.map((author, index) => (
          <motion.div
            key={author.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors cursor-pointer"
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
              <AvatarFallback className="bg-gray-700 text-white">
                {author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="text-white font-medium">{author.name}</h4>
              <p className="text-gray-400 text-sm">{author.expertise} Expert</p>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xs text-gray-500">{author.posts} articles</span>
                <span className="text-xs text-gray-500">{author.followers} followers</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
            >
              Follow
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}

// Newsletter Component
const NewsletterSignup = () => {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [preferences, setPreferences] = useState({
    weekly: true,
    breaking: false,
    analysis: true,
  })

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/20 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Stay Ahead of the Market</h3>
          <p className="text-gray-400">
            Get the latest insights, trading strategies, and market analysis delivered directly to your inbox.
          </p>
        </div>

        {!isSubscribed ? (
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                required
              />
              <Button type="submit" className="bg-primary text-black hover:bg-primary/90 px-8">
                Subscribe
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400 mb-2">Email preferences:</p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={preferences.weekly}
                    onChange={(e) => setPreferences((prev) => ({ ...prev, weekly: e.target.checked }))}
                    className="rounded border-gray-600 bg-gray-800"
                  />
                  <span>Weekly digest</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={preferences.breaking}
                    onChange={(e) => setPreferences((prev) => ({ ...prev, breaking: e.target.checked }))}
                    className="rounded border-gray-600 bg-gray-800"
                  />
                  <span>Breaking news</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={preferences.analysis}
                    onChange={(e) => setPreferences((prev) => ({ ...prev, analysis: e.target.checked }))}
                    className="rounded border-gray-600 bg-gray-800"
                  />
                  <span>Market analysis</span>
                </label>
              </div>
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-green-400"
              >
                ✓
              </motion.div>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Welcome aboard!</h4>
            <p className="text-gray-400">Check your email for a confirmation link.</p>
          </motion.div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <span>Join 25,000+ traders</span>
            <span>•</span>
            <span>Unsubscribe anytime</span>
            <span>•</span>
            <span>No spam, ever</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Blog Component
export default function BlogPageClient({ posts }: { posts: Post[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"date" | "popular" | "trending">("date")
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  // Handle scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const categories = useMemo(() => {
    const allCategories = posts.map((post) => post.category)
    return ["All", ...Array.from(new Set(allCategories))]
  }, [posts])

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
        const matchesSearch =
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "date":
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          case "popular":
            return Math.random() - 0.5 // Mock popularity sort
          case "trending":
            return Math.random() - 0.5 // Mock trending sort
          default:
            return 0
        }
      })
  }, [posts, searchTerm, selectedCategory, sortBy, filters])

  const featuredPost = filteredPosts[0]
  const regularPosts = filteredPosts.slice(1)

  // Advanced particle system for trading theme
  const tradingParticles = Array.from({ length: 50 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute"
      initial={{
        x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
      }}
      animate={{
        x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
      }}
      transition={{
        duration: Math.random() * 20 + 15,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "linear",
      }}
    >
      {i % 5 === 0 && <div className="w-1 h-1 bg-primary/20 rounded-full" />}
      {i % 5 === 1 && <div className="w-0.5 h-4 bg-green-400/10 rounded-full" />}
      {i % 5 === 2 && <div className="w-2 h-0.5 bg-blue-400/10 rounded-full" />}
      {i % 5 === 3 && <BarChart3 className="w-3 h-3 text-primary/10" />}
      {i % 5 === 4 && <LineChart className="w-3 h-3 text-blue-400/10" />}
    </motion.div>
  ))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">{tradingParticles}</div>
        <div className="text-center relative z-10">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
            className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-6"
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="text-gray-400 text-lg"
          >
            Loading market insights...
          </motion.p>
          <div className="mt-4 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-primary rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-gray-300 relative overflow-hidden">
      {/* Advanced Animated Background */}
      <motion.div className="fixed inset-0 pointer-events-none" style={{ y: backgroundY }}>
        {tradingParticles}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,136,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </motion.div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Enhanced Hero Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center py-16 md:py-24 relative"
        >
          <div className="relative">
            {/* Floating Trading Icons */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                scale: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 border border-primary/20 rounded-full flex items-center justify-center"
            >
              <BarChart3 className="w-8 h-8 text-primary/50" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-6 relative"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-blue-400">
                Nexural
              </span>
              <br />
              <span className="text-4xl md:text-5xl text-gray-400 font-light">Insights</span>

              {/* Animated Underline */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 1 }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-blue-400 rounded-full"
              />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="max-w-4xl mx-auto text-xl text-gray-400 leading-relaxed mb-8"
            >
              Dive deep into the world of quantitative trading with expert insights, cutting-edge strategies, and the
              latest developments in algorithmic finance. Join thousands of traders mastering the art of systematic
              trading.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button className="bg-primary text-black hover:bg-primary/90 px-8 py-3 text-lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Start Reading
              </Button>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 px-8 py-3 text-lg bg-transparent"
              >
                <Coffee className="w-5 h-5 mr-2" />
                Weekly Newsletter
              </Button>
            </motion.div>
          </div>

          {/* Enhanced Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { icon: Target, label: "Expert Articles", value: "150+", color: "text-primary" },
              { icon: Users, label: "Active Readers", value: "75K+", color: "text-blue-400" },
              { icon: Award, label: "Industry Awards", value: "12", color: "text-yellow-400" },
              { icon: Zap, label: "Strategies Covered", value: "50+", color: "text-purple-400" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  className="w-16 h-16 bg-gray-900/50 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:border-primary/50 transition-all backdrop-blur-sm"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </motion.div>
                <motion.div
                  className="text-3xl font-bold text-white mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.6 + index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.header>

        {/* Advanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mb-12"
        >
          <AdvancedSearch onSearch={setSearchTerm} onFilter={setFilters} />
        </motion.div>

        {/* Sidebar and Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Article */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="mb-16"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-white">Featured Article</h2>
                  <Badge className="bg-primary/20 text-primary border-primary/50">Editor's Choice</Badge>
                </div>

                <Link href={`/blog/${featuredPost.slug}`}>
                  <Card className="group bg-gray-900/30 border-primary/20 hover:border-primary/50 transition-all duration-700 overflow-hidden backdrop-blur-sm">
                    <div className="md:flex">
                      <div className="md:w-1/2 relative overflow-hidden">
                        <Image
                          src={featuredPost.image || "/placeholder.svg?height=500&width=700"}
                          alt={featuredPost.title}
                          width={700}
                          height={500}
                          className="w-full h-64 md:h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Floating Elements */}
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                          className="absolute top-6 left-6"
                        >
                          <Badge className="bg-primary text-black text-sm px-3 py-1">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Featured
                          </Badge>
                        </motion.div>

                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-white flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                {Math.floor(Math.random() * 5000) + 1000}
                              </div>
                              <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-white flex items-center gap-2">
                                <MessageCircle className="w-4 h-4" />
                                {Math.floor(Math.random() * 100) + 20}
                              </div>
                            </div>
                            <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-white flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-400" />
                              4.{Math.floor(Math.random() * 9) + 1}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-6">
                          <Badge variant="outline" className="border-primary/50 text-primary">
                            <Tag className="w-3 h-3 mr-1" />
                            {featuredPost.category}
                          </Badge>
                          <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                            Advanced
                          </Badge>
                          <span className="text-gray-500 text-sm flex items-center">
                            <Clock className="w-4 h-4 mr-1" />8 min read
                          </span>
                        </div>

                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 group-hover:text-primary transition-colors leading-tight">
                          {featuredPost.title}
                        </h3>

                        <p className="text-gray-400 mb-8 text-lg leading-relaxed">{featuredPost.excerpt}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="w-12 h-12 mr-4">
                              <AvatarImage
                                src={featuredPost.author.avatar || "/placeholder.svg"}
                                alt={featuredPost.author.name}
                              />
                              <AvatarFallback className="bg-gray-700 text-white">
                                {featuredPost.author.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-white font-semibold text-lg">{featuredPost.author.name}</div>
                              <div className="text-gray-500 flex items-center">
                                <Calendar size={14} className="mr-2" />
                                {new Date(featuredPost.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </div>
                            </div>
                          </div>

                          <Button className="bg-primary text-black hover:bg-primary/90 px-6 py-3">
                            Read Article
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )}

            {/* Content Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
            >
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-white">Latest Articles</h2>
                <Badge variant="outline" className="border-primary/50 text-primary">
                  {filteredPosts.length} articles
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-primary text-black" : "border-gray-700 text-gray-400"}
                  >
                    <Grid3X3 size={16} />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-primary text-black" : "border-gray-700 text-gray-400"}
                  >
                    <List size={16} />
                  </Button>
                </div>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Latest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Category Filter Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-3 mb-12"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <Button
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full transition-all duration-300 relative ${
                      selectedCategory === category
                        ? "bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/25"
                        : "border-gray-700 text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {category}
                    {selectedCategory === category && (
                      <motion.div
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-primary rounded-full -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </motion.div>

            {/* Articles Grid */}
            <div className={`grid gap-8 ${viewMode === "grid" ? "md:grid-cols-2" : "grid-cols-1"}`}>
              <AnimatePresence mode="wait">
                {regularPosts.map((post, index) => (
                  <EnhancedPostCard key={post.slug} post={post} index={index} viewMode={viewMode} />
                ))}
              </AnimatePresence>
            </div>

            {/* Load More Button */}
            {regularPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center mt-12"
              >
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-black px-8 py-3 bg-transparent"
                >
                  Load More Articles
                  <ChevronDown className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Trading Data Visualization */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <TradingDataViz />
            </motion.div>

            {/* Personalized Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <PersonalizedRecommendations posts={posts} />
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <ActivityFeed />
            </motion.div>

            {/* Author Spotlight */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <AuthorSpotlight posts={posts} />
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <NewsletterSignup />
            </motion.div>
          </div>
        </div>

        {/* No Results State */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="w-16 h-16 text-gray-600" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">No articles found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We couldn't find any articles matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                  setFilters({})
                }}
                className="bg-primary text-black hover:bg-primary/90"
              >
                Clear All Filters
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 bg-transparent">
                Browse All Articles
              </Button>
            </div>
          </motion.div>
        )}

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-24 mb-12"
        >
          <Card className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 border-primary/20 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5" />
            <CardContent className="p-12 text-center relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-16 h-16 border-2 border-primary/30 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Zap className="w-8 h-8 text-primary" />
              </motion.div>

              <h3 className="text-4xl font-bold text-white mb-4">Ready to Level Up Your Trading?</h3>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg">
                Join thousands of successful traders who rely on our insights to make informed decisions. Start your
                journey to systematic trading success today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-primary text-black hover:bg-primary/90 px-8 py-4 text-lg">
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Trading
                </Button>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 px-8 py-4 text-lg bg-transparent"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Strategies
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-black rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors z-50"
          >
            <ChevronRight className="w-6 h-6 rotate-[-90deg]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
