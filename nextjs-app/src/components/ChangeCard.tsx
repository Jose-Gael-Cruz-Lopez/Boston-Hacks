'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Check, X, Settings } from 'lucide-react'

interface ChangeObject {
  title: string
  filterOptions: string[]
  intensity: number
  previewUrl: string
}

interface ChangeCardProps {
  change: ChangeObject
  index: number
  onUpdate: (updates: Partial<ChangeObject>) => void
}

export default function ChangeCard({ change, index, onUpdate }: ChangeCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editingTitle, setEditingTitle] = useState(change.title)
  const [selectedFilter, setSelectedFilter] = useState(change.filterOptions[0] || '')

  // Handle title editing
  const handleTitleEdit = () => {
    setIsEditingTitle(true)
    setEditingTitle(change.title)
  }

  const handleTitleSave = () => {
    onUpdate({ title: editingTitle })
    setIsEditingTitle(false)
  }

  const handleTitleCancel = () => {
    setEditingTitle(change.title)
    setIsEditingTitle(false)
  }

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave()
    } else if (e.key === 'Escape') {
      handleTitleCancel()
    }
  }

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value
    setSelectedFilter(newFilter)
    onUpdate({ filterOptions: [...change.filterOptions] })
  }

  // Handle intensity change
  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIntensity = parseInt(e.target.value)
    onUpdate({ intensity: newIntensity })
  }

  // Generate preview URL based on current settings
  const generatePreviewUrl = () => {
    // Simulate preview generation based on filter and intensity
    const intensity = change.intensity
    const filter = selectedFilter.toLowerCase()
    
    let color = '#8b5cf6' // Default purple
    
    if (filter.includes('sepia')) color = '#f59e0b'
    else if (filter.includes('cyan')) color = '#06b6d4'
    else if (filter.includes('pink')) color = '#ec4899'
    else if (filter.includes('green')) color = '#10b981'
    else if (filter.includes('vintage')) color = '#92400e'
    else if (filter.includes('neon')) color = '#00ff00'
    
    // Adjust opacity based on intensity
    const opacity = Math.round((intensity / 100) * 255).toString(16).padStart(2, '0')
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='${color}' fill-opacity='0.${opacity}'/%3E%3C/svg%3E`
  }

  const getIntensityColor = (value: number) => {
    if (value <= 25) return 'from-gray-400 to-gray-500'
    if (value <= 50) return 'from-blue-400 to-blue-500'
    if (value <= 75) return 'from-orange-400 to-orange-500'
    return 'from-red-400 to-red-500'
  }

  const getIntensityLabel = (value: number) => {
    if (value <= 20) return 'Subtle'
    if (value <= 40) return 'Light'
    if (value <= 60) return 'Moderate'
    if (value <= 80) return 'Strong'
    return 'Intense'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white/90 backdrop-blur-sm border-2 border-white/30 rounded-xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg shadow-md">
            <Settings size={20} className="text-white" />
          </div>
          <div className="flex-1">
            {isEditingTitle ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={handleTitleKeyPress}
                  className="font-mono text-lg font-bold bg-white/80 border-2 border-purple-300 rounded px-2 py-1 focus:outline-none focus:border-purple-500"
                  autoFocus
                />
                <button
                  onClick={handleTitleSave}
                  className="p-1 text-green-600 hover:text-green-800 transition-colors"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleTitleCancel}
                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h3 
                  className="font-mono text-lg font-bold text-purple-800 cursor-pointer hover:text-purple-600 transition-colors"
                  onClick={handleTitleEdit}
                >
                  {change.title}
                </h3>
                <button
                  onClick={handleTitleEdit}
                  className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Edit3 size={16} />
                </button>
              </div>
            )}
            <p className="text-sm text-purple-600">Adjust the filter and intensity</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          {/* Filter Selection */}
          <div>
            <label htmlFor={`filter-${index}`} className="block text-sm font-mono font-bold text-purple-700 mb-2">
              Filter
            </label>
            <select
              id={`filter-${index}`}
              value={selectedFilter}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 font-mono shadow-inner"
            >
              {change.filterOptions.map((filter, filterIndex) => (
                <option key={filterIndex} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
          </div>

          {/* Intensity Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor={`intensity-${index}`} className="text-sm font-mono font-bold text-purple-700">
                Intensity
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono font-bold text-purple-800">{change.intensity}%</span>
                <span className={`text-xs px-2 py-1 rounded-full text-white bg-gradient-to-r ${getIntensityColor(change.intensity)} shadow-md`}>
                  {getIntensityLabel(change.intensity)}
                </span>
              </div>
            </div>

            <div className="relative">
              <input
                id={`intensity-${index}`}
                type="range"
                min="0"
                max="100"
                value={change.intensity}
                onChange={handleIntensityChange}
                className="w-full h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer slider shadow-inner"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${change.intensity}%, #e5e7eb ${change.intensity}%, #e5e7eb 100%)`
                }}
              />
              
              {/* Custom slider thumb */}
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white rounded-full shadow-lg cursor-pointer"
                style={{ left: `calc(${change.intensity}% - 10px)` }}
              />
            </div>

            {/* Intensity markers */}
            <div className="flex justify-between text-xs text-purple-600 font-mono">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-sm font-mono font-bold text-purple-700 mb-3">Preview</h4>
          <div className="relative">
            <img
              src={generatePreviewUrl()}
              alt={`${change.title} preview`}
              className="w-32 h-32 rounded-lg border-2 border-purple-300 shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 rounded-lg"></div>
          </div>
          <p className="text-xs text-purple-600 font-mono mt-2 text-center">
            {selectedFilter} at {change.intensity}%
          </p>
        </div>
      </div>
    </motion.div>
  )
}
