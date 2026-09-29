const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_INSTRUCTION = process.env.GEMINI_SYSTEM_INSTRUCTION;


const generateAnswer = async (question, context = "") => {
  if (!question || !question.trim()) {
    throw new Error("Question is required");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: `Background information about Asaad Dangi:
${context || "(none found)"}

User question:
${question}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  return response.text;
};

module.exports = {
  generateAnswer,
};