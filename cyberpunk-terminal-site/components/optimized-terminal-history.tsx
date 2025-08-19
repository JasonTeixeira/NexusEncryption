"use client"

import type React from "react"

import { memo, useMemo, useCallback } from "react"
import { FixedSizeList as List } from "react-window"

interface TerminalHistoryItem {
  type: "command" | "output"
  content: React.ReactNode
  id: string
}

interface TerminalHistoryProps {
  history: TerminalHistoryItem[]
  height: number
  className?: string
}

const TerminalHistoryItem = memo(
  ({
    index,
    style,
    data,
  }: {
    index: number
    style: React.CSSProperties
    data: TerminalHistoryItem[]
  }) => {
    const item = data[index]

    return (
      <div style={style} className="flex items-start gap-2 px-4">
        {item.type === "command" && (
          <div className="text-green-400 font-mono" aria-label="Command prompt">
            {item.content}
          </div>
        )}
        {item.type === "output" && (
          <div className="text-gray-300 font-mono" role="status">
            {item.content}
          </div>
        )}
      </div>
    )
  },
)

TerminalHistoryItem.displayName = "TerminalHistoryItem"

export default memo(function OptimizedTerminalHistory({ history, height, className = "" }: TerminalHistoryProps) {
  // Memoize the item data to prevent unnecessary re-renders
  const itemData = useMemo(() => history, [history])

  // Memoize the item size calculation
  const itemSize = useMemo(() => {
    // Estimate item height based on content
    return 32 // Base height for terminal lines
  }, [])

  const getItemKey = useCallback((index: number, data: TerminalHistoryItem[]) => {
    return data[index]?.id || index
  }, [])

  if (history.length === 0) {
    return <div className={className} />
  }

  return (
    <div className={className}>
      <List
        height={height}
        itemCount={history.length}
        itemSize={itemSize}
        itemData={itemData}
        itemKey={getItemKey}
        overscanCount={5} // Render 5 extra items for smooth scrolling
      >
        {TerminalHistoryItem}
      </List>
    </div>
  )
})
