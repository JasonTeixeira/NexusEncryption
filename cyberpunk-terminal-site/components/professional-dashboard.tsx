"use client"

import { useLinkedInProfile, useLinkedInMetrics, useCertifications, useIndustryNews } from "@/hooks/use-professional"

export default function ProfessionalDashboard() {
  const { profile, loading: profileLoading } = useLinkedInProfile()
  const { metrics, loading: metricsLoading } = useLinkedInMetrics()
  const { certifications, loading: certsLoading } = useCertifications()
  const { news, loading: newsLoading } = useIndustryNews()

  if (profileLoading || metricsLoading || certsLoading) {
    return (
      <div className="space-y-4">
        <div className="text-cyan-400 font-bold">LOADING PROFESSIONAL DATA...</div>
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-green-500 animate-pulse" style={{ width: "100%" }} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-cyan-400 font-bold text-xl">PROFESSIONAL PROFILE DASHBOARD</div>

      {/* Professional Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="border border-blue-500/30 p-4 bg-blue-500/[0.02]">
            <div className="text-gray-400 text-sm">Profile Views</div>
            <div className="text-blue-400 text-2xl font-bold">{metrics.profileViews.toLocaleString()}</div>
          </div>
          <div className="border border-green-500/30 p-4 bg-green-500/[0.02]">
            <div className="text-gray-400 text-sm">Connections</div>
            <div className="text-green-400 text-2xl font-bold">{profile?.connections.toLocaleString()}</div>
          </div>
          <div className="border border-yellow-500/30 p-4 bg-yellow-500/[0.02]">
            <div className="text-gray-400 text-sm">Certifications</div>
            <div className="text-yellow-400 text-2xl font-bold">{certifications.length}</div>
          </div>
        </div>
      )}

      {/* Professional Summary */}
      {profile && (
        <div className="border border-cyan-500/30 p-6 bg-cyan-500/[0.02]">
          <div className="text-cyan-400 font-bold text-lg mb-3">PROFESSIONAL SUMMARY</div>
          <div className="space-y-3">
            <div>
              <span className="text-gray-400">Name:</span>
              <span className="text-white ml-2">{profile.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Headline:</span>
              <span className="text-cyan-300 ml-2">{profile.headline}</span>
            </div>
            <div>
              <span className="text-gray-400">Location:</span>
              <span className="text-white ml-2">{profile.location}</span>
            </div>
            <div>
              <span className="text-gray-400">Summary:</span>
              <p className="text-gray-300 mt-1">{profile.summary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Skills */}
      {profile && (
        <div className="border border-green-500/30 p-6 bg-green-500/[0.02]">
          <div className="text-green-400 font-bold text-lg mb-3">TOP SKILLS & ENDORSEMENTS</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.skills.slice(0, 8).map((skill, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="text-white">{skill.name}</div>
                  <div
                    className={`text-xs ${
                      skill.level === "expert"
                        ? "text-green-400"
                        : skill.level === "professional"
                          ? "text-yellow-400"
                          : "text-blue-400"
                    }`}
                  >
                    {skill.level.toUpperCase()}
                  </div>
                </div>
                <div className="text-cyan-400 font-bold">{skill.endorsements}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Certifications */}
      <div className="border border-yellow-500/30 p-6 bg-yellow-500/[0.02]">
        <div className="text-yellow-400 font-bold text-lg mb-3">ACTIVE CERTIFICATIONS</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications
            .filter((cert) => cert.status === "active")
            .slice(0, 6)
            .map((cert, index) => (
              <div key={index} className="border border-gray-700 p-3 bg-black/20">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-cyan-400 font-semibold text-sm">{cert.name}</div>
                  <div
                    className={`px-2 py-1 text-xs rounded ${
                      cert.level === "expert"
                        ? "bg-red-500/20 text-red-400"
                        : cert.level === "professional"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {cert.level.toUpperCase()}
                  </div>
                </div>
                <div className="text-gray-400 text-xs mb-1">{cert.provider}</div>
                <div className="text-gray-500 text-xs">Issued: {new Date(cert.issueDate).toLocaleDateString()}</div>
                {cert.expiryDate && (
                  <div className="text-gray-500 text-xs">Expires: {new Date(cert.expiryDate).toLocaleDateString()}</div>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {cert.skills.slice(0, 3).map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-1 py-0.5 bg-cyan-500/10 text-cyan-300 text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Industry News */}
      <div className="border border-purple-500/30 p-6 bg-purple-500/[0.02]">
        <div className="text-purple-400 font-bold text-lg mb-3">INDUSTRY NEWS & UPDATES</div>
        {newsLoading ? (
          <div className="text-gray-400">Loading latest industry news...</div>
        ) : (
          <div className="space-y-4">
            {news.slice(0, 5).map((article, index) => (
              <div key={index} className="border-l-2 border-purple-500/50 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-white font-semibold text-sm">{article.title}</div>
                  <div
                    className={`px-2 py-1 text-xs rounded ml-2 ${
                      article.category === "cloud"
                        ? "bg-blue-500/20 text-blue-400"
                        : article.category === "devops"
                          ? "bg-green-500/20 text-green-400"
                          : article.category === "security"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {article.category.toUpperCase()}
                  </div>
                </div>
                <div className="text-gray-300 text-sm mb-2">{article.summary}</div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{article.source}</span>
                  <span className="text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
