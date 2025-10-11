'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function GeminiImageEditor({ 
  onImageProcessed, 
  className = "",
  showGenerateOption = true 
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (action = 'edit') => {
    if (action === 'edit' && (!selectedFile || !prompt.trim())) {
      setError('Please select an image and enter a prompt');
      return;
    }

    if (action === 'generate' && !prompt.trim()) {
      setError('Please enter a prompt for image generation');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      formData.append('prompt', prompt);
      formData.append('action', action);

      const response = await fetch('/api/gemini', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        if (onImageProcessed) {
          onImageProcessed(data);
        }
      } else {
        setError(data.error || 'Failed to process image');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPrompt('');
    setResult(null);
    setError(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadImage = () => {
    if (result?.imageData) {
      const link = document.createElement('a');
      link.href = result.imageData;
      link.download = `gemini-${result.action}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };



  return ( //return 
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        🎨 AI Image Editor
      </h2>
      
      {/* File Upload (only for editing) */}
      {showGenerateOption && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image (for editing)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {preview ? (
                <div className="mb-2">
                  <Image
                    src={preview}
                    alt="Preview"
                    width={150}
                    height={150}
                    className="rounded-lg object-cover mx-auto"
                  />
                </div>
              ) : (
                <div className="text-gray-400 mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <span className="text-sm text-gray-600">
                {selectedFile ? selectedFile.name : 'Click to upload an image'}
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Prompt Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {selectedFile ? 'Editing Instructions' : 'Image Description'}
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            selectedFile 
              ? "Describe how you want to edit the image... (e.g., 'Make it look like a painting', 'Add a sunset background')"
              : "Describe the image you want to generate... (e.g., 'A beautiful sunset over mountains', 'A cute cat in a garden')"
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        {selectedFile && (
          <button
            onClick={() => processImage('edit')}
            disabled={!prompt.trim() || isLoading}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Editing...' : 'Edit Image'}
          </button>
        )}
        
        <button
          onClick={() => processImage('generate')}
          disabled={!prompt.trim() || isLoading}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      <button
        onClick={resetForm}
        className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors mb-4"
      >
        Reset
      </button>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600 text-sm">Processing...</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-600 font-medium text-sm">{result.message}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {result.action === 'edit' ? 'Edited Image' : 'Generated Image'}
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <Image
                src={result.imageData}
                alt={result.action === 'edit' ? 'Edited result' : 'Generated result'}
                width={400}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <button
              onClick={downloadImage}
              className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Download Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
