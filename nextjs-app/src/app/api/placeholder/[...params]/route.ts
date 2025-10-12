import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  const [width, height] = params.params
  
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1a1a1a"/>
      <rect x="10" y="10" width="calc(100% - 20px)" height="calc(100% - 20px)" 
            fill="none" stroke="#FFE400" stroke-width="4"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
            font-family="monospace" font-size="16" fill="#FFE400">
        ${width || 400} × ${height || 300}
      </text>
    </svg>
  `
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}


