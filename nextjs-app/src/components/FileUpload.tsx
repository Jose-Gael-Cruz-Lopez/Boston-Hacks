'use client'

import { useState, useRef, useCallback, memo } from 'react'
import Spline from '@splinetool/react-spline/next'

interface FileUploadProps {
  onFileSelect: (file: File) => void
}

const FileUpload = memo(({ onFileSelect }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null)
  const [splineLoaded, setSplineLoaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }, [])

  const handleFiles = useCallback((files: FileList) => {
    const fileArray = Array.from(files)
    setFiles(fileArray)
    
    // Create preview for first file
    const file = fileArray[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      
      // Determine file type
      if (file.type.startsWith('image/')) {
        setFileType('image')
      } else if (file.type.startsWith('video/')) {
        setFileType('video')
      }
    }
    
    if (onFileSelect) {
      onFileSelect(fileArray[0]) // Pass first file to parent
    }
  }, [onFileSelect])

  const openFileExplorer = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div
        className={`relative border-4 border-dashed p-16 transition-colors duration-200 ease-in-out cursor-pointer
            ${dragActive ? 'border-yellow-400 bg-yellow-900/20' : 'border-yellow-400 hover:border-cyan-400'}
            bg-black text-white text-center`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileExplorer}
        style={{
          imageRendering: 'pixelated',
          boxShadow: 'inset 0 0 0 2px #FFE400, 0 0 0 4px #000000',
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={false}
          className="hidden"
          accept="image/*,video/*"
          onChange={handleChange}
        />
        
        {!preview ? (
          <div className="space-y-4">
            <div 
              className="w-32 h-32 mx-auto mb-6 flex items-center justify-center bg-yellow-400"
              style={{
                imageRendering: 'pixelated',
                boxShadow: '0 0 0 4px #000000, 0 8px 0 0 #000000',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}
            >
              {/* Space Invader Icon */}
              <div className="relative w-16 h-16">
                {/* Antennae */}
                <div className="absolute w-2 h-2 bg-black top-0 left-2"></div>
                <div className="absolute w-2 h-2 bg-black top-0 right-2"></div>
                <div className="absolute w-2 h-2 bg-black top-2 left-2"></div>
                <div className="absolute w-2 h-2 bg-black top-2 right-2"></div>
                
                {/* Eyes */}
                <div className="absolute w-2 h-2 bg-black top-4 left-4"></div>
                <div className="absolute w-2 h-2 bg-black top-4 right-4"></div>
                
                {/* Main body */}
                <div className="absolute w-2 h-2 bg-black top-6 left-2"></div>
                <div className="absolute w-2 h-2 bg-black top-6 left-4"></div>
                <div className="absolute w-2 h-2 bg-black top-6 left-6"></div>
                <div className="absolute w-2 h-2 bg-black top-6 left-8"></div>
                <div className="absolute w-2 h-2 bg-black top-6 left-10"></div>
                <div className="absolute w-2 h-2 bg-black top-6 right-2"></div>
                <div className="absolute w-2 h-2 bg-black top-6 right-4"></div>
                <div className="absolute w-2 h-2 bg-black top-6 right-6"></div>
                <div className="absolute w-2 h-2 bg-black top-6 right-8"></div>
                <div className="absolute w-2 h-2 bg-black top-6 right-10"></div>
                
                {/* Middle section */}
                <div className="absolute w-2 h-2 bg-black top-8 left-2"></div>
                <div className="absolute w-2 h-2 bg-black top-8 left-4"></div>
                <div className="absolute w-2 h-2 bg-black top-8 left-6"></div>
                <div className="absolute w-2 h-2 bg-black top-8 left-8"></div>
                <div className="absolute w-2 h-2 bg-black top-8 left-10"></div>
                <div className="absolute w-2 h-2 bg-black top-8 right-2"></div>
                <div className="absolute w-2 h-2 bg-black top-8 right-4"></div>
                <div className="absolute w-2 h-2 bg-black top-8 right-6"></div>
                <div className="absolute w-2 h-2 bg-black top-8 right-8"></div>
                <div className="absolute w-2 h-2 bg-black top-8 right-10"></div>
                
                {/* Lower body */}
                <div className="absolute w-2 h-2 bg-black top-10 left-2"></div>
                <div className="absolute w-2 h-2 bg-black top-10 left-4"></div>
                <div className="absolute w-2 h-2 bg-black top-10 left-6"></div>
                <div className="absolute w-2 h-2 bg-black top-10 left-8"></div>
                <div className="absolute w-2 h-2 bg-black top-10 left-10"></div>
                <div className="absolute w-2 h-2 bg-black top-10 right-2"></div>
                <div className="absolute w-2 h-2 bg-black top-10 right-4"></div>
                <div className="absolute w-2 h-2 bg-black top-10 right-6"></div>
                <div className="absolute w-2 h-2 bg-black top-10 right-8"></div>
                <div className="absolute w-2 h-2 bg-black top-10 right-10"></div>
                
                {/* Legs */}
                <div className="absolute w-2 h-2 bg-black top-12 left-2"></div>
                <div className="absolute w-2 h-2 bg-black top-12 left-4"></div>
                <div className="absolute w-2 h-2 bg-black top-12 left-6"></div>
                <div className="absolute w-2 h-2 bg-black top-12 right-2"></div>
                <div className="absolute w-2 h-2 bg-black top-12 right-4"></div>
                <div className="absolute w-2 h-2 bg-black top-12 right-6"></div>
                
                <div className="absolute w-2 h-2 bg-black top-14 left-2"></div>
                <div className="absolute w-2 h-2 bg-black top-14 left-4"></div>
                <div className="absolute w-2 h-2 bg-black top-14 right-2"></div>
                <div className="absolute w-2 h-2 bg-black top-14 right-4"></div>
              </div>
            </div>
            <div 
              className="text-yellow-400"
              style={{ 
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '1rem',
                textShadow: '3px 3px 0px #000000',
                imageRendering: 'pixelated'
              }}
            >
              {dragActive ? "> DROP HERE <" : "> DRAG & DROP <"}
            </div>
            <div 
              className="text-cyan-400"
              style={{ 
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '0.8rem',
                textShadow: '2px 2px 0px #000000',
                imageRendering: 'pixelated'
              }}
            >
              OR CLICK TO BROWSE FILES
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <div 
              className="relative max-w-2xl mx-auto"
              style={{
                imageRendering: 'pixelated',
                boxShadow: '0 0 0 4px #000000, 0 8px 0 0 #000000',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}
            >
              {fileType === 'image' ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-96 object-cover"
                  style={{ imageRendering: 'pixelated' }}
                />
              ) : (
                <video
                  src={preview}
                  className="w-full h-96 object-cover"
                  controls
                  style={{ imageRendering: 'pixelated' }}
                />
              )}
            </div>
            
            {/* File Info */}
            <div>
              <p 
                className="text-yellow-400 mb-2"
                style={{ 
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: '0.5rem',
                  textShadow: '2px 2px 0px #000000',
                  imageRendering: 'pixelated'
                }}
              >
                FILE UPLOADED SUCCESSFULLY!
              </p>
              <p 
                className="text-cyan-400"
                style={{ 
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: '0.4rem',
                  textShadow: '2px 2px 0px #000000',
                  imageRendering: 'pixelated'
                }}
              >
                CLICK TO CHANGE FILE
              </p>
            </div>
          </div>
        )}
      </div>

      {files.length > 0 && !preview && (
        <div className="mt-6 space-y-3">
          {files.map((file, index) => (
            <div 
              key={index} 
              className="bg-gray-900 p-4 text-white"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '0.5rem',
                textShadow: '2px 2px 0px #000000',
                imageRendering: 'pixelated',
                boxShadow: '0 0 0 2px #FFE400, 0 0 0 4px #000000',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}
            >
              📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

FileUpload.displayName = 'FileUpload'

export default FileUpload