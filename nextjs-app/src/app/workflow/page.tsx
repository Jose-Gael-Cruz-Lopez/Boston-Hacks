'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { Storyboard } from "@/components/Storyboard";
import Spline from '@splinetool/react-spline/next';

/**
 * Workflow Page - Static Major Changes Flowchart with Storyboard
 * Displays a flowchart of major changes with arrows and animated storyboard
 * Shows final output image at the bottom
 */

interface MajorChange {
  title: string;
  details: string[];
}

interface Change {
  title: string;
  filterOptions: string[];
  intensity: number;
  previewUrl: string;
}

// Static stack of major changes
const majorChanges: MajorChange[] = [
  {
    title: "majorChange1",
    details: ["Background color changed to blue", "Overlay applied"],
  },
  {
    title: "majorChange2",
    details: ["Brightness increased by 20%", "Contrast adjusted"],
  },
  {
    title: "majorChange3",
    details: ["Saturation enhanced", "Shadow depth added"],
  },
  {
    title: "majorChange4",
    details: ["Filter vintage applied", "Grain texture added"],
  },
  {
    title: "majorChange5",
    details: ["Final color grading", "Sharpness optimized"],
  },
];

// Mock changes for storyboard
const mockChanges: Change[] = [
  {
    title: "Original",
    filterOptions: ["None"],
    intensity: 0,
    previewUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop"
  },
  {
    title: "Vintage",
    filterOptions: ["Sepia", "Grain", "Vignette"],
    intensity: 75,
    previewUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&sat=-50&con=20"
  },
  {
    title: "Neon",
    filterOptions: ["Cyan", "Pink", "Purple"],
    intensity: 60,
    previewUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&sat=100&hue=180"
  },
  {
    title: "Pixel",
    filterOptions: ["Pixelate", "Scanlines", "Chromatic"],
    intensity: 85,
    previewUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&blur=2"
  },
  {
    title: "Final",
    filterOptions: ["Sharpness", "Contrast", "Brightness"],
    intensity: 90,
    previewUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&con=30&sat=20"
  }
];

const FINAL_OUTPUT_IMAGE = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop";

export default function Workflow() {
  const [expandedChanges, setExpandedChanges] = useState<Set<number>>(new Set());
  const [prompt, setPrompt] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const toggleDetails = (index: number) => {
    setExpandedChanges((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Spline Background */}
      <div className="absolute inset-0 z-0">
        <Spline
          scene="https://prod.spline.design/EJInjZoYSRFR1izC/scene.splinecode" 
        />
      </div>
      
      {/* Header */}
      <header className="relative z-10 border-b-4 border-yellow-400 bg-black/80 backdrop-blur-sm p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-4 h-4 bg-yellow-400 animate-pixel-pulse"
              style={{
                imageRendering: 'pixelated',
                boxShadow: '0 0 10px rgba(255, 228, 0, 0.5)',
                clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))'
              }}
            />
            <h1 
              className="font-pixel text-lg md:text-2xl text-yellow-400 uppercase tracking-wider"
              style={{
                textShadow: '3px 3px 0px #000000',
                imageRendering: 'pixelated'
              }}
            >
              PromptStorm
            </h1>
          </div>
          <p 
            className="font-arcade text-sm md:text-base text-yellow-400 mt-2 ml-8"
            style={{
              textShadow: '2px 2px 0px #000000',
              imageRendering: 'pixelated'
            }}
          >
            Workflow Flowchart - Major Changes
          </p>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto p-6 md:p-8 bg-black/60 backdrop-blur-sm">
        {/* Storyboard Section */}
        <section className="mb-12">
          <h2 
            className="font-pixel text-xl text-yellow-400 mb-8 uppercase"
            style={{
              textShadow: '3px 3px 0px #000000',
              imageRendering: 'pixelated'
            }}
          >
            Change Preview Storyboard
          </h2>
          
          <div 
            className="bg-black border-4 border-yellow-400 p-6"
            style={{
              imageRendering: 'pixelated',
              boxShadow: 'inset 0 0 0 2px #FFE400, 0 0 0 4px #000000, 0 8px 0 0 #000000',
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
            }}
          >
            <Storyboard 
              changes={mockChanges}
              selectedIndex={selectedImageIndex}
              onSelectImage={setSelectedImageIndex}
            />
          </div>
        </section>

        {/* Flowchart of Major Changes */}
        <section className="mb-12">
          <h2 
            className="font-pixel text-xl text-yellow-400 mb-8 uppercase"
            style={{
              textShadow: '3px 3px 0px #000000',
              imageRendering: 'pixelated'
            }}
          >
            Change History Flow
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {majorChanges.map((change, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Change Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full"
                >
                  <div 
                    className="bg-black border-4 border-yellow-400 p-6 hover:border-cyan-400 transition-colors"
                    style={{
                      imageRendering: 'pixelated',
                      boxShadow: 'inset 0 0 0 2px #FFE400, 0 0 0 4px #000000, 0 8px 0 0 #000000',
                      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 
                        className="font-pixel text-yellow-400 text-lg md:text-xl uppercase"
                        style={{
                          textShadow: '2px 2px 0px #000000',
                          imageRendering: 'pixelated'
                        }}
                      >
                        {change.title}
                      </h3>
                      <button
                        onClick={() => toggleDetails(index)}
                        className="bg-yellow-400 hover:bg-cyan-400 p-2 transition-colors z-10"
                        style={{
                          imageRendering: 'pixelated',
                          boxShadow: '0 0 0 2px #000000, 0 4px 0 0 #000000',
                          clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'
                        }}
                        aria-label="Toggle details"
                      >
                        {expandedChanges.has(index) ? (
                          <ChevronUp className="w-5 h-5 text-black" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-black" />
                        )}
                      </button>
                    </div>
                    
                    {expandedChanges.has(index) && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 bg-black/50 p-4 border-2 border-yellow-400"
                        style={{
                          imageRendering: 'pixelated',
                          boxShadow: 'inset 0 0 0 2px #FFE400, 0 0 0 2px #000000',
                          clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'
                        }}
                      >
                        {change.details.map((detail, detailIndex) => (
                          <li
                            key={detailIndex}
                            className="font-arcade text-sm md:text-base text-yellow-400 flex items-start gap-2"
                            style={{
                              textShadow: '1px 1px 0px #000000',
                              imageRendering: 'pixelated'
                            }}
                          >
                            <span className="text-yellow-400 mt-1 text-lg">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </div>
                </motion.div>

                {/* Arrow - Show for all except last in row */}
                {index < majorChanges.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="my-4"
                  >
                    {/* Desktop: Right arrow for items not at end of row */}
                    {(index + 1) % 3 !== 0 && (
                      <ArrowRight 
                        className="hidden lg:block text-yellow-400 w-8 h-8" 
                        style={{
                          filter: 'drop-shadow(2px 2px 0px #000000)',
                          imageRendering: 'pixelated'
                        }}
                      />
                    )}
                    {/* Desktop: Down arrow for items at end of row */}
                    {(index + 1) % 3 === 0 && (
                      <ArrowDown 
                        className="hidden lg:block text-yellow-400 w-8 h-8" 
                        style={{
                          filter: 'drop-shadow(2px 2px 0px #000000)',
                          imageRendering: 'pixelated'
                        }}
                      />
                    )}
                    {/* Tablet: Right arrow for items not at end of row */}
                    {(index + 1) % 2 !== 0 && (
                      <ArrowRight 
                        className="hidden md:block lg:hidden text-yellow-400 w-8 h-8" 
                        style={{
                          filter: 'drop-shadow(2px 2px 0px #000000)',
                          imageRendering: 'pixelated'
                        }}
                      />
                    )}
                    {/* Tablet: Down arrow for items at end of row */}
                    {(index + 1) % 2 === 0 && (
                      <ArrowDown 
                        className="hidden md:block lg:hidden text-yellow-400 w-8 h-8" 
                        style={{
                          filter: 'drop-shadow(2px 2px 0px #000000)',
                          imageRendering: 'pixelated'
                        }}
                      />
                    )}
                    {/* Mobile: Always down arrow */}
                    <ArrowDown 
                      className="md:hidden text-yellow-400 w-8 h-8" 
                      style={{
                        filter: 'drop-shadow(2px 2px 0px #000000)',
                        imageRendering: 'pixelated'
                      }}
                    />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final Output Image */}
        <section className="border-t-4 border-yellow-400 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 
              className="font-pixel text-xl text-yellow-400 mb-6 uppercase text-center"
              style={{
                textShadow: '3px 3px 0px #000000',
                imageRendering: 'pixelated'
              }}
            >
              Final Output
            </h2>
            <div className="flex justify-center mb-8">
              <div 
                className="bg-black border-4 border-yellow-400 p-4 max-w-3xl w-full"
                style={{
                  imageRendering: 'pixelated',
                  boxShadow: 'inset 0 0 0 2px #FFE400, 0 0 0 4px #000000, 0 8px 0 0 #000000',
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}
              >
                <img
                  src={FINAL_OUTPUT_IMAGE}
                  alt="Final output"
                  className="w-full h-auto"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>

            {/* Prompt Input */}
            <div className="max-w-3xl mx-auto mt-8">
              <label 
                htmlFor="prompt" 
                className="font-pixel text-yellow-400 text-sm uppercase mb-3 block"
                style={{
                  textShadow: '2px 2px 0px #000000',
                  imageRendering: 'pixelated'
                }}
              >
                Enter Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your image transformation..."
                className="font-arcade text-base min-h-[120px] w-full bg-black border-4 border-yellow-400 text-yellow-400 p-4 resize-none focus:outline-none focus:border-cyan-400 transition-colors"
                style={{
                  textShadow: '1px 1px 0px #000000',
                  imageRendering: 'pixelated',
                  boxShadow: 'inset 0 0 0 2px #FFE400, 0 0 0 4px #000000',
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}
              />
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}