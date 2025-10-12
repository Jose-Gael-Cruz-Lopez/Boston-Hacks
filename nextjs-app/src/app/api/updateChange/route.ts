import { NextRequest, NextResponse } from 'next/server'

interface ChangeObject {
  title: string
  filterOptions: string[]
  intensity: number
  previewUrl: string
}

interface UpdateChangeRequest {
  index: number
  newPrompt: string
  filter: string
  intensity: number
}

interface UpdateChangeResponse {
  success: boolean
  updatedChange?: ChangeObject
  error?: string
}

export async function PATCH(request: NextRequest): Promise<NextResponse<UpdateChangeResponse>> {
  try {
    const body: UpdateChangeRequest = await request.json()
    const { index, newPrompt, filter, intensity } = body

    if (typeof index !== 'number' || !newPrompt || !newPrompt.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request: index must be a number and newPrompt is required'
      }, { status: 400 })
    }

    // Simulate processing delay for realistic loading animation
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock updated change based on the prompt, filter, and intensity
    const updatedChange: ChangeObject = {
      title: `Enhanced: ${newPrompt.substring(0, 25)}${newPrompt.length > 25 ? '...' : ''}`,
      filterOptions: [filter, 'Enhanced', 'Custom', 'Updated'],
      intensity: intensity,
      previewUrl: `/api/placeholder/400/300?t=${Date.now()}&filter=${encodeURIComponent(filter)}&intensity=${intensity}` // Add parameters to force refresh
    }

    return NextResponse.json({
      success: true,
      updatedChange
    })

  } catch (error) {
    console.error('Error updating change:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed. Use PATCH to update changes.'
  }, { status: 405 })
}

export async function POST() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed. Use PATCH to update changes.'
  }, { status: 405 })
}

