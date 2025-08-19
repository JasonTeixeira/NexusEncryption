"use client"

import type { User } from "@/lib/collaboration-service"

interface UserPresenceProps {
  users: User[]
  maxVisible?: number
}

export default function UserPresence({ users, maxVisible = 5 }: UserPresenceProps) {
  const visibleUsers = users.slice(0, maxVisible)
  const hiddenCount = Math.max(0, users.length - maxVisible)

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {visibleUsers.map((user) => (
          <div
            key={user.id}
            className="relative w-8 h-8 rounded-full border-2 border-gray-800 overflow-hidden"
            style={{ backgroundColor: user.color }}
            title={user.name}
          >
            {user.avatar ? (
              <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-gray-800 rounded-full" />
          </div>
        ))}

        {hiddenCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-xs text-gray-300 font-bold">
            +{hiddenCount}
          </div>
        )}
      </div>

      <span className="text-sm text-gray-400">
        {users.length} {users.length === 1 ? "viewer" : "viewers"}
      </span>
    </div>
  )
}
