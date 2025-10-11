'use client';

import { useState } from 'react';
import { 
  validateImageFile,
  getImagePreview,
  downloadImageFromDataUrl 
} from '../lib/2ndCall';

import { GoogleGenAI } from "@google/genai";
// This service asks Gemini to return a JSON list of natural-language
// instructions for an iterative image editing workflow. It does NOT
// translate to numeric parameters or a fixed action schema.

//const { GoogleGenerativeAI } = require('@google/generative-ai');
import {GoogleGenerativeAI} from "@google/generative-ai"
class GeminiParseService {
    constructor() {
        this.apiKey = "AIzaSyCU_GLvprFPmHIMHH7VRM99Pl5fDIQxwiU";
        this.client = new GoogleGenerativeAI(this.apiKey);
        this.model = this.client.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            systemInstruction: {
                role: 'system',
                parts: [
                    {
                        text: `You are an expert image editing planner.
Break a user's request into a concise, ordered list of natural-language instructions
that could be executed iteratively in a future editing session.

Constraints:
- Output ONLY JSON that matches the provided schema.
- No explanations, no markdown, no code fences.
- Keep instructions minimal, atomic, and clearly actionable in natural language.`
                    }
                ]
            }
        });
    }

    // Schema requiring only a list of natural-language instructions
    getResponseSchema() {
        return {
            type: 'object',
            properties: {
                instructions: {
                    type: 'array',
                    items: { type: 'string' },
                    minItems: 1
                },
                warnings: {
                    type: 'array',
                    items: { type: 'string' }
                }
            },
            required: ['instructions'],
        };
    }

    async generateInstructions(userInput, options = {}) {
        if (!userInput || typeof userInput !== 'string') {
            throw new Error('Invalid input: userInput must be a non-empty string');
        }

        // set up config for the model
        const config = {
            responseMimeType: 'application/json',
            responseSchema: this.getResponseSchema()
        };

        // request contents
        const contents = [
            {
                role: 'user',
                parts: [
                    { text: 'Create a list of step-by-step, natural-language image editing instructions.' },
                    { text: 'User request:' },
                    { text: userInput },
                    { text: 'Optional UI context (JSON):' },
                    { text: JSON.stringify(options) },
                    { text: "Return ONLY valid JSON with an 'instructions' array of strings. No markdown. No code fences." }
                ]
            }
        ];

        const result = await this.model.generateContent({ 
            contents, 
            generationConfig: config });

        const text = result?.response?.text?.() ?? '';
        if (!text) throw new Error('No response from Gemini');

        // remove accidental code fences
        const cleaned = text.trim().replace(/^```json\s*|\s*```$/g, '');

        let parsed;
        try {
            parsed = JSON.parse(cleaned);
        } catch (e) {
            const snippet = cleaned.slice(0, 400);
            throw new Error(`Failed to parse JSON from Gemini. First 400 chars:\n${snippet}`);
        }

        // validate the response
        if (!Array.isArray(parsed.instructions)) {
            throw new Error("Invalid response: 'instructions' must be an array of strings");
        }

        // Ensure every instruction is a string; coerce simple objects if needed
        parsed.instructions = parsed.instructions
            .filter((item) => item != null)
            .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)));

        return parsed;
    }
}


export default function SimpleGeminiExample() {
 const ParseUserPrompt = new GeminiParseService(); 

  const ai = new GoogleGenAI({ apiKey: "AIzaSyCU_GLvprFPmHIMHH7VRM99Pl5fDIQxwiU" });

  // State
  const [selectedFile, setSelectedFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [respImageURL, setRespImageURL] = useState(null);
  const [parsedPrompt, set_parsedPrompt] = useState("Null"); 

  // Helper function to convert file to generative part
  function fileToGenerativePart(buffer, mimeType) { 
    return { 
      inlineData: {
        data: buffer.toString("base64"), 
        mimeType: mimeType
      }
    };
  }

  // Direct Gemini API call
  const testGoogleDirect = async (promptText, selectedFile) => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }
/*
    setIsLoading(true);
    setError(null);
    setRespImageURL(null);
*/ 


    try {
        //parsing user prompt
     const parsedPrompt = await ParseUserPrompt.generateInstructions(promptText);
    set_parsedPrompt(JSON.stringify(parsedPrompt));
  //console.log(JSON.stringify(parsedPrompt))
       // console.log("Parsed user prompt: ", parsedPrompt); 
      // Convert file to buffer
      const imgBuffer = await selectedFile.arrayBuffer(); 
      const buff = Buffer.from(imgBuffer); 
      const imgGePart = fileToGenerativePart(buff, selectedFile.type); 

      // Call Gemini API
      const resp = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: [
          {
            role: "user",
            parts: [
              { text: JSON.stringify(parsedPrompt) },
              imgGePart
            ]
          }
        ]
      });

      // Process response
      for (const part of resp.candidates[0].content.parts) {
        if (part.text) {
          console.log('Text response:', part.text);
          setError('Model returned text instead of image: ' + part.text);
        } else if (part.inlineData) {
          const imgData = part.inlineData.data; 
          const dataUrl = `data:${part.inlineData.mimeType};base64,${imgData}`;
          setRespImageURL(dataUrl); 
          console.log("Image generated successfully");
          setError(null);
        }
      }
    } catch (e) {
      console.error("Error in testGoogleDirect:", e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      setSelectedFile(file);
      setError(null);
      setRespImageURL(null);
      
      try {
        const previewUrl = await getImagePreview(file);
        setPreview(previewUrl);
      } catch (err) {
        setError('Error creating preview');
      }
    }
  };

  // Download image
  const handleDownload = () => {
    if (result?.imageData) {
      downloadImageFromDataUrl(result.imageData, `gemini-${result.action}-${Date.now()}.png`);
    }
  };

  // Download direct test result
  const handleDownloadDirect = () => {
    if (respImageURL) {
      downloadImageFromDataUrl(respImageURL, `gemini-direct-${Date.now()}.png`);
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedFile(null);
    setPrompt('');
    setResult(null);
    setError(null);
    setPreview(null);
    setRespImageURL(null);
  };






  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8" style = {{alignContent:"center", justifyContent:"center", alignItems:"center"}}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Gemini Image Editor</h2>
        
        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full p-2 border rounded"
          />
          {preview && (
            <div className="mt-4 flex justify-center">
              <img 
                src={preview} 
                alt="Preview" 
                className="rounded shadow-md"
                style={{ maxHeight: '200px', maxWidth: '100%' }}
              />
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            {selectedFile ? 'Editing Instructions' : 'Image Description'}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              selectedFile 
                ? "e.g., Make the background blue, add stars"
                : "e.g., A serene mountain landscape at sunset"
            }
            className="w-full p-3 border rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <button
            onClick={() => testGoogleDirect(prompt || "Make this image with blue background", selectedFile)}
            disabled={!selectedFile || isLoading}
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Processing...' : 'Direct API Test'}
          </button>
        </div>

        <button
          onClick={resetForm}
          className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition"
        >
          Reset Form
        </button>


            <h1 style={{color:"red", fontSize: 100}}>
                {parsedPrompt}
            </h1>


        {/************************************ */}

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mt-4 text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Processing your request...</p>
          </div>
        )}
      </div>

      {/* Direct API Result */}
      {respImageURL && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 text-purple-600">Direct API Result</h3>
          <div className="border rounded overflow-hidden mb-4">
            <img
              src={respImageURL}
              alt="Direct API result"
              className="w-full h-auto"
            />
          </div>
          <button
            onClick={handleDownloadDirect}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
          >
            Download Direct Result
          </button>
        </div>
      )}

      {/* API Route Results */}
      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
            <p className="text-green-600 font-medium">{result.message}</p>
          </div>
          
          <h3 className="text-xl font-bold mb-4">
            {result.action === 'edit' ? 'Edited Image' : 'Generated Image'}
          </h3>
          
          {result.imageData ? (
            <div>
              <div className="border rounded overflow-hidden mb-4">
                <img
                  src={result.imageData}
                  alt={result.action === 'edit' ? 'Edited result' : 'Generated result'}
                  className="w-full h-auto"
                />
              </div>
              <button
                onClick={handleDownload}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Download Image
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 border rounded p-4">
              <p className="text-sm text-gray-600 mb-2">Analysis:</p>
              <div className="whitespace-pre-wrap text-sm text-gray-700">
                {result.analysis}
              </div>
              {result.note && (
                <p className="mt-3 text-sm text-amber-600 italic">{result.note}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}