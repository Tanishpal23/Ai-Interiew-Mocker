import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export default async function generateAIResponse(userInput) {
  const model = "gemini-2.5-flash-lite";

  const contents = [
    {
      role: "user",
      parts: [{ text: userInput }],
    },
  ];

  const config = {
    thinkingConfig: {
      thinkingBudget: 0,
    },
    tools: [
      {
        googleSearch: {},
      },
    ],
  };

  const stream = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let finalText = "";

  for await (const chunk of stream) {
    if (chunk.text) {
      finalText += chunk.text;
    }
  }

  return finalText;
}
