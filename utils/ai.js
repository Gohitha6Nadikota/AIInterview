const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-3.8-flash",
  generationConfig: {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  },
});

const DEFAULT_TIMEOUT_MS = 30000;

export const generateJson = async (prompt, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) => {
  const result = await model.generateContent(prompt, { timeout: timeoutMs });
  const text = result.response
    .text()
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  return JSON.parse(text);
};
