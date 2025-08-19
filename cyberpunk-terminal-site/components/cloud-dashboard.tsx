"use client"

import { useMultiCloudMetrics, useCostOptimization } from "@/hooks/use-cloud"

export default function CloudDashboard() {
  const { aws, azure, gcp, summary, loading } = useMultiCloudMetrics()
  const { optimization, loading: costLoading } = useCostOptimization()

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-cyan-400 font-bold">LOADING CLOUD INFRASTRUCTURE...</div>
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-green-500 animate-pulse" style={{ width: "100%" }} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-cyan-400 font-bold text-xl">MULTI-CLOUD INFRASTRUCTURE DASHBOARD</div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-green-500/30 p-4 bg-green-500/[0.02]">
          <div className="text-gray-400 text-sm">Total Resources</div>
          <div className="text-green-400 text-2xl font-bold">{summary.totalResources}</div>
        </div>
        <div className="border border-cyan-500/30 p-4 bg-cyan-500/[0.02]">
          <div className="text-gray-400 text-sm">Monthly Cost</div>
          <div className="text-cyan-400 text-2xl font-bold">${summary.totalCost.toLocaleString()}</div>
        </div>
        <div className="border border-yellow-500/30 p-4 bg-yellow-500/[0.02]">
          <div className="text-gray-400 text-sm">Health Score</div>
          <div className="text-yellow-400 text-2xl font-bold">{summary.avgHealthScore}/100</div>
        </div>
        <div className="border border-red-500/30 p-4 bg-red-500/[0.02]">
          <div className="text-gray-400 text-sm">Active Alerts</div>
          <div className="text-red-400 text-2xl font-bold">{summary.alerts.length}</div>
        </div>
      </div>

      {/* Cloud Provider Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AWS */}
        <div className="border border-orange-500/30 p-4 bg-orange-500/[0.02]">
          <div className="text-orange-400 font-bold mb-3">AWS</div>
          {aws.loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : aws.metrics ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Resources:</span>
                <span className="text-white">{aws.metrics.totalResources}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cost:</span>
                <span className="text-green-400">${aws.metrics.totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Health:</span>
                <span className="text-yellow-400">{aws.metrics.healthScore}/100</span>
              </div>
              <div className="text-xs text-gray-500">Regions: {aws.metrics.regions.join(", ")}</div>
            </div>
          ) : (
            <div className="text-red-400">Error loading AWS data</div>
          )}
        </div>

        {/* Azure */}
        <div className="border border-blue-500/30 p-4 bg-blue-500/[0.02]">
          <div className="text-blue-400 font-bold mb-3">AZURE</div>
          {azure.loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : azure.metrics ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Resources:</span>
                <span className="text-white">{azure.metrics.totalResources}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cost:</span>
                <span className="text-green-400">${azure.metrics.totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Health:</span>
                <span className="text-yellow-400">{azure.metrics.healthScore}/100</span>
              </div>
              <div className="text-xs text-gray-500">Regions: {azure.metrics.regions.join(", ")}</div>
            </div>
          ) : (
            <div className="text-red-400">Error loading Azure data</div>
          )}
        </div>

        {/* GCP */}
        <div className="border border-green-500/30 p-4 bg-green-500/[0.02]">
          <div className="text-green-400 font-bold mb-3">GCP</div>
          {gcp.loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : gcp.metrics ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Resources:</span>
                <span className="text-white">{gcp.metrics.totalResources}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cost:</span>
                <span className="text-green-400">${gcp.metrics.totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Health:</span>
                <span className="text-yellow-400">{gcp.metrics.healthScore}/100</span>
              </div>
              <div className="text-xs text-gray-500">Regions: {gcp.metrics.regions.join(", ")}</div>
            </div>
          ) : (
            <div className="text-red-400">Error loading GCP data</div>
          )}
        </div>
      </div>

      {/* Cost Optimization */}
      {!costLoading && optimization && (
        <div className="border border-yellow-500/30 p-4 bg-yellow-500/[0.02]">
          <div className="text-yellow-400 font-bold mb-3">COST OPTIMIZATION OPPORTUNITIES</div>
          <div className="mb-3">
            <span className="text-gray-400">Potential Monthly Savings: </span>
            <span className="text-green-400 text-xl font-bold">${optimization.potentialSavings.toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            {optimization.recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="text-cyan-400">{rec.type}</div>
                  <div className="text-gray-400 text-sm">{rec.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400">${rec.savings}</div>
                  <div
                    className={`text-xs ${
                      rec.effort === "low"
                        ? "text-green-400"
                        : rec.effort === "medium"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {rec.effort} effort
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Alerts */}
      {summary.alerts.length > 0 && (
        <div className="border border-red-500/30 p-4 bg-red-500/[0.02]">
          <div className="text-red-400 font-bold mb-3">ACTIVE ALERTS</div>
          <div className="space-y-2">
            {summary.alerts.map((alert, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    alert.level === "critical"
                      ? "bg-red-500"
                      : alert.level === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                />
                <div>
                  <span className="text-gray-400">[{alert.resource}]</span>
                  <span className="text-white ml-2">{alert.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
