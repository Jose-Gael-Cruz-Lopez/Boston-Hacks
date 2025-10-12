import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyCU_GLvprFPmHIMHH7VRM99Pl5fDIQxwiU')

export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('image') as File
    const prompt = formData.get('prompt') as string

    // Validate inputs
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No image file provided' 
      }, { status: 400 })
    }

    if (!prompt || prompt.trim() === '') {
      return NextResponse.json({ 
        success: false, 
        error: 'No prompt provided' 
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file type. Only images are allowed.' 
      }, { status: 400 })
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        error: 'File size too large. Maximum 10MB allowed.' 
      }, { status: 400 })
    }

    // Convert file to base64 for Gemini
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const mimeType = file.type

    // Call Gemini API for image editing
    const editedImage = await editImageWithGemini(base64, mimeType, prompt)

    if (!editedImage) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to generate edited image' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      editedImage: editedImage,
      originalFile: {
        name: file.name,
        type: file.type,
        size: file.size
      }
    })

  } catch (error) {
    console.error('Error in /api/gemini-edit:', error)
    
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function editImageWithGemini(base64: string, mimeType: string, prompt: string): Promise<string | null> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const result = await model.generateContent([
      {
        text: `Please edit this image according to the following prompt: "${prompt}". 
        
        Guidelines:
        - Apply the requested changes to the image
        - Maintain the original composition and subject
        - Return the edited image as a base64 encoded image
        - Use high quality output
        - If the prompt is unclear, make reasonable artistic enhancements`
      },
      {
        inlineData: {
          data: base64,
          mimeType: mimeType
        }
      }
    ])

    const response = await result.response

    // Look for image data in the response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imgData = part.inlineData.data
        const dataUrl = `data:${part.inlineData.mimeType};base64,${imgData}`
        return dataUrl
      }
    }

    // If no image found, return null
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
