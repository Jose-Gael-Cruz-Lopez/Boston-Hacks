'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Spline from '@splinetool/react-spline/next'

interface ChangeObject {
  title: string
  filterOptions: string[]
  intensity: number
  previewUrl: string
}

export default function Loading() {
  const router = useRouter()

  useEffect(() => {
    // Get upload data from sessionStorage
    const uploadData = sessionStorage.getItem('uploadData')
    if (!uploadData) {
      router.push('/')
      return
    }

    const { file, prompt } = JSON.parse(uploadData)

    // Create mock changes for demo
    const mockChanges: ChangeObject[] = [
      {
        title: 'Add Retro Lighting',
        filterOptions: ['Vintage', 'Neon', 'Cyberpunk', 'Synthwave'],
        intensity: 75,
        previewUrl: '/api/placeholder/200/200'
      },
      {
        title: 'Enhance Colors',
        filterOptions: ['Saturated', 'Desaturated', 'High Contrast', 'Pastel'],
        intensity: 60,
        previewUrl: '/api/placeholder/200/200'
      },
      {
        title: 'Add Pixel Effects',
        filterOptions: ['Pixelate', 'Scanlines', 'Chromatic Aberration', 'Glitch'],
        intensity: 85,
        previewUrl: '/api/placeholder/200/200'
      }
    ]

    // Store changes in sessionStorage for the workflow page
    sessionStorage.setItem('generatedChanges', JSON.stringify(mockChanges))

    // Navigate to workflow page after 8 seconds
    const timeout = setTimeout(() => {
      router.push('/workflow')
    }, 8000)

    return () => {
      clearTimeout(timeout)
    }
  }, [router])

  return (
    <main className="min-h-screen bg-black">
      <Spline
        scene="https://prod.spline.design/zV4-yuQGCvm623W8/scene.splinecode" 
        style={{ width: '100vw', height: '100vh' }}
      />
    </main>
  )
}
