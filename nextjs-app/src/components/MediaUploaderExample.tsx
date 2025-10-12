import { useState } from 'react'
import MediaUploader from '@/components/MediaUploader'

/**
 * Example usage of the MediaUploader component
 */
export default function MediaUploaderExample() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file)
    console.log('Selected file:', file)
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Media Uploader Example</h2>
      
      <MediaUploader
        onChange={handleFileChange}
        accept="image/*,video/*"
        maxSize={5} // 5MB limit
        placeholder="Upload an image or video"
      />

      {selectedFile && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">File Information:</h3>
          <p><strong>Name:</strong> {selectedFile.name}</p>
          <p><strong>Type:</strong> {selectedFile.type}</p>
          <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}
    </div>
  )
}

