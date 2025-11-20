import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export default async function PromptImproviser({ prompt, systemInstruction }) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
    },
  });
//   console.log("Gemini Response:", response.text);
  return response.text;
}
