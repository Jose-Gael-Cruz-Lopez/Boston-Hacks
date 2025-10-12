'use client'

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { Storyboard } from "@/components/Storyboard";
import Spline from '@splinetool/react-spline/next';
import StableImg from "../assets/stableImg.png"; 
import Neon from "../assets/neon.jpg"; 
import Pixel from "../assets/pixel.jpg"; 
import Vintage from "../assets/vintage.png"; 

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
  img: string;
}

// Static stack of major changes
const majorChanges: MajorChange[] = [
  {
    title: "Background",
    details: ["Background color changed to blue", "Overlay applied"],
  },
  {
    title: "Brightness",
    details: ["Brightness increased by 20%", "Contrast adjusted"],
  },
  {
    title: "Saturation",
    details: ["Saturation enhanced", "Shadow depth added"],
  },
  {
    title: "Vintage Filter Applied",
    details: ["Filter vintage applied", "Grain texture added"],
  },
  {
    title: "Image Sharpness",
    details: ["Final color grading", "Sharpness optimized"],
  },
];

// Mock changes for storyboard
const mockChanges: Change[] = [
  {
    title: "Original",
    filterOptions: ["None"],
    intensity: 0,
    previewUrl: "/src/app/assets/stableImg.png",
    img: StableImg.src
  },
  {
    title: "Vintage",
    filterOptions: ["Sepia", "Grain", "Vignette"],
    intensity: 75,
    previewUrl: "/src/app/assets/stableImg.png",
    img: Vintage.src
  },
  {
    title: "Neon",
    filterOptions: ["Cyan", "Pink", "Purple"],
    intensity: 60,
    previewUrl: "/src/app/assets/stableImg.png",
    img: Neon.src
  },
  {
    title: "Pixel",
    filterOptions: ["Pixelate", "Scanlines", "Chromatic"],
    intensity: 85,
    previewUrl: "/src/app/assets/stableImg.png",
    img: Pixel.src
  },
  {
    title: "Final",
    filterOptions: ["Sharpness", "Contrast", "Brightness"],
    intensity: 90,
    previewUrl: "/src/app/assets/stableImg.png",
    img: StableImg.src
  }
];

const FINAL_OUTPUT_IMAGE = "/src/app/assets/stableImg.png";

export default function Workflow() {
  const [prompt, setPrompt] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Create refs for each dropdown using map
  const dropdownRefs = majorChanges.map(() => useRef<HTMLDivElement>(null));
  const buttonRefs = majorChanges.map(() => useRef<HTMLButtonElement>(null));
  
  // Create refs for modal elements
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const modalTextareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleDetails = (index: number) => {
    const dropdownElement = dropdownRefs[index].current;
    const buttonElement = buttonRefs[index].current;
    
    if (dropdownElement && buttonElement) {
      // Pure JavaScript DOM manipulation with smooth transitions
      const isVisible = dropdownElement.style.display !== 'none';
      
      if (isVisible) {
        // Hide dropdown with smooth transition
        dropdownElement.style.opacity = '0';
        dropdownElement.style.height = '0';
        dropdownElement.style.overflow = 'hidden';
        dropdownElement.style.transform = 'translateY(-10px)';
        
        // Update button icon with smooth rotation
        const chevronIcon = buttonElement.querySelector('svg');
        if (chevronIcon) {
          chevronIcon.style.transform = 'rotate(0deg)';
        }
        
        // Hide after transition completes
        setTimeout(() => {
          dropdownElement.style.display = 'none';
        }, 300);
      } else {
        // Show dropdown with smooth transition
        dropdownElement.style.display = 'block';
        dropdownElement.style.opacity = '0';
        dropdownElement.style.height = '0';
        dropdownElement.style.overflow = 'hidden';
        dropdownElement.style.transform = 'translateY(-10px)';
        
        // Trigger smooth animation
        setTimeout(() => {
          dropdownElement.style.opacity = '1';
          dropdownElement.style.height = 'auto';
          dropdownElement.style.overflow = 'visible';
          dropdownElement.style.transform = 'translateY(0)';
        }, 10);
        
        // Update button icon with smooth rotation
        const chevronIcon = buttonElement.querySelector('svg');
        if (chevronIcon) {
          chevronIcon.style.transform = 'rotate(180deg)';
        }
      }
    }
  };

  const openRepromptModal = (changeTitle: string) => {
    const overlay = modalOverlayRef.current;
    const content = modalContentRef.current;
    const textarea = modalTextareaRef.current;
    
    if (overlay && content && textarea) {
      // Set the change title in the modal
      const titleElement = content.querySelector('h3');
      const placeholderElement = textarea;
      
      if (titleElement) {
        titleElement.textContent = `Reprompt: ${changeTitle}`;
      }
      
      if (placeholderElement) {
        placeholderElement.placeholder = `Tell me how you want to change the ${changeTitle.toLowerCase()}...`;
      }
      
      // Clear textarea
      textarea.value = '';
      
      // Show modal with CSS transitions
      overlay.style.display = 'flex';
      overlay.style.opacity = '0';
      content.style.transform = 'scale(0.8)';
      
      // Trigger transitions
      setTimeout(() => {
        overlay.style.opacity = '1';
        content.style.transform = 'scale(1)';
      }, 10);
    }
  };

  const closeModal = () => {
    const overlay = modalOverlayRef.current;
    const content = modalContentRef.current;
    
    if (overlay && content) {
      // Hide modal with CSS transitions
      overlay.style.opacity = '0';
      content.style.transform = 'scale(0.8)';
      
      // Hide after transition
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300);
    }
  };

  const handleRepromptSubmit = () => {
    const textarea = modalTextareaRef.current;
    
    if (textarea && textarea.value.trim()) {
      console.log(`Reprompt submitted: ${textarea.value}`);
      // Here you would typically send the reprompt to your API
      closeModal();
    }
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
            Context History Flow
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
                        ref={buttonRefs[index]}
                        onClick={() => toggleDetails(index)}
                        className="bg-yellow-400 hover:bg-cyan-400 p-2 transition-colors z-10"
                        style={{
                          imageRendering: 'pixelated',
                          boxShadow: '0 0 0 2px #000000, 0 4px 0 0 #000000',
                          clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'
                        }}
                        aria-label="Toggle details"
                      >
                        <ChevronDown 
                          className="w-5 h-5 text-black" 
                          style={{ 
                            transform: 'rotate(0deg)',
                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        />
                      </button>
                    </div>
                    
                    <div
                      ref={dropdownRefs[index]}
                      className="space-y-3 bg-black/50 p-4 border-2 border-yellow-400"
                      style={{
                        imageRendering: 'pixelated',
                        boxShadow: 'inset 0 0 0 2px #FFE400, 0 0 0 2px #000000',
                        clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                        display: 'none',
                        opacity: '0',
                        height: '0',
                        overflow: 'hidden',
                        transform: 'translateY(-10px)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      {change.details.map((detail, detailIndex) => (
                        <div
                          key={detailIndex}
                          className="font-arcade text-sm md:text-base text-yellow-400 flex items-start gap-2"
                          style={{
                            textShadow: '1px 1px 0px #000000',
                            imageRendering: 'pixelated'
                          }}
                        >
                          <span className="text-yellow-400 mt-1 text-lg">•</span>
                          <span>{detail}</span>
                        </div>
                      ))}
                      
                      {/* Reprompt Button */}
                      <div className="mt-4 pt-4 border-t-2 border-yellow-400">
                        <button
                          onClick={() => openRepromptModal(change.title)}
                          className="bg-cyan-400 hover:bg-yellow-400 text-black font-pixel text-sm px-4 py-2 transition-colors uppercase"
                          style={{
                            imageRendering: 'pixelated',
                            boxShadow: '0 0 0 2px #000000, 0 4px 0 0 #000000',
                            clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                            textShadow: '1px 1px 0px #000000'
                          }}
                        >
                          Reprompt
                        </button>
                      </div>
                    </div>
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
                  src={StableImg.src}
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

      {/* Reprompt Modal Overlay - Pure Vanilla JS */}
      <div 
        ref={modalOverlayRef}
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        style={{
          display: 'none',
          transition: 'opacity 0.3s ease-in-out'
        }}
        onClick={closeModal}
      >
        <div 
          ref={modalContentRef}
          className="bg-black border-4 border-yellow-400 p-8 max-w-2xl w-full mx-4 relative"
          style={{
            imageRendering: 'pixelated',
            boxShadow: 'inset 0 0 0 2px #FFE400, 0 0 0 4px #000000, 0 8px 0 0 #000000',
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
            transition: 'transform 0.3s ease-in-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-pixel text-lg px-3 py-1 transition-colors"
            style={{
              imageRendering: 'pixelated',
              boxShadow: '0 0 0 2px #000000, 0 2px 0 0 #000000',
              clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))'
            }}
          >
            ×
          </button>

          {/* Modal Header */}
          <div className="mb-6">
            <h3 
              className="font-pixel text-yellow-400 text-xl uppercase mb-2"
              style={{
                textShadow: '2px 2px 0px #000000',
                imageRendering: 'pixelated'
              }}
            >
              Reprompt: Change
            </h3>
            <p 
              className="font-arcade text-yellow-400 text-sm"
              style={{
                textShadow: '1px 1px 0px #000000',
                imageRendering: 'pixelated'
              }}
            >
              Describe how you want to modify this aspect of your image
            </p>
          </div>

          {/* Chat Bubble Input */}
          <div className="mb-6">
            <textarea
              ref={modalTextareaRef}
              placeholder="Tell me how you want to change this aspect..."
              className="font-arcade text-base w-full bg-black border-4 border-yellow-400 text-yellow-400 p-4 resize-none focus:outline-none focus:border-cyan-400 transition-colors min-h-[120px]"
              style={{
                textShadow: '1px 1px 0px #000000',
                imageRendering: 'pixelated',
                boxShadow: 'inset 0 0 0 2px #FFE400, 0 0 0 4px #000000',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={closeModal}
              className="bg-gray-600 hover:bg-gray-700 text-white font-pixel text-sm px-6 py-2 transition-colors uppercase"
              style={{
                imageRendering: 'pixelated',
                boxShadow: '0 0 0 2px #000000, 0 4px 0 0 #000000',
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                textShadow: '1px 1px 0px #000000'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleRepromptSubmit}
              className="bg-yellow-400 hover:bg-cyan-400 text-black font-pixel text-sm px-6 py-2 transition-colors uppercase"
              style={{
                imageRendering: 'pixelated',
                boxShadow: '0 0 0 2px #000000, 0 4px 0 0 #000000',
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                textShadow: '1px 1px 0px #000000'
              }}
            >
              Submit Reprompt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}