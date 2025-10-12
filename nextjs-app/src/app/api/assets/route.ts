import { NextResponse } from 'next/server'

// Mock graphic asset names - in a real app, this would come from a database
const GRAPHIC_ASSETS = [
  // Lighting Effects
  'Brightness',
  'Contrast',
  'Exposure',
  'Highlights',
  'Shadows',
  'Vibrance',
  'Saturation',
  'Temperature',
  'Tint',
  
  // Color Effects
  'Hue Shift',
  'Color Balance',
  'Color Grading',
  'Split Toning',
  'Color Lookup',
  'Selective Color',
  'Channel Mixer',
  
  // Artistic Effects
  'Grain',
  'Noise Reduction',
  'Sharpen',
  'Blur',
  'Motion Blur',
  'Radial Blur',
  'Gaussian Blur',
  'Box Blur',
  
  // Stylistic Effects
  'Vignette',
  'Glow',
  'Bloom',
  'Lens Flare',
  'Chromatic Aberration',
  'Distortion',
  'Fisheye',
  'Perspective',
  
  // Film Effects
  'Film Grain',
  'Film Color',
  'Vintage',
  'Sepia',
  'Black & White',
  'Duotone',
  'Cross Process',
  'Faded',
  
  // Creative Effects
  'Pixelate',
  'Mosaic',
  'Oil Painting',
  'Watercolor',
  'Sketch',
  'Emboss',
  'Relief',
  'Posterize',
  
  // Technical Effects
  'Clarity',
  'Structure',
  'Detail',
  'Micro Contrast',
  'Local Contrast',
  'HDR',
  'Tone Mapping',
  'Dynamic Range',
  
  // Special Effects
  'Neon Glow',
  'Cyberpunk',
  'Synthwave',
  'Retrowave',
  'Vaporwave',
  'Glitch',
  'Data Moshing',
  'Pixel Sorting'
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return NextResponse.json({
      success: true,
      assets: GRAPHIC_ASSETS,
      count: GRAPHIC_ASSETS.length
    })
  } catch (error) {
    console.error('Error fetching assets:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch assets',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

