'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MediaUploader from '@/components/MediaUploader'
import ChangeCardsList from '@/components/ChangeCardsList'
import HistorySidebar from '@/components/HistorySidebar'
import { GenerateChangesResponse } from '@/types/api'

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

export default function MediaUploaderDemo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadHistory, setUploadHistory] = useState<File[]>([])
  const [prompt, setPrompt] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [generatedChanges, setGeneratedChanges] = useState<ChangeObject[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [availableAssets, setAvailableAssets] = useState<string[]>([])

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('media-editor-history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsed.map((entry: any) => ({
          ...entry,
          timestamp: typeof entry.timestamp === 'number' ? entry.timestamp : new Date(entry.timestamp).getTime()
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
      localStorage.setItem('media-editor-history', JSON.stringify(history))
    }
  }, [history])

  // Fetch available assets on mount
  useEffect(() => {
    const fetchAssets = () => {
      fetch('/api/assets')
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setAvailableAssets(data.assets)
          }
        })
        .catch(error => {
          console.error('Error fetching assets:', error)
        })
    }
    fetchAssets()
  }, [])

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file)
    if (file) {
      setUploadHistory(prev => [file, ...prev.slice(0, 4)]) // Keep last 5 files
    }
  }

  const handleGenerateChanges = () => {
    if (!prompt.trim() || !selectedFile) return

    setIsGenerating(true)
    
    // Create FormData for the API call
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('prompt', prompt)

    // Call the API endpoint
    fetch('/api/generate-changes', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.error || 'Failed to generate changes')
        })
      }
      return response.json()
    })
    .then((data: GenerateChangesResponse) => {
      if (data.success && data.changes) {
        // Update changes with available assets
        const updatedChanges: ChangeObject[] = data.changes.map(change => ({
          ...change,
          filterOptions: availableAssets.length > 0 ? availableAssets.slice(0, 5) : change.filterOptions,
          previewUrl: '/api/placeholder/200/200'
        }))
        setGeneratedChanges(updatedChanges)
        
        // Add to history
        const historyEntry: HistoryEntry = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          changes: updatedChanges,
          previewUrl: selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : ''
        }
        setHistory(prev => [historyEntry, ...prev.slice(0, 19)]) // Keep last 20 entries
      } else {
        throw new Error('Invalid response from server')
      }
    })
    .catch(error => {
      console.error('Error generating changes:', error)
      setGeneratedChanges([
        {
          title: `Error: ${error instanceof Error ? error.message : 'Failed to generate changes'}`,
          filterOptions: ['Please check your Gemini API key configuration'],
          intensity: 0,
          previewUrl: '/api/placeholder/200/200'
        },
        {
          title: 'Configuration Required',
          filterOptions: ['Make sure the file is a valid image or video format'],
          intensity: 0,
          previewUrl: '/api/placeholder/200/200'
        }
      ])
    })
    .finally(() => {
      setIsGenerating(false)
    })
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleFilterChange = (index: number, selectedFilter: string) => {
    console.log(`Filter changed for change ${index}:`, selectedFilter)
    // Here you would typically update the changes state or apply the filter
  }

  const handleIntensityChange = (index: number, intensity: number) => {
    setGeneratedChanges(prev => 
      prev.map((change, i) => 
        i === index ? { ...change, intensity } : change
      )
    )
  }

  const handleTitleChange = (index: number, newTitle: string) => {
    setGeneratedChanges(prev => 
      prev.map((change, i) => 
        i === index ? { ...change, title: newTitle } : change
      )
    )
  }

  const handleClearHistory = () => {
    setHistory([])
    localStorage.removeItem('media-editor-history')
  }

  const handleDownloadEntry = (entry: HistoryEntry) => {
    console.log('Downloading entry:', entry)
    // Implement download functionality
  }

  const handleDeleteEntry = (entryId: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== entryId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto py-12">
          <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Media Uploader Demo
          </h1>
          <p className="text-purple-700 font-mono max-w-2xl mx-auto">
            A React component that accepts image and video files, provides preview functionality, 
            and exposes the file object via an onChange callback prop.
          </p>
        </div>

        {/* Main Uploader */}
        <div className="bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl p-6 shadow-retro mb-8">
          <h2 className="text-2xl font-mono font-bold text-purple-800 mb-6">Upload Media</h2>
          <MediaUploader
            onChange={handleFileChange}
            accept="image/*,video/*"
            maxSize={10}
            placeholder="Drag and drop your image or video here, or click to browse"
            showPrompt={true}
            promptValue={prompt}
            onPromptChange={setPrompt}
            onGenerateChanges={handleGenerateChanges}
            isGenerating={isGenerating}
          />
        </div>

        {/* File Information */}
        {selectedFile && (
          <div className="card mb-8">
            <h3 className="heading-3 mb-4">Selected File Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">File Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedFile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{selectedFile.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Modified:</span>
                    <span className="font-medium">
                      {new Date(selectedFile.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={handleRemoveFile}
                    className="btn-secondary w-full"
                  >
                    Remove File
                  </button>
                  <button
                    onClick={() => {
                      const url = URL.createObjectURL(selectedFile)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = selectedFile.name
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="btn-primary w-full"
                  >
                    Download File
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generated Changes */}
        {generatedChanges.length > 0 && (
          <div className="bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl p-6 shadow-retro mb-8">
            <ChangeCardsList
              changes={generatedChanges}
              onFilterChange={handleFilterChange}
              onIntensityChange={handleIntensityChange}
              onTitleChange={handleTitleChange}
            />
          </div>
        )}

        {/* Upload History */}
        {uploadHistory.length > 0 && (
          <div className="card">
            <h3 className="heading-3 mb-4">Recent Uploads</h3>
            <div className="space-y-3">
              {uploadHistory.map((file, index) => (
                <div
                  key={`${file.name}-${file.lastModified}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      {file.type.startsWith('image/') ? (
                        <span className="text-primary-600 text-sm">📷</span>
                      ) : (
                        <span className="text-primary-600 text-sm">🎥</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(file.lastModified).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Example */}
        <div className="card mt-8">
          <h3 className="heading-3 mb-4">Usage Example</h3>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
{`import ChangeCardsList from '@/components/ChangeCardsList'

function MyComponent() {
  const [changes, setChanges] = useState([
    {
      title: "Enhance Lighting",
      filterOptions: ["Brightness", "Contrast", "Exposure"],
      intensity: 60
    },
    {
      title: "Color Grading",
      filterOptions: ["Saturation", "Vibrance", "Hue Shift"],
      intensity: 45
    }
  ])

  const handleFilterChange = (index, selectedFilter) => {
    console.log('Filter changed:', index, selectedFilter)
  }

  const handleIntensityChange = (index, intensity) => {
    console.log('Intensity changed:', index, intensity)
  }

  return (
    <ChangeCardsList
      changes={changes}
      onFilterChange={handleFilterChange}
      onIntensityChange={handleIntensityChange}
    />
  )
}`}
            </pre>
          </div>
        </div>

        {/* Props Documentation */}
        <div className="card mt-8">
          <h3 className="heading-3 mb-4">ChangeCardsList Props</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-semibold">Prop</th>
                  <th className="text-left py-2 font-semibold">Type</th>
                  <th className="text-left py-2 font-semibold">Default</th>
                  <th className="text-left py-2 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-mono text-primary-600">changes</td>
                  <td className="py-2">ChangeObject[]</td>
                  <td className="py-2">[]</td>
                  <td className="py-2">Array of change objects with title, filterOptions, and intensity</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-mono text-primary-600">onFilterChange</td>
                  <td className="py-2">(index: number, filter: string) {'>'}</td>
                  <td className="py-2">() =&gt; {}</td>
                  <td className="py-2">Callback when filter selection changes</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-primary-600">onIntensityChange</td>
                  <td className="py-2">(index: number, intensity: number){'>'}</td>
                  <td className="py-2">() =&gt; &#123;&#125;</td>
                  <td className="py-2">Callback when intensity slider changes</td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>
        </div>

        {/* History Sidebar */}
        <div className="w-full lg:w-80 lg:border-l-2 lg:border-purple-200">
          <HistorySidebar
            history={history}
            onClearHistory={handleClearHistory}
            onLoadEntry={handleDownloadEntry}
          />
        </div>
      </div>
    </div>
    </div>
  )
}
