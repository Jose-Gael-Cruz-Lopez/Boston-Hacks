// Example of how to use the GeminiImageEditor component in your existing Next.js app

import GeminiImageEditor from './GeminiImageEditor';

export default function ExampleUsage() {
  // Example 1: Basic usage
  const BasicExample = () => (
    <div className="p-4">
      <h2>Basic Image Editor</h2>
      <GeminiImageEditor />
    </div>
  );

  // Example 2: With custom styling and callback
  const handleImageProcessed = (result) => {
    console.log('Image processed:', result);
    // Custom logic when image is processed
    // You could save to database, show notification, etc.
  };

  const CustomExample = () => (
    <div className="max-w-md mx-auto p-4">
      <h2>Custom Styled Editor</h2>
      <GeminiImageEditor 
        onImageProcessed={handleImageProcessed}
        className="border-2 border-blue-200 rounded-xl"
        showGenerateOption={true}
      />
    </div>
  );

  // Example 3: Only image generation (no upload)
  const GenerationOnlyExample = () => (
    <div className="p-4">
      <h2>Image Generation Only</h2>
      <GeminiImageEditor 
        showGenerateOption={false}
        className="bg-gray-50"
      />
    </div>
  );

  return (
    <div className="space-y-8">
      <BasicExample />
      <CustomExample />
      <GenerationOnlyExample />
    </div>
  );
}

// Props for GeminiImageEditor component:
/*
Props:
- onImageProcessed: (result) => void - Callback when image is processed
- className: string - Custom CSS classes
- showGenerateOption: boolean - Show/hide the generate option (default: true)

Result object structure:
{
  success: boolean,
  message: string,
  imageData: string, // Base64 data URL
  prompt: string,
  action: 'edit' | 'generate'
}
*/
