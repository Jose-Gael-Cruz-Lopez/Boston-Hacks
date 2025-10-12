'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ChangeObject {
  title: string
  filterOptions: string[]
  intensity: number
  previewUrl: string
}

interface WorkflowCardProps {
  change: ChangeObject
  index: number
  onTitleChange: (index: number, title: string) => void
  onFilterChange: (index: number, filter: string) => void
  onIntensityChange: (index: number, intensity: number) => void
}

export default function WorkflowCard({
  change,
  index,
  onTitleChange,
  onFilterChange,
  onIntensityChange
}: WorkflowCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editingTitle, setEditingTitle] = useState(change.title)
  const [selectedFilter, setSelectedFilter] = useState(change.filterOptions[0] || '')

  const handleTitleClick = () => {
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value
    setSelectedFilter(newFilter)
    onFilterChange(index, newFilter)
  }

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIntensity = parseInt(e.target.value)
    onIntensityChange(index, newIntensity)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-black/70 border-2 border-yellow-400 p-6 pixel-border"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Title and Controls */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            {isEditingTitle ? (
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyPress}
                className="w-full bg-black border-2 border-cyan-400 text-yellow-400 pixel-font text-lg p-2 focus:outline-none"
                autoFocus
              />
            ) : (
              <h3
                onClick={handleTitleClick}
                className="text-yellow-400 pixel-font text-lg cursor-pointer hover:text-cyan-400 transition-colors duration-200"
              >
                {change.title}
              </h3>
            )}
          </div>

          {/* Filter Dropdown */}
          <div>
            <label className="block text-gray-300 terminal-font text-sm mb-2">
              Filter:
            </label>
            <select
              value={selectedFilter}
              onChange={handleFilterChange}
              className="w-full bg-black border-2 border-yellow-400 text-gray-300 terminal-font p-2 focus:outline-none focus:border-cyan-400"
            >
              {change.filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Intensity Slider */}
          <div>
            <label className="block text-gray-300 terminal-font text-sm mb-2">
              Intensity: {change.intensity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={change.intensity}
              onChange={handleIntensityChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="md:col-span-2">
          <div className="relative">
            <img
              src={change.previewUrl}
              alt={`Preview ${change.title}`}
              className="w-full h-48 object-cover pixel-border"
            />
            <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 pixel-border">
              <span className="text-yellow-400 pixel-font text-xs">
                {change.intensity}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
