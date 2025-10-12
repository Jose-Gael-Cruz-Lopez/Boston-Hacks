'use client'

import { useState, useEffect } from 'react'
import CassetteLoader from './CassetteLoader'
import anime from 'animejs'

interface LoadingWrapperProps {
  children: React.ReactNode
  minLoadingTime?: number // Minimum time to show loader in ms
}

export default function LoadingWrapper({ children, minLoadingTime = 3000 }: LoadingWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      // Fade out animation
      anime({
        targets: '.cassette-loader',
        opacity: [1, 0],
        duration: 1000,
        easing: 'easeOutQuad',
        complete: () => {
          setIsLoading(false)
          setShowContent(true)
          
          // Fade in content
          anime({
            targets: '.main-content',
            opacity: [0, 1],
            duration: 1000,
            easing: 'easeInQuad'
          })
        }
      })
    }, minLoadingTime)

    return () => clearTimeout(timer)
  }, [minLoadingTime])

  return (
    <>
      {isLoading && (
        <div className="cassette-loader">
          <CassetteLoader />
        </div>
      )}
      {showContent && (
        <div className="main-content opacity-0">
          {children}
        </div>
      )}
    </>
  )
}
