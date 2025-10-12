import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI('AIzaSyCU_GLvprFPmHIMHH7VRM99Pl5fDIQxwiU')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageBase64, mimeType, prompt } = body

    if (!imageBase64 || !mimeType || !prompt) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters: imageBase64, mimeType, and prompt are required' 
      }, { status: 400 })
    }

    // Call Gemini to edit the image using your API key and model
    const editedImage = await editImageWithGemini(imageBase64, mimeType, prompt)

    if (editedImage) {
      return NextResponse.json({ 
        success: true, 
        editedImage 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to edit image with Gemini' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error in /api/gemini:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

async function editImageWithGemini(base64: string, mimeType: string, prompt: string): Promise<string | null> {
  try {
    // Use a supported Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64,
          mimeType: mimeType
        }
      },
      { text: prompt }
    ])

    const response = await result.response
    const parts = response.candidates?.[0]?.content?.parts

    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
        }
      }
    }
    return null

  } catch (error) {
    console.error('Error editing image with Gemini:', error)
    return null
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ 
    success: false, 
    error: 'Method not allowed. Use POST to edit images.' 
  }, { status: 405 })
}
