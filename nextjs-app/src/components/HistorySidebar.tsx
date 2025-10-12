'use client'

import { useState } from 'react'

interface ChangeObject {
  title: string
  filterOptions: string[]
  intensity: number
  previewUrl: string
}

interface HistoryEntry {
  id: string
  timestamp: number
  changes: ChangeObject[]
  previewUrl: string
}

interface HistorySidebarProps {
  history: HistoryEntry[]
  onLoadEntry: (entry: HistoryEntry) => void
  onClearHistory: () => void
}

export default function HistorySidebar({ 
  history, 
  onLoadEntry, 
  onClearHistory 
}: HistorySidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleLoadEntry = (entry: HistoryEntry) => {
    onLoadEntry(entry)
    setIsExpanded(false)
  }

  return (
    <div className="lg:w-80">
      <div 
        className="bg-black border-4 border-yellow-400 p-4"
        style={{
          imageRendering: 'pixelated',
          boxShadow: 'inset 0 0 0 2px #FFE400, 0 0 0 4px #000000',
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 
            className="text-yellow-400"
            style={{ 
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '0.7rem',
              textShadow: '2px 2px 0px #000000',
              imageRendering: 'pixelated'
            }}
          >
            HISTORY
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-yellow-400 hover:text-cyan-400 transition-colors"
            style={{ 
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '0.5rem',
              textShadow: '2px 2px 0px #000000',
              imageRendering: 'pixelated'
            }}
          >
            {isExpanded ? 'HIDE' : 'SHOW'}
          </button>
        </div>

        {/* History Count */}
        <div className="mb-4">
          <p 
            className="text-cyan-400"
            style={{ 
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '0.4rem',
              textShadow: '2px 2px 0px #000000',
              imageRendering: 'pixelated'
            }}
          >
            {history.length} SNAPSHOTS
          </p>
        </div>

        {/* History List */}
        {isExpanded && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.length === 0 ? (
              <p 
                className="text-gray-500 text-center py-4"
                style={{ 
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: '0.4rem',
                  textShadow: '2px 2px 0px #000000',
                  imageRendering: 'pixelated'
                }}
              >
                NO HISTORY YET
              </p>
            ) : (
              history.map((entry, index) => (
                <div
                  key={entry.id}
                  className="cursor-pointer p-3 bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => handleLoadEntry(entry)}
                  style={{
                    imageRendering: 'pixelated',
                    boxShadow: '0 0 0 2px #FFE400, 0 4px 0 0 #000000',
                    clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'
                  }}
                >
                  {/* Thumbnail */}
                  <div className="mb-2">
                    <img
                      src={entry.previewUrl}
                      alt={`Snapshot ${index + 1}`}
                      className="w-full h-16 object-cover"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  
                  {/* Timestamp */}
                  <p 
                    className="text-yellow-400 mb-1"
                    style={{ 
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: '0.3rem',
                      textShadow: '2px 2px 0px #000000',
                      imageRendering: 'pixelated'
                    }}
                  >
                    {formatTimestamp(entry.timestamp)}
                  </p>
                  
                  {/* Changes Count */}
                  <p 
                    className="text-cyan-400"
                    style={{ 
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: '0.3rem',
                      textShadow: '2px 2px 0px #000000',
                      imageRendering: 'pixelated'
                    }}
                  >
                    {Array.isArray(entry.changes) ? entry.changes.length : 0} CHANGES
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Clear History Button */}
        {history.length > 0 && (
          <div className="mt-4 pt-4 border-t border-yellow-400">
            <button
              onClick={onClearHistory}
              className="w-full text-red-400 hover:text-red-300 transition-colors"
              style={{ 
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '0.4rem',
                textShadow: '2px 2px 0px #000000',
                imageRendering: 'pixelated'
              }}
            >
              CLEAR HISTORY
            </button>
          </div>
        )}
      </div>
    </div>
  )
}