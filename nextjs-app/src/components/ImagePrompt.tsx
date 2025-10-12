'use client'

import { useState, useRef } from 'react'

interface ChangeObject {
  title: string
  filterOptions: string[]
  intensity: number
  previewUrl: string
}

interface ImagePromptProps {
  selectedChange: ChangeObject | null
  selectedIndex: number
  onUpdateChange: (index: number, newPrompt: string) => void
  isUpdating?: boolean
}

export default function ImagePrompt({ 
  selectedChange, 
  selectedIndex, 
  onUpdateChange, 
  isUpdating = false 
}: ImagePromptProps) {
  const [prompt, setPrompt] = useState('')
  const promptRef = useRef<HTMLTextAreaElement>(null)

  const handleUpdate = () => {
    if (!prompt.trim() || selectedIndex === -1) return
    
    onUpdateChange(selectedIndex, prompt.trim())
    setPrompt('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleUpdate()
    }
  }

  if (!selectedChange) {
    return (
      <div className="text-center py-8">
        <p 
          className="text-gray-500 terminal-font"
          style={{ 
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '0.8rem',
            textShadow: '2px 2px 0px #000000',
            imageRendering: 'pixelated'
          }}
        >
          SELECT AN IMAGE TO REFINE
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div 
        className="bg-black border-4 border-yellow-400 p-6"
        style={{
          imageRendering: 'pixelated',
          boxShadow: 'inset 0 0 0 2px #FFE400, 0 0 0 4px #000000',
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
        }}
      >
        {/* Header */}
        <div className="mb-4">
          <h3 
            className="text-yellow-400 mb-2"
            style={{ 
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '0.8rem',
              textShadow: '2px 2px 0px #000000',
              imageRendering: 'pixelated'
            }}
          >
            REFINE '{selectedChange.title.toUpperCase()}'
          </h3>
          <p 
            className="text-cyan-400"
            style={{ 
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '0.5rem',
              textShadow: '2px 2px 0px #000000',
              imageRendering: 'pixelated'
            }}
          >
            ENTER YOUR REFINEMENT PROMPT BELOW
          </p>
        </div>

        {/* Prompt Input */}
        <div className="mb-4">
          <textarea
            ref={promptRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe how you want to refine this image..."
            className="w-full p-4 bg-black border-2 border-dashed border-yellow-400 text-yellow-400 pixel-font resize-none focus:outline-none focus:border-cyan-400 transition-colors duration-200"
            rows={4}
            disabled={isUpdating}
            style={{ 
              fontFamily: '"Press Start 2P", monospace', 
              fontSize: '0.6rem',
              imageRendering: 'pixelated',
              textShadow: '2px 2px 0px #000000',
              boxShadow: 'inset 0 0 0 2px #FFE400, 0 0 0 4px #000000',
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
            }}
          />
        </div>

        {/* Update Button */}
        <div className="flex justify-center">
          <button
            onClick={handleUpdate}
            disabled={!prompt.trim() || isUpdating}
            className="pixel-button"
            style={{ 
              color: '#000',
              backgroundColor: isUpdating ? '#666' : '#FFE400',
              padding: '12px 32px',
              margin: '10px',
              fontSize: '14px',
              fontFamily: '"Press Start 2P", system-ui',
              border: '0',
              boxShadow: isUpdating 
                ? '0px 5px #333, 0px -5px #333, 5px 0px #333, -5px 0px #333'
                : '0px 5px black, 0px -5px black, 5px 0px black, -5px 0px black, 0px 10px #00000038, 5px 5px #00000038, -5px 5px #00000038, inset 0px 5px #ffffff36',
              cursor: isUpdating ? 'not-allowed' : 'pointer',
              transition: 'transform 0.1s ease',
              opacity: isUpdating ? 0.6 : 1
            }}
            onMouseDown={(e) => {
              if (!isUpdating) {
                e.currentTarget.style.transform = 'translateY(5px)'
                e.currentTarget.style.boxShadow = '0px 5px black, 0px -5px black, 5px 0px black, -5px 0px black, inset 0px 5px #00000038'
              }
            }}
            onMouseUp={(e) => {
              if (!isUpdating) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0px 5px black, 0px -5px black, 5px 0px black, -5px 0px black, 0px 10px #00000038, 5px 5px #00000038, -5px 5px #00000038, inset 0px 5px #ffffff36'
              }
            }}
            onMouseLeave={(e) => {
              if (!isUpdating) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0px 5px black, 0px -5px black, 5px 0px black, -5px 0px black, 0px 10px #00000038, 5px 5px #00000038, -5px 5px #00000038, inset 0px 5px #ffffff36'
              }
            }}
          >
            {isUpdating ? 'UPDATING...' : 'UPDATE CHANGE'}
          </button>
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="mt-4 text-center">
          <p 
            className="text-gray-500"
            style={{ 
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '0.4rem',
              textShadow: '1px 1px 0px #000000',
              imageRendering: 'pixelated'
            }}
          >
            PRESS CTRL+ENTER TO UPDATE
          </p>
        </div>
      </div>
    </div>
  )
}

