'use client'

import { useEffect, useRef } from 'react'
import anime from 'animejs'

export default function CassetteLoader() {
  const waveformRef = useRef<HTMLDivElement>(null)
  const tapeRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate waveform bars
    if (waveformRef.current) {
      const bars = waveformRef.current.querySelectorAll('.waveform-bar')
      
      anime({
        targets: bars,
        scaleY: [
          { value: [0.3, 1], duration: 400 },
          { value: [1, 0.3], duration: 400 }
        ],
        delay: anime.stagger(50, { start: 0, direction: 'normal' }),
        loop: true,
        easing: 'easeInOutSine'
      })
    }

    // Animate tape reels rotation
    if (tapeRef.current) {
      const reels = tapeRef.current.querySelectorAll('.reel')
      
      anime({
        targets: reels,
        rotate: '360deg',
        duration: 2000,
        loop: true,
        easing: 'linear'
      })
    }

    // Animate timer
    let startTime = 0
    const animateTimer = () => {
      startTime += 0.1
      if (timerRef.current) {
        const minutes = Math.floor(startTime / 60)
        const seconds = Math.floor(startTime % 60)
        const centiseconds = Math.floor((startTime % 1) * 100)
        timerRef.current.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(centiseconds).padStart(2, '0')}`
      }
    }

    const timerInterval = setInterval(animateTimer, 100)

    return () => {
      clearInterval(timerInterval)
    }
  }, [])

  // Generate waveform bars with varying heights
  const waveformData = [
    0.9, 0.95, 0.85, 0.7, 0.6, 0.75, 0.5, 0.4, 0.8, 0.6, 0.7, 0.8, 0.9, 0.95, 0.85,
    0.7, 0.6, 0.5, 0.4, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.85, 0.7, 0.6, 0.75,
    0.8, 0.85, 0.7, 0.6, 0.5, 0.4, 0.3, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85,
    0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1
  ]

  return (
    <div className="fixed inset-0 bg-[#c4c4a0] flex items-center justify-center z-50">
      <div className="relative w-full max-w-7xl h-screen flex flex-col">
        {/* Top Controls */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="font-mono text-sm text-gray-800">MUSIC PLAYER<br/>HF-S 800</div>
            <div className="flex space-x-2">
              <div className="w-6 h-6 border-2 border-gray-800 rounded-full"></div>
              <div className="w-6 h-6 border-2 border-gray-800 rounded-full"></div>
              <div className="w-6 h-6 border-2 border-gray-800 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <div className="font-mono text-sm text-gray-800">RECORD START</div>
          </div>

          {/* Cassette Logo */}
          <div className="flex items-center space-x-8">
            <div className="text-4xl">⬅</div>
            <div className="font-bold text-2xl text-gray-800 tracking-wider">
              <div className="border-4 border-gray-800 px-4 py-1 skew-x-[-10deg]">
                SOUNDEX
              </div>
            </div>
            <div className="text-4xl">➡</div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="font-mono text-sm text-gray-800">TYPE 1 NORMAL POSITION</div>
            <div className="flex space-x-2">
              <div className="w-6 h-6 border-2 border-gray-800 rounded-full"></div>
              <div className="w-6 h-6 border-2 border-gray-800 rounded-full"></div>
              <div className="w-6 h-6 border-2 border-gray-800 rounded-full"></div>
            </div>
            <div className="font-mono text-sm text-gray-800 cursor-pointer hover:text-gray-600">BUY NOW</div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative border-t-2 border-b-2 border-gray-800">
          {/* Waveform Bars */}
          <div ref={waveformRef} className="absolute inset-0 flex items-end justify-start px-4 space-x-[2px]">
            {waveformData.map((height, index) => (
              <div
                key={index}
                className="waveform-bar bg-gray-800 w-3 rounded-t-sm"
                style={{ height: `${height * 100}%`, transformOrigin: 'bottom' }}
              ></div>
            ))}
          </div>

          {/* Tape Section - Center Orange Bar */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Top Triangle */}
              <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[40px] border-b-[#d9582a] mx-auto"></div>
              
              {/* Main Bar */}
              <div className="w-4 h-[600px] bg-[#d9582a] mx-auto relative">
                {/* Tape Reels */}
                <div ref={tapeRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="reel w-8 h-8 border-4 border-gray-800 rounded-full bg-[#c4c4a0]"></div>
                </div>
              </div>
              
              {/* Bottom Triangle */}
              <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[40px] border-t-[#d9582a] mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div ref={timerRef} className="font-mono text-xl text-[#d9582a] bg-gray-800 px-3 py-1 rounded">
              00:02:70
            </div>
            <div className="font-mono text-sm text-gray-800 bg-[#d9582a] px-3 py-1 rounded">
              REC
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="font-mono text-sm text-gray-800">mp3</div>
            <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
            <div className="font-mono text-sm text-gray-800">320kb</div>
            <div className="text-2xl text-[#d9582a]">▶</div>
          </div>
        </div>
      </div>
    </div>
  )
}
