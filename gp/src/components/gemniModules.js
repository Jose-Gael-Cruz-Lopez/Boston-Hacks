import { GoogleGenAI } from "@google/genai";
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

const ai = new GoogleGenAI({ apiKey: "AIzaSyCU_GLvprFPmHIMHH7VRM99Pl5fDIQxwiU" });// Helper function to convert file to generative part
function fileToGenerativePart(buffer, mimeType) { 
    return { 
      inlineData: {
        data: buffer.toString("base64"), 
        mimeType: mimeType
      }
    };
  }

  // Direct Gemini API call
export const testGoogleDirect = async (promptText, selectedFile) => {
    const ParseUserPrompt = new GoogleGenAI(); 
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
    //set_parsedPrompt(JSON.stringify(parsedPrompt));
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


