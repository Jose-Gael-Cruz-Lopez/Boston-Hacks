'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sliders, Settings, Edit3, Check, X } from 'lucide-react'

interface ChangeCardProps {
  change: {
    title: string
    filterOptions: string[]
    intensity: number
  }
  index: number
  onFilterChange: (index: number, selectedFilter: string) => void
  onIntensityChange: (index: number, intensity: number) => void
  onTitleChange: (index: number, newTitle: string) => void
}

function ChangeCard({ change, index, onFilterChange, onIntensityChange, onTitleChange }: ChangeCardProps) {
  const [selectedFilter, setSelectedFilter] = useState(change.filterOptions[0] || '')
  const [intensity, setIntensity] = useState(change.intensity)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editingTitle, setEditingTitle] = useState(change.title)

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value
    setSelectedFilter(newFilter)
    onFilterChange(index, newFilter)
  }

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIntensity = parseInt(e.target.value)
    setIntensity(newIntensity)
    onIntensityChange(index, newIntensity)
  }

  const handleTitleEdit = () => {
    setIsEditingTitle(true)
    setEditingTitle(change.title)
  }

  const handleTitleSave = () => {
    onTitleChange(index, editingTitle)
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
      className="bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 border-2 border-purple-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
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
                <h3 className="font-mono text-lg font-bold text-purple-800">{change.title}</h3>
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

      {/* Filter Selection */}
      <div className="mb-4">
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
            <span className="text-sm font-mono font-bold text-purple-800">{intensity}%</span>
            <span className={`text-xs px-2 py-1 rounded-full text-white bg-gradient-to-r ${getIntensityColor(intensity)} shadow-md`}>
              {getIntensityLabel(intensity)}
            </span>
          </div>
        </div>

        <div className="relative">
          <input
            id={`intensity-${index}`}
            type="range"
            min="0"
            max="100"
            value={intensity}
            onChange={handleIntensityChange}
            className="w-full h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer slider shadow-inner"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${intensity}%, #e5e7eb ${intensity}%, #e5e7eb 100%)`
            }}
          />
          
          {/* Custom slider thumb */}
          <div
            className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white rounded-full shadow-lg cursor-pointer"
            style={{ left: `calc(${intensity}% - 10px)` }}
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

      {/* Preview info */}
      <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
        <div className="flex items-center space-x-2 text-sm text-purple-700 font-mono">
          <Sliders size={16} />
          <span>Preview: {selectedFilter} at {intensity}% intensity</span>
        </div>
      </div>
    </motion.div>
  )
}

interface ChangeCardsListProps {
  changes: Array<{
    title: string
    filterOptions: string[]
    intensity: number
  }>
  onFilterChange?: (index: number, selectedFilter: string) => void
  onIntensityChange?: (index: number, intensity: number) => void
  onTitleChange?: (index: number, newTitle: string) => void
}

export default function ChangeCardsList({ 
  changes, 
  onFilterChange = () => {}, 
  onIntensityChange = () => {},
  onTitleChange = () => {}
}: ChangeCardsListProps) {
  if (changes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Settings size={32} className="text-purple-600" />
        </div>
        <h3 className="text-lg font-mono font-bold text-purple-800 mb-2">No Changes Available</h3>
        <p className="text-purple-600">Upload a file and generate changes to see them here</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-mono font-bold text-purple-800">Editing Changes</h2>
        <span className="text-sm text-purple-600 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full border border-purple-200 font-mono">
          {changes.length} change{changes.length !== 1 ? 's' : ''}
        </span>
      </div>

      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {changes.map((change, index) => (
            <ChangeCard
              key={index}
              change={change}
              index={index}
              onFilterChange={onFilterChange}
              onIntensityChange={onIntensityChange}
              onTitleChange={onTitleChange}
            />
          ))}
        </div>
      </AnimatePresence>

      {/* Summary */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-50 to-cyan-100 border-2 border-purple-200 rounded-xl p-4 shadow-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Settings size={20} className="text-purple-600" />
          <h3 className="font-mono font-bold text-purple-800">Changes Summary</h3>
        </div>
        <p className="text-sm text-purple-700 font-mono">
          {changes.length} editing change{changes.length !== 1 ? 's' : ''} ready to apply. 
          Adjust the filters and intensity levels above, then apply the changes to your media.
        </p>
      </div>
    </div>
  )
}
