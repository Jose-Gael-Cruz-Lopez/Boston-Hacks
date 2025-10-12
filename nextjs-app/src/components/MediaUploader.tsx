'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image, Video, File } from 'lucide-react'

interface MediaUploaderProps {
  onChange: (file: File | null) => void
  accept?: string
  maxSize?: number // in MB
  className?: string
  disabled?: boolean
  placeholder?: string
  showPrompt?: boolean
  promptValue?: string
  onPromptChange?: (prompt: string) => void
  onGenerateChanges?: () => void
  isGenerating?: boolean
}

export default function MediaUploader({
  onChange,
  accept = 'image/*,video/*',
  maxSize = 10, // 10MB default
  className = '',
  disabled = false,
  placeholder = 'Drag and drop your media here, or click to browse',
  showPrompt = false,
  promptValue = '',
  onPromptChange,
  onGenerateChanges,
  isGenerating = false
}: MediaUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    // Check file type
    const acceptedTypes = accept.split(',').map(type => type.trim())
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1))
      }
      return file.type === type
    })

    if (!isValidType) {
      return 'Invalid file type. Please select an image or video file.'
    }

    return null
  }, [accept, maxSize])

  const handleFileSelect = useCallback((selectedFile: File) => {
    const validationError = validateFile(selectedFile)
    
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setFile(selectedFile)
    onChange(selectedFile)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }, [validateFile, onChange])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    if (disabled) return

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }, [disabled, handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }, [disabled])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }, [handleFileSelect])

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setFile(null)
    setPreview(null)
    setError(null)
    onChange(null)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onChange])

  const getFileIcon = () => {
    if (!file) return <Upload size={32} className="text-gray-400" />
    
    if (file.type.startsWith('image/')) {
      return <Image size={32} className="text-blue-500" />
    } else if (file.type.startsWith('video/')) {
      return <Video size={32} className="text-purple-500" />
    } else {
      return <File size={32} className="text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`w-full ${className}`}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragOver 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
      >
        {preview ? (
          <div className="space-y-4">
            {/* Preview */}
            <div className="relative inline-block">
              {file?.type.startsWith('image/') ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 max-w-full rounded-lg shadow-md"
                />
              ) : file?.type.startsWith('video/') ? (
                <video
                  src={preview}
                  controls
                  className="max-h-64 max-w-full rounded-lg shadow-md"
                />
              ) : null}
              
              {/* Remove Button */}
              <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            {/* File Info */}
            <div className="text-left">
              <p className="font-medium text-gray-800">{file?.name}</p>
              <p className="text-sm text-gray-500">
                {file && formatFileSize(file.size)}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Icon */}
            <div className="flex justify-center">
              {getFileIcon()}
            </div>

            {/* Text */}
            <div>
              <p className="text-lg font-medium text-gray-800 mb-2">
                {error ? 'Upload Error' : 'Upload Media'}
              </p>
              <p className="text-gray-600 mb-4">
                {error || placeholder}
              </p>
              <p className="text-sm text-gray-500">
                Supports: Images and Videos (max {maxSize}MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* File Info */}
      {file && !error && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-green-700 text-sm">
              File uploaded successfully
            </p>
          </div>
        </div>
      )}

      {/* Prompt Section */}
      {showPrompt && file && !error && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt-textarea" className="block text-sm font-medium text-gray-700 mb-2">
                Describe the vibe...
              </label>
              <textarea
                id="prompt-textarea"
                value={promptValue}
                onChange={(e) => onPromptChange?.(e.target.value)}
                placeholder="Describe the vibe..."
                className="input-field min-h-[100px] resize-none"
                disabled={disabled || isGenerating}
              />
            </div>
            
            {onGenerateChanges && (
              <div className="flex justify-end">
                <button
                  onClick={onGenerateChanges}
                  disabled={!promptValue.trim() || disabled || isGenerating}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            )}
          </div>
        </div>
      )}
    </div>
  )
}
