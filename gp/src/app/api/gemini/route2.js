import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: "AIzaSyCU_GLvprFPmHIMHH7VRM99Pl5fDIQxwiU"});

async function main() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: 'Why is the sky blue?',
  });
  console.log("Repsonse: ", response.text);
}

