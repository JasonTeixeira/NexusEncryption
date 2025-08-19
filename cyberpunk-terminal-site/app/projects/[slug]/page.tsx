import ProjectDetailView from "@/components/project-detail-view"

interface ProjectDetailPageProps {
  params: {
    slug: string
  }
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  return <ProjectDetailView slug={params.slug} />
}
