import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ChangeObject, GenerateChangesResponse, ApiErrorResponse } from '@/types/api'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const prompt = formData.get('prompt') as string

    // Validate inputs
    if (!file) {
      const errorResponse: ApiErrorResponse = { error: 'No file provided' }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    if (!prompt || prompt.trim() === '') {
      const errorResponse: ApiErrorResponse = { error: 'No prompt provided' }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi', 'video/webm']
    if (!allowedTypes.includes(file.type)) {
      const errorResponse: ApiErrorResponse = { error: 'Invalid file type. Only images and videos are allowed.' }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      const errorResponse: ApiErrorResponse = { error: 'File size too large. Maximum 10MB allowed.' }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      const errorResponse: ApiErrorResponse = { error: 'Gemini API key not configured' }
      return NextResponse.json(errorResponse, { status: 500 })
    }

    // Convert file to base64 for Gemini
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const mimeType = file.type

    // Generate changes using Gemini
    const changes = await generateChangesWithGemini(base64, mimeType, prompt)

    const response: GenerateChangesResponse = {
      success: true,
      changes,
      fileInfo: {
        name: file.name,
        type: file.type,
        size: file.size
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in /api/generate-changes:', error)
    
    const errorResponse: ApiErrorResponse = {
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
    
    return NextResponse.json(errorResponse, { status: 500 })
  }
}

async function generateChangesWithGemini(base64: string, mimeType: string, prompt: string): Promise<ChangeObject[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const instructionPrompt = `
    You are an AI content editing assistant. Given a user's prompt for editing ${mimeType.startsWith('image/') ? 'image' : 'video'} content, generate specific editing instructions.

    User Prompt: "${prompt}"

    Please provide a JSON response with the following structure:
    {
      "changes": [
        {
          "title": "Brief descriptive title of the change",
          "filterOptions": ["filter1", "filter2", "filter3"],
          "intensity": 50
        }
      ]
    }

    Guidelines:
    - Generate 3-5 specific editing changes
    - Each change should be actionable and specific
    - Filter options should be relevant to the change (e.g., "Brightness", "Contrast", "Saturation", "Blur", "Sharpen", "Vignette", "Grain", "Color Temperature", "Hue Shift", "Exposure", "Highlights", "Shadows")
    - Intensity should be a number between 0-100 representing the strength of the change
    - Make changes relevant to the user's prompt
    - Consider the media type (image vs video) when suggesting changes

    Return only the JSON response, no additional text.
    `

    const result = await model.generateContent([
      instructionPrompt,
      {
        inlineData: {
          data: base64,
          mimeType: mimeType
        }
      }
    ])

    const response = await result.response
    const text = response.text()

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI')
    }

    const parsedResponse = JSON.parse(jsonMatch[0])
    
    // Validate the response structure
    if (!parsedResponse.changes || !Array.isArray(parsedResponse.changes)) {
      throw new Error('Invalid response structure from AI')
    }

    // Validate each change object
    const validatedChanges = parsedResponse.changes.map((change: any, index: number) => {
      if (!change.title || !change.filterOptions || typeof change.intensity !== 'number') {
        throw new Error(`Invalid change object at index ${index}`)
      }

      return {
        title: change.title,
        filterOptions: Array.isArray(change.filterOptions) ? change.filterOptions : [change.filterOptions],
        intensity: Math.max(0, Math.min(100, change.intensity)) // Clamp between 0-100
      }
    })

    return validatedChanges

  } catch (error) {
    console.error('Error generating changes with Gemini:', error)
    
    // Return fallback changes if Gemini fails
    return generateFallbackChanges(prompt)
  }
}

function generateFallbackChanges(prompt: string): ChangeObject[] {
  // Fallback changes based on common keywords in the prompt
  const lowerPrompt = prompt.toLowerCase()
  
  const changes: ChangeObject[] = []

  // Lighting adjustments
  if (lowerPrompt.includes('bright') || lowerPrompt.includes('dark') || lowerPrompt.includes('light')) {
    changes.push({
      title: 'Adjust Lighting',
      filterOptions: ['Brightness', 'Contrast', 'Exposure'],
      intensity: 60
    })
  }

  // Color adjustments
  if (lowerPrompt.includes('color') || lowerPrompt.includes('saturat') || lowerPrompt.includes('vibrant')) {
    changes.push({
      title: 'Enhance Colors',
      filterOptions: ['Saturation', 'Vibrance', 'Hue Shift'],
      intensity: 50
    })
  }

  // Vintage/film effects
  if (lowerPrompt.includes('vintage') || lowerPrompt.includes('film') || lowerPrompt.includes('retro')) {
    changes.push({
      title: 'Apply Vintage Effect',
      filterOptions: ['Grain', 'Vignette', 'Color Temperature'],
      intensity: 70
    })
  }

  // Cinematic effects
  if (lowerPrompt.includes('cinematic') || lowerPrompt.includes('dramatic') || lowerPrompt.includes('movie')) {
    changes.push({
      title: 'Cinematic Enhancement',
      filterOptions: ['Contrast', 'Highlights', 'Shadows', 'Vignette'],
      intensity: 65
    })
  }

  // Sharpness/blur effects
  if (lowerPrompt.includes('sharp') || lowerPrompt.includes('blur') || lowerPrompt.includes('focus')) {
    changes.push({
      title: 'Adjust Sharpness',
      filterOptions: ['Sharpen', 'Blur', 'Clarity'],
      intensity: 40
    })
  }

  // Default changes if no specific keywords found
  if (changes.length === 0) {
    changes.push(
      {
        title: 'Enhance Overall Quality',
        filterOptions: ['Contrast', 'Saturation', 'Clarity'],
        intensity: 50
      },
      {
        title: 'Adjust Lighting',
        filterOptions: ['Brightness', 'Highlights', 'Shadows'],
        intensity: 45
      }
    )
  }

  return changes
}

// Handle unsupported methods
export async function GET() {
  const errorResponse: ApiErrorResponse = { error: 'Method not allowed. Use POST to generate changes.' }
  return NextResponse.json(errorResponse, { status: 405 })
}
