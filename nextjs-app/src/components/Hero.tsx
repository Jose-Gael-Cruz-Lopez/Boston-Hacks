'use client'

import { useState, useEffect } from 'react'

interface HeroProps {
  title?: string
  subtitle?: string
  description?: string
}

export default function Hero({ 
  title = "Next.js TypeScript Tailwind App",
  subtitle = "Modern Web Development",
  description = "A powerful combination of Next.js, TypeScript, and Tailwind CSS for building modern web applications."
}: HeroProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="section bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="container">
        <div className="text-center">
          <div
            className={`space-y-6 transition-all duration-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <h1 className="heading-1 text-white">
              {title}
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              {subtitle}
            </p>
            <p className="text-body text-primary-200 max-w-2xl mx-auto">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button className="btn-primary bg-white text-primary-600 hover:bg-primary-50">
                Get Started
              </button>
              <button className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
