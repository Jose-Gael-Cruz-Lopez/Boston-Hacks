import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";



export function generateEditingInstructionsLocal(promptText) {
  if (!promptText || typeof promptText !== "string") {
    throw new Error("Invalid input: promptText must be a non-empty string");
  }

  // Split by commas, semicolons, or 'and'
  const rawParts = promptText
    .split(/,|;|\band\b/gi)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  // Normalize and capitalize each instruction
  const instructions = rawParts.map((inst) => {
    const cleaned = inst.replace(/\.$/, "").trim();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  });

  // Optional simple warning detection
  const warnings = [];
  if (promptText.length > 200) {
    warnings.push("Prompt is quite long — some steps may overlap.");
  }
  if (instructions.length > 8) {
    warnings.push("Too many edits requested at once — consider fewer changes.");
  }

  return {
    instructions,
    warnings,
  };
}


const ai = new GoogleGenAI({ apiKey: "AIzaSyCU_GLvprFPmHIMHH7VRM99Pl5fDIQxwiU" });

function fileToGenerativePart(buffer, mimeType) { 
    return { 
        inlineData: {
            data: buffer.toString("base64"), 
            mimeType: mimeType,
        }
    };
}

export const testGoogleDirect = async (promptText, selectedFile, set_parsedPrompt, setRespImageURL, selectedFile2 = false) => {
    
    if (!selectedFile) {
        return "Please select an image first";
    }

    //let PromptParser = new GeminiParseService(); 

    try {
        // SKIP PARSING - Just use the prompt directly
      let parsedPrompt = generateEditingInstructionsLocal(promptText); 
      //   alert(JSON.stringify(parsedPrompt)); 

       // console.log('Using prompt directly:', promptText);
        //set_parsedPrompt(`Using prompt: ${promptText}`);
        
        // Convert file to buffer
        const imgBuffer = await selectedFile.arrayBuffer(); 
        const buff = Buffer.from(imgBuffer); 
        const imgGePart1 = fileToGenerativePart(buff, selectedFile.type);
        
        let _parts = [
            { text: promptText },  // ✅ Use prompt directly, no parsing!
            imgGePart1
        ];

        if (selectedFile2 != false) {
            const imgBuffer2 = await selectedFile2.arrayBuffer(); 
            const buff2 = Buffer.from(imgBuffer2); 
            const imgGePart2 = fileToGenerativePart(buff2, selectedFile2.type);
            _parts.push(imgGePart2);
        }
    
        // Call Gemini API
        console.log('Calling Gemini API...');

        
        const resp = await ai.models.generateContent({
            model: "gemini-2.5-flash-image-preview",
            contents: [
                {
                    role: "user",
                    parts: _parts
                }
            ]
        });

        console.log('Response received!');
        set_parsedPrompt(JSON.stringify(parsedPrompt));

        // Process response
        for (const part of resp.candidates[0].content.parts) {
            if (part.text) {
                console.log('Text response:', part.text);
                //set_parsedPrompt(prev => prev + '\n\n📝 ' + part.text);
                return 'Model returned text instead of image: ' + part.text;
            } else if (part.inlineData) {
                const imgData = part.inlineData.data; 
                const dataUrl = `data:${part.inlineData.mimeType};base64,${imgData}`;
                setRespImageURL(dataUrl); 
                console.log("Image generated successfully!");
               // set_parsedPrompt(prev => prev + '\n\n✅ Image generated successfully!');
                return "Success! Image generated.";
            }
        }

        return "No image found in response";

    } catch (e) {
        console.error("Error in testGoogleDirect:", e);
        set_parsedPrompt('Error: ' + e.message);
        return 'Error: ' + e.message;
    }
};