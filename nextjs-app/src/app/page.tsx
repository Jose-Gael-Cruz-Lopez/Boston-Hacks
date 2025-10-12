'use client'

import { useRef, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import FileUpload from '@/components/FileUpload'
import Spline from '@splinetool/react-spline/next'

// Spline background component
const SplineBackground = memo(() => (
  <div className="absolute inset-0 z-0">
    <Spline
      scene="https://prod.spline.design/ECTH03eM7WHe5yWz/scene.splinecode" 
    />
  </div>
))

SplineBackground.displayName = 'SplineBackground'

const Home = memo(() => {
  const selectedFileRef = useRef<File | null>(null)
  const promptRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  const handleFileSelect = useCallback((file: File) => {
    selectedFileRef.current = file
  }, [])

  const handleGenerateChanges = useCallback(() => {
    const promptValue = promptRef.current?.value || ''
    const file = selectedFileRef.current
    
    if (!file || !promptValue.trim()) {
      alert('Please upload a file and enter a prompt')
      return
    }
    
    try {
      // Store file and prompt in sessionStorage for the loading page
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size
      }
      
      sessionStorage.setItem('uploadData', JSON.stringify({
        file: fileData,
        prompt: promptValue.trim()
      }))
      
      // Navigate to loading page
      router.push('/loading')
    } catch (error) {
      console.error('Error storing upload data:', error)
      alert('Error processing your request. Please try again.')
    }
  }, [router])

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Full-screen Spline Background - Isolated to prevent re-renders */}
      <SplineBackground />
      
      {/* Main Content */}
      <div className="relative z-30 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-8xl mx-auto text-center">
          {/* File Upload Component */}
          <div className="mb-16">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
          
          {/* Prompt Input */}
          <div className="mb-16">
            <textarea
              ref={promptRef}
              placeholder="DESCRIBE THE VIBE..."
              className="w-full max-w-6xl mx-auto p-10 bg-black border-4 border-dashed border-yellow-400 text-yellow-400 pixel-font resize-none focus:outline-none focus:border-cyan-400 transition-colors duration-200"
              rows={8}
              style={{ 
                fontFamily: '"Press Start 2P", monospace', 
                fontSize: '1.2rem',
                imageRendering: 'pixelated',
                textShadow: '2px 2px 0px #000000',
                boxShadow: 'inset 0 0 0 2px #FFE400, 0 0 0 4px #000000',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}
            />
          </div>
          
          {/* Generate Changes Button */}
          <button
            onClick={handleGenerateChanges}
            className="pixel-button"
            style={{ 
              color: '#000',
              backgroundColor: '#FFE400',
              padding: '20px 52px',
              margin: '10px',
              fontSize: '18px',
              fontFamily: '"Press Start 2P", system-ui',
              border: '0',
              boxShadow: '0px 5px black, 0px -5px black, 5px 0px black, -5px 0px black, 0px 10px #00000038, 5px 5px #00000038, -5px 5px #00000038, inset 0px 5px #ffffff36',
              cursor: 'pointer',
              transition: 'transform 0.1s ease'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(5px)'
              e.currentTarget.style.boxShadow = '0px 5px black, 0px -5px black, 5px 0px black, -5px 0px black, inset 0px 5px #00000038'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0px 5px black, 0px -5px black, 5px 0px black, -5px 0px black, 0px 10px #00000038, 5px 5px #00000038, -5px 5px #00000038, inset 0px 5px #ffffff36'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0px 5px black, 0px -5px black, 5px 0px black, -5px 0px black, 0px 10px #00000038, 5px 5px #00000038, -5px 5px #00000038, inset 0px 5px #ffffff36'
            }}
          >
            &gt; AUGMENT &lt;
          </button>
        </div>
      </div>
    </main>
  )
})

Home.displayName = 'Home'

export default Home