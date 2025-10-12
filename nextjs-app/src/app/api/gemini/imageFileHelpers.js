// Utility functions for Gemini image processing

/**
 * Helper function to convert file to base64 for Gemini
 * @param {File} file - The image file to convert
 * @param {string} mimeType - The MIME type of the file
 * @returns {Object} Formatted data for Gemini API
 */
function fileToGenerativePart(file, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(file).toString('base64'),
        mimeType
      },
    };
  }
  
  /**
   * Helper function to get MIME type from file
   * @param {File} file - The file to get MIME type for
   * @returns {string} The MIME type
   */
  function getMimeType(file) {
    return file.type || 'image/jpeg';
  }
  
  /**
   * Call the Gemini API through the Next.js API route
   * @param {Object} options - Processing options
   * @param {File} options.imageFile - Image file (for editing)
   * @param {string} options.prompt - Text prompt
   * @param {string} options.action - 'edit' or 'generate'
   * @returns {Promise<Object>} Result object
   */
  export async function callGeminiAPI({ imageFile, prompt, action = 'edit' }) {
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
      }
      formData.append('prompt', prompt);
      formData.append('action', action);
  
      const response = await fetch('/api/gemini', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return {
        success: false,
        error: error.message,
        details: error.toString()
      };
    }
  }
  
  /**
   * Download image from base64 data URL
   * @param {string} dataUrl - The base64 data URL
   * @param {string} filename - Optional filename
   */
  export function downloadImageFromDataUrl(dataUrl, filename = null) {
    try {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename || `gemini-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }
  
  /**
   * Validate image file
   * @param {File} file - The file to validate
   * @returns {Object} Validation result
   */
  export function validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
  
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }
  
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' };
    }
  
    if (file.size > maxSize) {
      return { valid: false, error: 'File too large. Maximum size is 10MB.' };
    }
  
    return { valid: true };
  }
  
  /**
   * Get image preview from file
   * @param {File} file - The file to create preview for
   * @returns {Promise<string>} Data URL for preview
   */
  export function getImagePreview(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
  
  // Export all functions as default object for convenience
  export default {
    callGeminiAPI,
    downloadImageFromDataUrl,
    validateImageFile,
    getImagePreview
  };