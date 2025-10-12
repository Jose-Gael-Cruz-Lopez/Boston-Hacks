// API Response Types

export interface ChangeObject {
  title: string
  filterOptions: string[]
  intensity: number
}

export interface GenerateChangesResponse {
  success: boolean
  changes: ChangeObject[]
  fileInfo: {
    name: string
    type: string
    size: number
  }
}

export interface ApiErrorResponse {
  error: string
  details?: string
}

// Common filter options
export const FILTER_OPTIONS = [
  'Brightness',
  'Contrast',
  'Saturation',
  'Vibrance',
  'Hue Shift',
  'Color Temperature',
  'Exposure',
  'Highlights',
  'Shadows',
  'Blur',
  'Sharpen',
  'Clarity',
  'Vignette',
  'Grain',
  'Noise Reduction',
  'White Balance',
  'Tint',
  'Gamma',
  'Black Point',
  'White Point'
] as const

export type FilterOption = typeof FILTER_OPTIONS[number]

