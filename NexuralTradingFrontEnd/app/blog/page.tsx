import { getAllPosts } from "@/lib/blog-data"
import BlogPageClient from "@/components/BlogPageClient"

export default function BlogPage() {
  const allPosts = getAllPosts()

  return (
    <div className="text-white">
      <BlogPageClient posts={allPosts} />
    </div>
  )
}
