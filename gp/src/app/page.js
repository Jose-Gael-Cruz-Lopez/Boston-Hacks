import SimpleGeminiExample from '../components/SimpleGeminiExample';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4" style = {{alignContent:"center", display:"flex", alignItems:"center", justifyContent:"center"}}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎨 Gemini Image Editor
          </h1>
          <p className="text-gray-600">
            Upload an image and describe how you want to edit it, or generate a new image from text
          </p>
        </div>
        
        <SimpleGeminiExample />
      </div>
    </div>
  );
}
