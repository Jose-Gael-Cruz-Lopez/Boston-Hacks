'use client'

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Storyboard Component
 * Displays an animated horizontal carousel of preview images
 * - Sequential fade/slide animations on mount
 * - Click to select and highlight an image
 * - Responsive: horizontal on desktop, vertical on mobile
 */

interface Change {
  title: string;
  filterOptions: string[];
  intensity: number;
  previewUrl: string;
}

interface StoryboardProps {
  changes: Change[];
  selectedIndex: number;
  onSelectImage: (index: number) => void;
  isLoading?: number | null; // Index of image currently loading
}

export function Storyboard({ changes, selectedIndex, onSelectImage, isLoading }: StoryboardProps) {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Trigger sequential animation on mount
    setHasAnimated(true);
  }, []);

  return (
    <div className="w-full overflow-x-auto pb-6">
      {/* Desktop: Horizontal scrolling carousel */}
      <div className="hidden md:flex gap-4 px-4 min-w-max">
        <AnimatePresence mode="wait">
          {changes.map((change, index) => (
            <motion.div
              key={index}
              initial={hasAnimated ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: hasAnimated ? 0 : index * 0.15,
                ease: "easeOut" 
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectImage(index)}
              className="relative cursor-pointer group"
            >
              {/* Image container with pixel border */}
              <div 
                className={`
                  relative w-48 h-48 border-4 transition-all duration-300
                  ${selectedIndex === index 
                    ? 'border-yellow-400 pixel-glow scale-105' 
                    : 'border-yellow-400/50 hover:border-yellow-400/50'
                  }
                `}
                style={{
                  imageRendering: 'pixelated',
                  boxShadow: selectedIndex === index 
                    ? 'inset 0 0 0 2px #FFE400, 0 0 0 4px #000000, 0 8px 0 0 #000000'
                    : 'inset 0 0 0 2px #FFE400, 0 0 0 4px #000000',
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}
              >
                {/* Preview image */}
                <img 
                  src={change.previewUrl} 
                  alt={change.title}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: 'pixelated' }}
                />
                
                {/* Pixel loading overlay */}
                {isLoading === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/90 flex items-center justify-center"
                  >
                    <div className="relative">
                      <div 
                        className="w-16 h-16 border-4 border-yellow-400 animate-pixel-pulse"
                        style={{
                          imageRendering: 'pixelated',
                          boxShadow: '0 0 10px rgba(255, 228, 0, 0.5)',
                          clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))'
                        }}
                      />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Selection indicator */}
                {selectedIndex === index && (
                  <motion.div
                    layoutId="selector"
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-400 rotate-45"
                    style={{
                      imageRendering: 'pixelated',
                      boxShadow: '0 0 0 2px #000000',
                      clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))'
                    }}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  />
                )}
              </div>

              {/* Title label */}
              <motion.p 
                className={`
                  mt-3 text-center font-pixel text-[10px] uppercase tracking-wider
                  ${selectedIndex === index ? 'text-yellow-400' : 'text-yellow-400/70'}
                `}
                style={{
                  textShadow: '1px 1px 0px #000000',
                  imageRendering: 'pixelated'
                }}
              >
                {change.title}
              </motion.p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Mobile: Vertical stack */}
      <div className="flex md:hidden flex-col gap-6 px-4">
        {changes.map((change, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1,
              ease: "easeOut" 
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectImage(index)}
            className="relative cursor-pointer"
          >
            <div 
              className={`
                relative w-full aspect-square border-4 transition-all duration-300
                ${selectedIndex === index 
                  ? 'border-yellow-400 pixel-glow' 
                  : 'border-yellow-400/50'
                }
              `}
              style={{
                imageRendering: 'pixelated',
                boxShadow: selectedIndex === index 
                  ? 'inset 0 0 0 2px #FFE400, 0 0 0 4px #000000, 0 8px 0 0 #000000'
                  : 'inset 0 0 0 2px #FFE400, 0 0 0 4px #000000',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}
            >
              <img 
                src={change.previewUrl} 
                alt={change.title}
                className="w-full h-full object-cover"
                style={{ imageRendering: 'pixelated' }}
              />
              
              {isLoading === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/90 flex items-center justify-center"
                >
                  <div className="relative">
                    <div 
                      className="w-16 h-16 border-4 border-yellow-400 animate-pixel-pulse"
                      style={{
                        imageRendering: 'pixelated',
                        boxShadow: '0 0 10px rgba(255, 228, 0, 0.5)',
                        clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))'
                      }}
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent"
                    />
                  </div>
                </motion.div>
              )}
            </div>
            
            <p 
              className={`
                mt-2 font-pixel text-xs uppercase
                ${selectedIndex === index ? 'text-yellow-400' : 'text-yellow-400/70'}
              `}
              style={{
                textShadow: '1px 1px 0px #000000',
                imageRendering: 'pixelated'
              }}
            >
              {change.title}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}