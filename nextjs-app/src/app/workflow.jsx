'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FileUpload from '@/components/FileUpload'
import ChangeCard from '@/components/ChangeCard'
import HistorySidebar from '@/components/HistorySidebar'

// Types for our change objects
const ChangeObject = {
  title: '',
  filterOptions: [],
  intensity: 0,
  previewUrl: ''
}

const HistoryEntry = {
  id: '',
  timestamp: new Date(),
  changes: [],
  thumbnail: ''
}

export default function Workflow() {
  // Main state
  const [selectedFile, setSelectedFile] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [changes, setChanges] = useState([])
  const [history, setHistory] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('promptstorm-history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        const historyWithDates = parsed.map((entry) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }))
        setHistory(historyWithDates)
      } catch (error) {
        console.error('Error parsing saved history:', error)
      }
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('promptstorm-history', JSON.stringify(history))
    }
  }, [history])

  // Generate changes using the API
  const handleGenerateChanges = () => {
    if (!selectedFile || !prompt.trim()) return

    setIsGenerating(true)
    
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('prompt', prompt)

    fetch('/api/generateChanges', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to generate changes')
      }
      return response.json()
    })
    .then(data => {
      if (data.success && data.changes) {
        setChanges(data.changes)
        
        // Add to history
        const historyEntry = {
          id: Date.now().toString(),
          timestamp: new Date(),
          changes: data.changes,
          thumbnail: data.changes[0]?.previewUrl || ''
        }
        setHistory(prev => [historyEntry, ...prev.slice(0, 19)]) // Keep last 20 entries
      }
    })
    .catch(error => {
      console.error('Error generating changes:', error)
      // Fallback mock data for demo
      setChanges([
        {
          title: "Vintage Film Effect",
          filterOptions: ["Sepia", "Grain", "Vignette", "Fade"],
          intensity: 75,
          previewUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f59e0b'/%3E%3C/svg%3E"
        },
        {
          title: "Neon Glow Enhancement",
          filterOptions: ["Cyan", "Pink", "Purple", "Green"],
          intensity: 60,
          previewUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%2306b6d4'/%3E%3C/svg%3E"
        }
      ])
    })
    .finally(() => {
      setIsGenerating(false)
    })
  }

  // Update a specific change object
  const updateChange = (index, updates) => {
    setChanges(prev => {
      const newChanges = prev.map((change, i) => 
        i === index ? { ...change, ...updates } : change
      )
      
      // Add to history on any change
      const historyEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        changes: newChanges,
        thumbnail: newChanges[0]?.previewUrl || ''
      }
      setHistory(prevHistory => [historyEntry, ...prevHistory.slice(0, 19)])
      
      return newChanges
    })
  }

  // Load a history entry back into changes
  const loadHistoryEntry = (entry) => {
    setChanges(entry.changes)
  }

  // Clear history
  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('promptstorm-history')
  }

  return (
    <div className="min-h-screen relative bg-black">
      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <div className="flex flex-col lg:flex-row h-screen">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 drop-shadow-2xl">
                PromptStorm
              </h1>
              <p className="text-white font-mono drop-shadow-lg backdrop-blur-sm bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                AI-powered content editing with version control
              </p>
            </motion.div>

            {/* File Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <FileUpload
                onFileSelect={setSelectedFile}
              />
            </motion.div>

            {/* Prompt Input */}
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="bg-white/90 backdrop-blur-sm border-2 border-white/30 rounded-xl p-6 shadow-2xl">
                  <label htmlFor="prompt" className="block text-sm font-mono font-bold text-purple-700 mb-2">
                    Describe the vibe...
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the vibe..."
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 font-mono resize-none"
                    rows={3}
                    disabled={isGenerating}
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleGenerateChanges}
                      disabled={!prompt.trim() || isGenerating}
                      className="btn-neon-pink flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <span>Generate Changes</span>
                          <span>✨</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Change Cards */}
            {changes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-mono font-bold text-white mb-4 drop-shadow-lg backdrop-blur-sm bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                  Generated Changes
                </h2>
                <AnimatePresence>
                  {changes.map((change, index) => (
                    <ChangeCard
                      key={index}
                      change={change}
                      index={index}
                      onUpdate={(updates) => updateChange(index, updates)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        {/* History Sidebar */}
        <div className="w-full lg:w-80 lg:border-l-2 lg:border-white/30">
          <HistorySidebar
            history={history}
            onLoadEntry={loadHistoryEntry}
            onClearHistory={clearHistory}
          />
        </div>
      </div>
    </div>
    </div>
  )
}